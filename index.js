const got = require('got');
const { Table } = require('console-table-printer');
const fs = require('fs');
const yaml = require('js-yaml');

let fileContents = fs.readFileSync('./coins.yml', 'utf8');
const COINS = yaml.loadAll(fileContents)[0];
console.log(COINS);

const REPOLL_INTERVAL = 120000; // Coinmarketcap reports new prices approximately every 2 minutes

const TABLE_CONFIG = {
  columns: [
    { name: 'ticker', title: 'Ticker', alignment: 'left' },
    { name: 'price', title: 'Price' },
    { name: 'holding', title: 'Holding' },
    { name: 'holdingValue', title: 'Holding Value' },
  ]
};

function buildGraphQl(coin) {
  return `{
    site(url: "https://coinmarketcap.com/currencies/${coin}") {
      ticker: select(elem: ".nameSymbol___1arQV") {
        text
      }
      price: select(elem: ".priceValue___11gHJ") {
        text
      }
    }
  }`;
}

async function getCoinData(coin) {
  const { body } = await got.post('https://coolqlcool.onrender.com/graphql', {
    json: {
      query: buildGraphQl(coin)
    },
    responseType: 'json',
  });

  return body;
}

async function getFormattedCoinData({ slug, holding }) {
  const data = await getCoinData(slug);
  const ticker = data.data.site.ticker.text;
  const price = data.data.site.price.text;
  const holdingValue = '$' + (parseFloat(price.replace('$', '')) * holding).toFixed(2);
  console.log(ticker, price);
  return {
    ticker,
    price,
    holding,
    holdingValue,
  };
}

async function reportAllPrices() {
  const prices = await Promise.all(COINS.map((coin) => getFormattedCoinData(coin)));
  const table = new Table(TABLE_CONFIG);
  table.addRows(prices);
  table.printTable();
}

setInterval(reportAllPrices, REPOLL_INTERVAL);

reportAllPrices();
