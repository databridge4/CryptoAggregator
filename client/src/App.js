import "./App.css";
import { Route, Routes } from "react-router-dom";
import Book from "./component/Book/Book";
import CompleteOrders from "./component/CompleteOrders/CompleteOrders";
import Navbar from "./UI/Navbar/Navbar";
import { useState } from "react";
import ArchiveBook from "./component/ArchiveBook/ArchiveBook";
import ArchiveOrders from "./component/ArchiveOrders/ArchiveOrders";
import DeleteArchive from "./component/DeleteArchive/DeleteArchive";

function App() {
  const [trades, setTrades] = useState({
    binanceBuy: [],
    binanceSell: [],
    bitfinexBuy: [],
    bitfinexSell: [],
    binanceBuyIds: new Set(),
    binanceSellIds: new Set(),
    bitfinexBuyIds: new Set(),
    bitfinexSellIds: new Set(),
  });

  const [binanceData, setBinanceData] = useState({ bids: [], asks: [] });
  const [bitfinexData, setBitfinexData] = useState({ bids: [], asks: [] });
  const [allDataArchiveBook, setAllDataArchiveBook] = useState([]);
  const [dateTimeArchiveBook, setDateTimeArchiveBook] = useState(new Date());
  const [minuteArchiveBook, setMinuteArchiveBook] = useState(0);
  const [binanceDataArchiveBook, setBinanceDataArchiveBook] = useState({
    bids: [],
    asks: [],
  });
  const [bitfinexDataArchiveBook, setBitfinexDataArchiveBook] = useState({
    bids: [],
    asks: [],
  });
  const [allDataArchiveOrders, setAllDataArchiveOrders] = useState({
    binance: [],
    bitfinex: [],
  });
  const [dateTimeArchiveOrders, setDateTimeArchiveOrders] = useState(
    new Date()
  );
  const [minuteArchiveOrders, setMinuteArchiveOrders] = useState(0);
  const [archiveTrades, setArchiveTrades] = useState({
    binanceBuy: [],
    binanceSell: [],
    bitfinexBuy: [],
    bitfinexSell: [],
  });
  const [filterArchive, setFilterArchive] = useState({
    value: "All",
    label: "All",
  });
  const [typeArchiveOrders, setTypeArchiveOrders] = useState({
    value: "All",
    label: "All",
  });
  const [binanceBuyArchiveOrders, setBinanceBuyArchiveOrders] = useState(false);
  const [binanceSellArchiveOrders, setBinanceSellArchiveOrders] =
    useState(false);
  const [bitfinexBuyArchiveOrders, setBitfinexBuyArchiveOrders] =
    useState(false);
  const [bitfinexSellArchiveOrders, setBitfinexSellArchiveOrders] =
    useState(false);

  return (
    <>
      <Routes>
        <Route path={"/"} element={<Navbar />}>
          <Route
            index
            element={
              <Book
                binanceData={binanceData}
                setBinanceData={setBinanceData}
                bitfinexData={bitfinexData}
                setBitfinexData={setBitfinexData}
              />
            }
          />
          <Route
            path={"/orders"}
            element={<CompleteOrders trades={trades} setTrades={setTrades} />}
          />
          <Route
            path={"/ArchiveBook"}
            element={
              <ArchiveBook
                allDataArchiveBook={allDataArchiveBook}
                setAllDataArchiveBook={setAllDataArchiveBook}
                dateTimeArchiveBook={dateTimeArchiveBook}
                setDateTimeArchiveBook={setDateTimeArchiveBook}
                minuteArchiveBook={minuteArchiveBook}
                setMinuteArchiveBook={setMinuteArchiveBook}
                binanceDataArchiveBook={binanceDataArchiveBook}
                setBinanceDataArchiveBook={setBinanceDataArchiveBook}
                bitfinexDataArchiveBook={bitfinexDataArchiveBook}
                setBitfinexDataArchiveBook={setBitfinexDataArchiveBook}
              />
            }
          />
          <Route
            path={"/ArchiveOrders"}
            element={
              <ArchiveOrders
                allDataArchiveOrders={allDataArchiveOrders}
                setAllDataArchiveOrders={setAllDataArchiveOrders}
                dateTimeArchiveOrders={dateTimeArchiveOrders}
                setDateTimeArchiveOrders={setDateTimeArchiveOrders}
                minuteArchiveOrders={minuteArchiveOrders}
                setMinuteArchiveOrders={setMinuteArchiveOrders}
                archiveTrades={archiveTrades}
                setArchiveTrades={setArchiveTrades}
                filterArchive={filterArchive}
                setFilterArchive={setFilterArchive}
                typeArchiveOrders={typeArchiveOrders}
                setTypeArchiveOrders={setTypeArchiveOrders}
                binanceBuyArchiveOrders={binanceBuyArchiveOrders}
                setBinanceBuyArchiveOrders={setBinanceBuyArchiveOrders}
                binanceSellArchiveOrders={binanceSellArchiveOrders}
                setBinanceSellArchiveOrders={setBinanceSellArchiveOrders}
                bitfinexBuyArchiveOrders={bitfinexBuyArchiveOrders}
                setBitfinexBuyArchiveOrders={setBitfinexBuyArchiveOrders}
                bitfinexSellArchiveOrders={bitfinexSellArchiveOrders}
                setBitfinexSellArchiveOrders={setBitfinexSellArchiveOrders}
              />
            }
          />
          <Route path={"/DeleteArchive"} element={<DeleteArchive />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
