const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const port = process.env.PORT || 3000;

let {
  binanceData,
  runInsertData,
  addTradeData,
  bookData,
  runInsertArrayData,
} = require("./DB.js");
const callDB = require("./callDB");
const deleteDB = require("./deleteDB");
const app = express();
app.use(cors());

app.use(function(req, res, next) { // kolpa magkiorika poy de ta kserw
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/callDB", callDB);
app.use("/deleteDB", deleteDB);



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  },
});

const bitfinexWss = "wss://api-pub.bitfinex.com/ws/2";
const binanceWss = "wss://stream.binance.com:9443/ws/btcusdt@depth";
const bitfinexWssOrders = "wss://api-pub.bitfinex.com/ws/2";
const binanceWssOrders = "wss://stream.binance.com:9443/ws/btcusdt@trade";


function connectBitfinex() {
  let bitfinexWsB = new WebSocket(bitfinexWss);

  let msg = JSON.stringify({
    event: "subscribe",
    channel: "book",
    symbol: "tBTCUSD",
  });

  bitfinexWsB.onopen = () => {
    bitfinexWsB.send(msg);
    console.log("Connected to Bitfinex");
  };

  bitfinexWsB.onmessage = (event) => {
    let response = JSON.parse(event.data);
  };

  bitfinexWsB.onclose = (e) => {
    console.log(
      "Socket is closed. Reconnect will be attempted in 10 second.",
      
      e.reason
    );
    process.exit();
    
    console.log("Trying to reconnect to Bitfinex...");
      bitfinexWsB.close();
      process
    setTimeout(function () {
      connectBitfinex();
    }, 10000);
  };

  bitfinexWsB.onerror = (err) => {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    process.exit();
    bitfinexWsB.close();
  };

  return bitfinexWsB;
}

const bitfinexWs = connectBitfinex();

const binanceWs = new WebSocket(binanceWss);
const bitfinexWsOrders = new WebSocket(bitfinexWssOrders);
const binanceWsOrders = new WebSocket(binanceWssOrders);

let tradeDataOrders = {
  bitfinex: {},
  binance: {},
};

let sendDataBitfinex = false;
let sendDataBinance = false;
let sendDataBitfinexOrders = false;
let sendDataBinanceOrders = false;
let pushBookDataBitfinex = false;
let pushBookDataBinance = false;

bitfinexWs.on("open", () => {
  setInterval(() => {
    sendDataBitfinex = true;
    sendDataBinance = true;
    sendDataBitfinexOrders = true;
    sendDataBinanceOrders = true;
  }, 1000); // Отправлять данные каждую секунду
  // ...
  setInterval(() => {
    pushBookDataBitfinex = true;
    pushBookDataBinance = true;
  }, 30000);
});

let bids = [];
let asks = [];

bitfinexWs.on("message", (msg) => {
  const response = JSON.parse(msg);
  if (Array.isArray(response[1])) {
    // we're only interested in the order book updates here
    const [price, count, amount] = response[1];

    if (amount >= 1) {
      if (count > 0) {
        bids[price] = response[1];
      } else {
        delete bids[price];
      }
    } else if (amount <= -1) {
      if (count > 0) {
        asks[price] = response[1];
      } else {
        delete asks[price];
      }
    }

    // Convert the bids and asks objects to sorted arrays
    const sortedBids = Object.values(bids)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 24);
    const sortedAsks = Object.values(asks)
      .sort((a, b) => a[0] - b[0])
      .slice(0, 24);

    if (sendDataBitfinex) {
      io.emit("tradeDataBitfinex", { bids: sortedBids, asks: sortedAsks });
      sendDataBitfinex = false;
      if (pushBookDataBitfinex) {
        bookData.bitfinex = { bids: sortedBids, asks: sortedAsks };
        pushBookDataBitfinex = false;
      }
    }
  }
});

// BitfinexOrders подключение
bitfinexWsOrders.on("open", () => {
  bitfinexWsOrders.send(
    JSON.stringify({
      event: "subscribe",
      channel: "trades",
      symbol: "tBTCUSD",
    })
  );
});

