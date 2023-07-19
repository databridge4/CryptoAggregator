import React, { useEffect } from "react";
import TradeCard from "../UI/Card/TradeCard";
import Select from "react-select";
import moment from "moment/moment";
import axios from "axios";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { saveAs } from "file-saver";
import "./ArchiveOrders.css";

const ArchiveOrders = ({
  allDataArchiveOrders,
  archiveTrades,
  filterArchive,
  binanceBuyArchiveOrders,
  binanceSellArchiveOrders,
  bitfinexBuyArchiveOrders,
  bitfinexSellArchiveOrders,
  dateTimeArchiveOrders,
  minuteArchiveOrders,
  setMinuteArchiveOrders,
  setAllDataArchiveOrders,
  setArchiveTrades,
  setBinanceBuyArchiveOrders,
  setBinanceSellArchiveOrders,
  setBitfinexBuyArchiveOrders,
  setBitfinexSellArchiveOrders,
  typeArchiveOrders,
  setDateTimeArchiveOrders,
  setFilterArchive,
  setTypeArchiveOrders,
}) => {
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

  const fetchData = async () => {
    const formattedDate =
      moment(dateTimeArchiveOrders).utc().format();
    const response = await axios.get(
      `https://crypto-aggregator-server.onrender.com/callDB?dateTime=${formattedDate}&type=orders`
    );

    // Зберегти всі дані від сервера
    setAllDataArchiveOrders(response.data);
  };

  const downloadCSV = (data, filename = "data") => {
    let csvContent = "";
    data.forEach((row, index) => {
      csvContent += Object.values(row).join("  ");
      if (index < data.length - 1) csvContent += "\n";
    });

    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename + ".csv");
  };

  const handleDownload = () => {
    const allTrades = [
      ...archiveTrades.binanceBuy,
      ...archiveTrades.binanceSell,
      ...archiveTrades.bitfinexBuy,
      ...archiveTrades.bitfinexSell,
    ];
    downloadCSV(allTrades, "trades");
  };

  const marks = [
    {
      value: 0,
      label: "00",
    },
    {
      value: 10,
      label: "10",
    },
    {
      value: 20,
      label: "20",
    },
    {
      value: 30,
      label: "30",
    },
    {
      value: 40,
      label: "40",
    },
    {
      value: 50,
      label: "50",
    },
    {
      value: 59,
      label: "59",
    },
  ];

  useEffect(() => {
    let targetDataBinance = allDataArchiveOrders.binance.filter(
      (item) => new Date(item.timestamp).getMinutes() === minuteArchiveOrders
    );
    let targetDataBitfinex = allDataArchiveOrders.bitfinex.filter(
      (item) => new Date(item.timestamp).getMinutes() === minuteArchiveOrders
    );
    let datas = {
      binanceBuy: [],
      binanceSell: [],
      bitfinexBuy: [],
      bitfinexSell: [],
    };
    if (targetDataBinance && targetDataBinance.length > 0) {
      targetDataBinance.forEach((element) => {
        if (element.type === "buy") {
          datas.binanceBuy.push(element);
        } else {
          datas.binanceSell.push(element);
        }
      });
    }
    if (targetDataBitfinex && targetDataBitfinex.length > 0) {
      targetDataBitfinex.forEach((element) => {
        if (element.type === "buy") {
          datas.bitfinexBuy.push(element);
        } else {
          datas.bitfinexSell.push(element);
        }
      });
    }
    setArchiveTrades(datas);

    // eslint-disable-next-line
  }, [minuteArchiveOrders, allDataArchiveOrders]); // оновити при зміні minuteArchiveOrders або allDataArchiveOrders

  useEffect(() => {
    // eslint-disable-next-line no-mixed-operators
    if (
      (filterArchive.value === "All" || filterArchive.value === "Binance") &&
      (typeArchiveOrders.value === "All" || typeArchiveOrders.value === "BUY")
    ) {
      setBinanceBuyArchiveOrders(true);
    } else setBinanceBuyArchiveOrders(false);

    // eslint-disable-next-line no-mixed-operators
    if (
      (filterArchive.value === "All" || filterArchive.value === "Binance") &&
      (typeArchiveOrders.value === "All" || typeArchiveOrders.value === "SELL")
    ) {
      setBinanceSellArchiveOrders(true);
    } else setBinanceSellArchiveOrders(false);

    // eslint-disable-next-line no-mixed-operators
    if (
      (filterArchive.value === "All" || filterArchive.value === "Bitfinex") &&
      (typeArchiveOrders.value === "All" || typeArchiveOrders.value === "BUY")
    ) {
      setBitfinexBuyArchiveOrders(true);
    } else setBitfinexBuyArchiveOrders(false);

    // eslint-disable-next-line no-mixed-operators
    if (
      (filterArchive.value === "All" || filterArchive.value === "Bitfinex") &&
      (typeArchiveOrders.value === "All" || typeArchiveOrders.value === "SELL")
    ) {
      setBitfinexSellArchiveOrders(true);
    } else setBitfinexSellArchiveOrders(false);
    // eslint-disable-next-line
  }, [filterArchive, typeArchiveOrders]);

  return (
    <div className="App">
      <h1>Archive Orders</h1>

      <div className={"select-container"}>
        <div className={"select-block"}>
          <h3>Filter</h3>
        </div>
        <div className={"select-block-archive"}>
          <Button
            className={"space"}
            size="large"
            color={"primary"}
            onClick={handleDownload}
          >
            Download CSV
          </Button>
          <input
            className={"space"}
            type="datetime-local"
            value={moment(dateTimeArchiveOrders).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setDateTimeArchiveOrders(new Date(e.target.value))}
          />
          <Button
            className={"space"}
            size="large"
            color={"primary"}
            onClick={fetchData}
          >
            SEND
          </Button>
        </div>
        <div className={"slider select-block-slider"}>
          <Slider
            value={minuteArchiveOrders}
            max={59}
            aria-label="Default"
            valueLabelDisplay="auto"
            marks={marks}
            disabled={!allDataArchiveOrders.binance.length}
            onChange={(e) => setMinuteArchiveOrders(Number(e.target.value))}
          />
        </div>

        <div className={"select-block"}>
          <div className={"row"}>
            <p>Exchange:</p>
            <Select
              className={"select-item"}
              defaultValue={filterArchive}
              onChange={setFilterArchive}
              options={options}
              placeholder={"All"}
            />
          </div>

          <div className={"row"}>
            <p>Type:</p>
            <Select
              className={"select-item"}
              defaultValue={typeArchiveOrders}
              onChange={setTypeArchiveOrders}
              options={options2}
              placeholder={"All"}
            />
          </div>
        </div>
      </div>
      <div className="TradeColumns">
        <div className="TradeColumn">
          {(binanceBuyArchiveOrders && archiveTrades.binanceBuy.length > 0) ||
          (binanceSellArchiveOrders && archiveTrades.binanceSell.length > 0) ||
          (bitfinexBuyArchiveOrders && archiveTrades.bitfinexBuy.length > 0) ||
          (bitfinexSellArchiveOrders &&
            archiveTrades.bitfinexSell.length > 0) ? (
            <>
              {binanceBuyArchiveOrders &&
                archiveTrades.binanceBuy.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Archive"} />
                ))}
              {binanceSellArchiveOrders &&
                archiveTrades.binanceSell.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Archive"} />
                ))}
              {bitfinexBuyArchiveOrders &&
                archiveTrades.bitfinexBuy.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Archive"} />
                ))}
              {bitfinexSellArchiveOrders &&
                archiveTrades.bitfinexSell.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} type={"Archive"} />
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

export default ArchiveOrders;
