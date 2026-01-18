# UCSC Dining Locations

Complete list of all UCSC dining locations that the scraper supports:

## Dining Halls

1. **John R. Lewis & College Nine Dining Hall** (ID: 40)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=John+R.+Lewis+%26+College+Nine+Dining+Hall&naFlag=1`

2. **Cowell & Stevenson Dining Hall** (ID: 05)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=05&locationName=Cowell+%26+Stevenson+Dining+Hall&naFlag=1`

3. **Crown & Merrill Dining Hall** (ID: 20)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=20&locationName=Crown+%26+Merrill+Dining+Hall&naFlag=1`

4. **Porter & Kresge Dining Hall** (ID: 25)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=25&locationName=Porter+%26+Kresge+Dining+Hall&naFlag=1`

5. **Rachel Carson & Oakes Dining Hall** (ID: 30)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=30&locationName=Rachel+Carson+%26+Oakes+Dining+Hall&naFlag=1`

## Cafes

6. **Banana Joe's** (ID: 21)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=21&locationName=Banana+Joe%27s&naFlag=1`

7. **Oakes Cafe** (ID: 23)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=23&locationName=Oakes+Cafe&naFlag=1`

8. **Global Village Cafe** (ID: 46)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=46&locationName=Global+Village+Cafe&naFlag=1`

9. **Owl's Nest Cafe** (ID: 24)
   - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=24&locationName=Owl%27s+Nest+Cafe&naFlag=1`

10. **UCen Coffee Bar** (ID: 45)
    - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=45&locationName=UCen+Coffee+Bar&naFlag=1`

11. **Stevenson Coffee House** (ID: 26)
    - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=26&locationName=Stevenson+Coffee+House&naFlag=1`

12. **Perk Coffee Bar** (ID: 22)
    - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=22&locationName=Perk+Coffee+Bar&naFlag=1`

## Markets

13. **Porter Market** (ID: 50)
    - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=50&locationName=Porter+Market&naFlag=1`

14. **Merrill Market** (ID: 47)
    - URL: `shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=47&locationName=Merrill+Market&naFlag=1`

## Total: 14 Locations

All locations are configured in `backend/locations.js` as a fallback list. The scraper will:
1. Try to scrape locations from the main UCSC page
2. If that fails, use the fallback list
3. Merge any found locations with the fallback to ensure all locations are available