bitfinexWsOrders.on("message", (msg) => {
  const response = JSON.parse(msg);

  if (Array.isArray(response) && response[1] !== "hb") {
    if (response.length === 2 && typeof response[1] === "string") {
      const tradeInfo = response[2];
      const tradeType = tradeInfo[2] > 0 ? "buy" : "sell";
      tradeDataOrders.bitfinex = {
        id: tradeInfo[0],
        timestamp: new Date(tradeInfo[1]).toLocaleString(),
        amount: Math.abs(tradeInfo[2]),
        price: tradeInfo[3],
        type: tradeType,
      };
    } else if (response.length === 2 && Array.isArray(response[1])) {
      response[1].forEach((trade) => {
        const tradeType = trade[2] > 0 ? "buy" : "sell";
        tradeDataOrders.bitfinex = {
          id: trade[0],
          timestamp: new Date(trade[1]).toLocaleString(),
          amount: Math.abs(trade[2]),
          price: trade[3],
          type: tradeType,
        };
      });
    } else if (response.length === 3) {
      const tradeInfo = response[2];
      const tradeType = tradeInfo[2] > 0 ? "buy" : "sell";
      tradeDataOrders.bitfinex = {
        id: tradeInfo[0],
        timestamp: new Date(tradeInfo[1]).toLocaleString(),
        amount: Math.abs(tradeInfo[2]),
        price: tradeInfo[3],
        type: tradeType,
      };
    }
  }

  if (tradeDataOrders.bitfinex.amount >= 1 && sendDataBitfinexOrders) {
    io.emit("tradeDataOrders", tradeDataOrders);
    addTradeData(tradeDataOrders.bitfinex);
    // console.log(tradeDataOrders)
    sendDataBitfinexOrders = false;
  }
});

// Binance подключение

let bidsBinance = new Map();
let asksBinance = new Map();

binanceWs.on("message", (msg) => {
  const response = JSON.parse(msg);
  const { b: bidUpdates, a: askUpdates } = response;

  bidUpdates.forEach(([price, quantity]) => {
    price = parseInt(price, 10);
    quantity = parseFloat(quantity);

    if (quantity === 0) {
      bidsBinance.delete(price);
    } else {
      const currentBid = bidsBinance.get(price) || [0, 0];
      bidsBinance.set(price, [currentBid[0] + 1, quantity]); // replace total quantity with latest quantity
    }
  });

  askUpdates.forEach(([price, quantity]) => {
    price = parseInt(price, 10);
    quantity = parseFloat(quantity);

    if (quantity === 0) {
      asksBinance.delete(price);
    } else {
      const currentAsk = asksBinance.get(price) || [0, 0];
      asksBinance.set(price, [currentAsk[0] + 1, quantity]); // replace total quantity with latest quantity
    }
  });

  const sortedBids = Array.from(bidsBinance.entries())
    .filter(([price, [count, totalQuantity]]) => totalQuantity >= 1)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 24)
    .map(([price, [count, totalQuantity]]) => [price, count, totalQuantity]);

  const sortedAsks = Array.from(asksBinance.entries())
    .filter(([price, [count, totalQuantity]]) => totalQuantity >= 1)
    .sort((a, b) => a[0] - b[0])
    .slice(0, 24)
    .map(([price, [count, totalQuantity]]) => [price, count, totalQuantity]);

  if (sendDataBinance) {
    io.emit("tradeDataBinance", { bids: sortedBids, asks: sortedAsks });
    sendDataBinance = false;
    if (pushBookDataBinance) {
      bookData.binance = { bids: sortedBids, asks: sortedAsks };
      pushBookDataBinance = false;
    }
  }
});

// BinanceOrders подключение
binanceWsOrders.on("message", (msg) => {
  const response = JSON.parse(msg);
  // handle response here
  const tradeType = response.m ? "buy" : "sell"; // Визначення типу транзакції (покупка чи продаж)
  tradeDataOrders.binance = {
    id: response.t,
    timestamp: new Date(response.T).toLocaleString(),
    amount: parseFloat(response.q),
    price: parseInt(response.p),
    type: tradeType,
  };
  if (tradeDataOrders.binance.amount >= 1 && sendDataBinanceOrders) {
    binanceData.push(tradeDataOrders.binance);
    io.emit("tradeDataOrders", tradeDataOrders);
    sendDataBitfinexOrders = false;
  }
});

runInsertData("orders_binance");
runInsertData("orders_bitfinex");
runInsertArrayData();

server.listen(port, () => {
  console.log("Server listening on port 3000");
});
