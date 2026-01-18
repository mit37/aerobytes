import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'SET_MEAL_PRICE':
      return {
        ...state,
        mealPrice: action.payload
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        mealPrice: action.payload.mealPrice || 0
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    mealPrice: 0
  });
  const [isLoaded, setIsLoaded] = React.useState(false);
  const prevUserEmail = React.useRef(user?.email);

  // Load/Merge cart when user changes
  useEffect(() => {
    setIsLoaded(false);

    // Determine source
    const guestCartJson = localStorage.getItem('cart_guest');
    const guestCart = guestCartJson ? JSON.parse(guestCartJson) : { items: [], mealPrice: 0 };

    if (user) {
      // LOGIN or PERSISTENT USER
      const userKey = `cart_${user.email}`;
      const userCartJson = localStorage.getItem(userKey);
      const userCart = userCartJson ? JSON.parse(userCartJson) : { items: [], mealPrice: 0 };

      // If we just logged in (prev was null or different email)
      if (prevUserEmail.current !== user.email) {
        // Merge guest items into user items
        const mergedItems = [...userCart.items];
        guestCart.items.forEach(guestItem => {
          if (!mergedItems.find(item => item.id === guestItem.id)) {
            mergedItems.push(guestItem);
          }
        });

        const finalPrice = userCart.mealPrice || guestCart.mealPrice || 0;

        // Save merged and clear guest
        localStorage.setItem(userKey, JSON.stringify({ items: mergedItems, mealPrice: finalPrice }));
        localStorage.removeItem('cart_guest');

        dispatch({ type: 'LOAD_CART', payload: { items: mergedItems, mealPrice: finalPrice } });
      } else {
        // Just standard load for existing user
        dispatch({ type: 'LOAD_CART', payload: userCart });
      }
    } else {
      // GUEST or LOGOUT
      if (prevUserEmail.current) {
        // Just logged out: Clear UI immediately
        dispatch({ type: 'CLEAR_CART' });
      } else {
        // Standard guest load
        dispatch({ type: 'LOAD_CART', payload: guestCart });
      }
    }

    prevUserEmail.current = user?.email;
    setIsLoaded(true);
  }, [user]);

  // Save cart whenever it changes (BUT only after initial load for that user)
  useEffect(() => {
    if (!isLoaded) return;

    const storageKey = user ? `cart_${user.email}` : 'cart_guest';
    localStorage.setItem(storageKey, JSON.stringify({
      items: state.items,
      mealPrice: state.mealPrice
    }));
  }, [state.items, state.mealPrice, user, isLoaded]);

  const addToCart = React.useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeFromCart = React.useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = React.useCallback((id, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  }, []);

  const clearCart = React.useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setMealPrice = React.useCallback((price) => {
    dispatch({ type: 'SET_MEAL_PRICE', payload: price });
  }, []);

  const value = React.useMemo(() => ({
    items: state.items,
    mealPrice: state.mealPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setMealPrice,
    getTotalPrice: () => state.items.length > 0 ? state.mealPrice : 0,
    getTotalItems: () => state.items.reduce((total, item) => total + item.quantity, 0)
  }), [state.items, state.mealPrice, addToCart, removeFromCart, updateQuantity, clearCart, setMealPrice]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

