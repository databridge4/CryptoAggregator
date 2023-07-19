import React, { useEffect } from "react";
import io from "socket.io-client";
import "./Book.css";

const Book = ({
  binanceData,
  setBinanceData,
  bitfinexData,
  setBitfinexData,
}) => {
  const EmptyItem = () => <div className="row-item"></div>;

  useEffect(() => {
    const socket = io("https://crypto-aggregator-server.onrender.com"); // фактичний URL сервера

    socket.on("tradeDataBinance", (data) => {
      // console.log(data)
      setBinanceData(data);
    });

    socket.on("tradeDataBitfinex", (data) => {
      // console.log(data)
      setBitfinexData(data);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="trade-info-container">
      <div className="block-container">
        <h2 className={"h2"}>Binance Data</h2>
        <div className="block binance-block">
          <div className="block-header-bids-asks">
            <div className="header-item">Bids</div>
            <div className="header-item">Asks</div>
          </div>
          <div className="block-header">
            <div className="header-item">Count</div>
            <div className="header-item">Amount</div>
            <div className="header-item">Price</div>
            <div className="header-item">Price</div>
            <div className="header-item">Amount</div>
            <div className="header-item">Count</div>
          </div>
          <div className="block-body">
            {binanceData.bids.map((item, index) => {
              const binanceAsk = binanceData.asks[index];
              const hasBinanceAsk = binanceAsk !== undefined;
              const isCentered = hasBinanceAsk ? false : true;

              return (
                <div
                  key={index}
                  className={`block-row${isCentered ? " centered" : ""}`}
                >
                  <div className="row-item">{item[1]}</div>
                  <div className="row-item">{item[2]}</div>
                  <div className="row-item">{item[0]}</div>
                  {hasBinanceAsk ? (
                    <>
                      <div className="row-item border-left">
                        {binanceAsk[0]}
                      </div>
                      <div className="row-item">{binanceAsk[2]}</div>
                      <div className="row-item">{binanceAsk[1]}</div>
                    </>
                  ) : (
                    <>
                      <EmptyItem />
                      <EmptyItem />
                      <EmptyItem />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="block-container">
        <h2 className={"h2"}>Bitfinex Data</h2>
        <div className="block bitfinex-block">
          <div className="block-header-bids-asks">
            <div className="header-item">Bids</div>
            <div className="header-item">Asks</div>
          </div>
          <div className="block-header">
            <div className="header-item">Count</div>
            <div className="header-item">Amount</div>
            <div className="header-item">Price</div>
            <div className="header-item">Price</div>
            <div className="header-item">Amount</div>
            <div className="header-item">Count</div>
          </div>
          <div className="block-body">
            {bitfinexData.bids.map((item, index) => {
              const bitfinexAsk = bitfinexData.asks[index];
              const hasBitfinexAsk = bitfinexAsk !== undefined;
              const isCentered = !hasBitfinexAsk;

              return (
                <div
                  key={index}
                  className={`block-row${isCentered ? " centered" : ""}`}
                >
                  <div className="row-item">{item[1]}</div>
                  <div className="row-item">{item[2]}</div>
                  <div className="row-item">{item[0]}</div>
                  {hasBitfinexAsk ? (
                    <>
                      <div className="row-item border-left">
                        {bitfinexAsk[0]}
                      </div>
                      <div className="row-item">{Math.abs(bitfinexAsk[2])}</div>
                      <div className="row-item">{bitfinexAsk[1]}</div>
                    </>
                  ) : (
                    <>
                      <EmptyItem />
                      <EmptyItem />
                      <EmptyItem />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Book;
