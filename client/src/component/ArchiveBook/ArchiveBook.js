import React, { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import "./ArchiveBook.css";
import { saveAs } from "file-saver";

const ArchiveBook = ({
  allDataArchiveBook,
  binanceDataArchiveBook,
  bitfinexDataArchiveBook,
  dateTimeArchiveBook,
  minuteArchiveBook,
  setAllDataArchiveBook,
  setDateTimeArchiveBook,
  setBinanceDataArchiveBook,
  setBitfinexDataArchiveBook,
  setMinuteArchiveBook,
}) => {
  const EmptyItem = () => <div className="row-item"></div>;
  const fetchData = async () => {
    const formattedDate =
      moment(dateTimeArchiveBook).utc().format();
    const response = await axios.get(
      `https://crypto-aggregator-server.onrender.com/callDB?dateTime=${formattedDate}&type=book`
    );

    // Зберегти всі дані від сервера
    setAllDataArchiveBook(response.data);
  };

  const downloadCSV = (data, filename = "data") => {
    let csvContent = "";

    // Додати заголовки колонок (ключі об'єктів)
    const headers = Object.keys(data[0]).join(" ");
    csvContent += headers + "\n";

    // Додати значення об'єктів
    data.forEach((row, index) => {
      csvContent += Object.values(row).join(" ");
      if (index < data.length - 1) csvContent += "\n";
    });

    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename + ".csv");
  };

  const handleDownload = () => {
    // Створити новий масив для CSV данних
    const csvData = [];

    // Додати заголовок для Binance
    csvData.push({
      service: "Binance Data:",
      bid_count: "",
      bid_amount: "",
      bid_price: "",
      ask_price: "",
      ask_amount: "",
      ask_count: "",
    });

    // Додати дані Binance
    binanceDataArchiveBook.bids.forEach((item, index) => {
      const ask = binanceDataArchiveBook.asks[index] || [];
      csvData.push({
        service: "",
        bid_count: item ? item[1] : "",
        bid_amount: item ? item[2] : "",
        bid_price: item ? item[0] : "",
        ask_price: ask ? ask[0] : "",
        ask_amount: ask ? ask[2] : "",
        ask_count: ask ? ask[1] : "",
      });
    });

    // Додати заголовок для Bitfinex
    csvData.push({
      service: "Bitfinex Data:",
      bid_count: "",
      bid_amount: "",
      bid_price: "",
      ask_price: "",
      ask_amount: "",
      ask_count: "",
    });

    // Додати дані Bitfinex
    bitfinexDataArchiveBook.bids.forEach((item, index) => {
      const ask = bitfinexDataArchiveBook.asks[index] || [];
      csvData.push({
        service: "",
        bid_count: item ? item[1] : "",
        bid_amount: item ? item[2] : "",
        bid_price: item ? item[0] : "",
        ask_price: ask ? ask[0] : "",
        ask_amount: ask ? Math.abs(ask[2]) : "",
        ask_count: ask ? ask[1] : "",
      });
    });

    // Завантажити дані як CSV
    downloadCSV(csvData, "data");
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
    let targetData = allDataArchiveBook.filter(
      (item) => new Date(item.timestamp).getMinutes() === minuteArchiveBook
    );
    if (targetData && targetData.length > 0) {
      if (
        targetData[0].info.binance &&
        Array.isArray(targetData[0].info.binance.bids) &&
        Array.isArray(targetData[0].info.binance.asks)
      ) {
        setBinanceDataArchiveBook(targetData[0].info.binance);
      }
      if (
        targetData[0].info.bitfinex &&
        Array.isArray(targetData[0].info.bitfinex.bids) &&
        Array.isArray(targetData[0].info.bitfinex.asks)
      ) {
        setBitfinexDataArchiveBook(targetData[0].info.bitfinex);
      }
    }
    // eslint-disable-next-line
  }, [minuteArchiveBook, allDataArchiveBook]);

  return (
    <>
      <div className={"select-container"}>
        <div className={"select-block"}>
          <h3>Filter</h3>
        </div>
        <div className={"select-block-archive"}>
          <Button size="large" color={"primary"} onClick={handleDownload}>
            Download CSV
          </Button>
          <input
            className={"space"}
            type="datetime-local"
            value={moment(dateTimeArchiveBook).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setDateTimeArchiveBook(new Date(e.target.value))}
          />
          <Button size="large" color={"primary"} onClick={fetchData}>
            SEND
          </Button>
        </div>
        <div className={"slider select-block-slider"}>
          <Slider
            value={minuteArchiveBook}
            max={59}
            aria-label="Default"
            valueLabelDisplay="auto"
            marks={marks}
            disabled={!allDataArchiveBook.length}
            onChange={(e) => setMinuteArchiveBook(Number(e.target.value))}
          />
        </div>
      </div>

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
              {binanceDataArchiveBook.bids.map((item, index) => {
                const binanceAsk = binanceDataArchiveBook.asks[index];
                const hasBinanceAsk = binanceAsk !== undefined;
                const isCentered = !hasBinanceAsk;

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
              {bitfinexDataArchiveBook.bids.map((item, index) => {
                const bitfinexAsk = bitfinexDataArchiveBook.asks[index];
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
                        <div className="row-item">
                          {Math.abs(bitfinexAsk[2])}
                        </div>
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
    </>
  );
};
export default ArchiveBook;
