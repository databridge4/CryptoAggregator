import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TradeCard from "../UI/Card/TradeCard";
import Select from "react-select";
import "./CompleteOrders.css";

const CompleteOrders = ({ trades, setTrades }) => {
  const [filter, setFilter] = useState({ value: "All", label: "All" });
  const [type, setType] = useState({ value: "All", label: "All" });
  const [binanceBuy, setBinanceBuy] = useState(false);
  const [binanceSell, setBinanceSell] = useState(false);
  const [bitfinexBuy, setBitfinexBuy] = useState(false);
  const [bitfinexSell, setBitfinexSell] = useState(false);

  const options = [
    { value: "All", label: "All" },
    { value: "Binance", label: "Binance" },
    { value: "Bitfinex", label: "Bitfinex" },
  ];
  const options2 = [
    { value: "All", label: "All" },
    { value: "BUY", label: "BUY" },
    { value: "SELL", label: "SELL" },
  ];

  useEffect(() => {
    const socket = io("https://crypto-aggregator-server.onrender.com");
    socket.on("tradeDataOrders", (data) => {
      setTrades((prevState) => {
        let newTrades = { ...prevState };

        if (
          data.binance &&
          data.binance.type === "buy" &&
          !newTrades.binanceBuyIds.has(data.binance.id) &&
          data.binance.amount >= 1
        ) {
          newTrades.binanceBuy.unshift(data.binance); // Додайте елемент угорі
          newTrades.binanceBuyIds.add(data.binance.id);
          if (newTrades.binanceBuy.length > 200) {
            newTrades.binanceBuy.splice(100, newTrades.binanceBuy.length - 100);
          }
        }

        if (
          data.binance &&
          data.binance.type === "sell" &&
          !newTrades.binanceSellIds.has(data.binance.id) &&
          data.binance.amount >= 1
        ) {
          newTrades.binanceSell.unshift(data.binance); // Додайте елемент угорі
          newTrades.binanceSellIds.add(data.binance.id);
          if (newTrades.binanceSell.length > 200) {
            newTrades.binanceSell.splice(
              100,
              newTrades.binanceSell.length - 100
            );
          }
        }

        if (
          data.bitfinex &&
          data.bitfinex.type === "buy" &&
          !newTrades.bitfinexBuyIds.has(data.bitfinex.id) &&
          data.bitfinex.amount >= 1
        ) {
          console.log(data.bitfinex.amount);
          newTrades.bitfinexBuy.unshift(data.bitfinex); // Додайте елемент угорі
          newTrades.bitfinexBuyIds.add(data.bitfinex.id);
          if (newTrades.bitfinexBuy.length > 200) {
            newTrades.bitfinexBuy.splice(
              100,
              newTrades.bitfinexBuy.length - 100
            );
          }
        }

        if (
          data.bitfinex &&
          data.bitfinex.type === "sell" &&
          !newTrades.bitfinexSellIds.has(data.bitfinex.id) &&
          data.bitfinex.amount >= 1
        ) {
          newTrades.bitfinexSell.unshift(data.bitfinex); // Додайте елемент угорі
          newTrades.bitfinexSellIds.add(data.bitfinex.id);
          if (newTrades.bitfinexSell.length > 200) {
            newTrades.bitfinexSell.splice(
              100,
              newTrades.bitfinexSell.length - 100
            );
          }
        }
        // console.log(typeof data.bitfinex.amount)

        return newTrades;
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-mixed-operators
    if (
      (filter.value === "All" || filter.value === "Binance") &&
      (type.value === "All" || type.value === "BUY")
    ) {
      setBinanceBuy(true);
    } else setBinanceBuy(false);

    // eslint-disable-next-line no-mixed-operators
    if (
      (filter.value === "All" || filter.value === "Binance") &&
      (type.value === "All" || type.value === "SELL")
    ) {
      setBinanceSell(true);
    } else setBinanceSell(false);

    // eslint-disable-next-line no-mixed-operators
    if (
      (filter.value === "All" || filter.value === "Bitfinex") &&
      (type.value === "All" || type.value === "BUY")
    ) {
      setBitfinexBuy(true);
    } else setBitfinexBuy(false);

    // eslint-disable-next-line no-mixed-operators
    if (
      (filter.value === "All" || filter.value === "Bitfinex") &&
      (type.value === "All" || type.value === "SELL")
    ) {
      setBitfinexSell(true);
    } else setBitfinexSell(false);
  }, [filter, type]);

  return (
    <div className="App">
      <h1>Trading Data</h1>
      <div className={"select-container"}>
        <h3>Filter</h3>
        <div className={"select-block"}>
          <div className={"row"}>
            <p>Exchange:</p>
            <Select
              className={"select-item"}
              defaultValue={filter}
              onChange={setFilter}
              options={options}
              placeholder={"All"}
            />
          </div>

          <div className={"row"}>
            <p>Type:</p>
            <Select
              className={"select-item"}
              defaultValue={type}
              onChange={setType}
              options={options2}
              placeholder={"All"}
            />
          </div>
        </div>
      </div>
      <div className="TradeColumns">
        <div className="TradeColumn">
          {(binanceBuy && trades.binanceBuy.length > 0) ||
          (binanceSell && trades.binanceSell.length > 0) ||
          (bitfinexBuy && trades.bitfinexBuy.length > 0) ||
          (bitfinexSell && trades.bitfinexSell.length > 0) ? (
            <>
              {binanceBuy &&
                trades.binanceBuy.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Orders"} />
                ))}
              {binanceSell &&
                trades.binanceSell.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Orders"} />
                ))}
              {bitfinexBuy &&
                trades.bitfinexBuy.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Orders"} />
                ))}
              {bitfinexSell &&
                trades.bitfinexSell.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Orders"} />
                ))}
            </>
          ) : (
            <h2>No result found</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteOrders;
