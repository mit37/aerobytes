import React, { useState, useRef, useEffect } from 'react';
import './HealthBot.css';

// n8n webhook endpoint - you'll need to replace this with your actual n8n webhook URL
const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/28884611-bc36-4aff-a395-3fa78040765c';

function HealthBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm Nathan, your AI fitness and nutrition consultant. I'll help you create a personalized nutrition plan based on your goals and preferences. Let's get started!",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          sessionId: localStorage.getItem('chatSessionId') || `session-${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      // Handle different response formats
      const botResponse = data.output || data.message || data.text || data.response || 
                         (data.choices && data.choices[0]?.message?.content) ||
                         'I apologize, but I encountered an error. Please try again.';

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please make sure the n8n webhook URL is configured correctly.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          className="healthbot-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open Health Bot"
        >
          💪
          <span className="healthbot-toggle-text">Health Bot</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="healthbot-container">
          <div className="healthbot-header">
            <div className="healthbot-header-info">
              <span className="healthbot-icon">💪</span>
              <div>
                <h3>Nathan - AI Fitness Consultant</h3>
                <p>Your personalized nutrition advisor</p>
              </div>
            </div>
            <button 
              className="healthbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="healthbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`healthbot-message ${message.sender === 'user' ? 'user' : 'bot'}`}
              >
                <div className="healthbot-message-content">
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="healthbot-message bot">
                <div className="healthbot-message-content">
                  <span className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="healthbot-input-form" onSubmit={handleSend}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about nutrition, fitness goals, or meal plans..."
              className="healthbot-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="healthbot-send"
              disabled={isLoading || !inputValue.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default HealthBot;

