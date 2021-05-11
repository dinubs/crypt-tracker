# Crypt Tracker

A small script to intermittently poll coinmarketcap for current price for a handful of cryptocurrencies.

### To Use

1. Clone the repo
2. Run `npm install`
3. Create `coins.yml` file
4. Put the coins and amount you're holding in the `coins.yml` file following the pattern below
5. Run `node index.js` and it will report the current price of each coin in the coins.yml file, and your total holding value

### Example coins.yml file

The slug is the final part in the url path from coinmarketcap. For example, the slug you would use for the bitcoin coinmarketcap page `https://coinmarketcap.com/currencies/bitcoin/` would be `bitcoin`.

```yml
-
  slug: bitcoin
  holding: 1
-
  slug: dogecoin
  holding: 10000
-
  slug: cardano
  holding: 300
```
