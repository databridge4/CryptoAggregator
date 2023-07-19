import React, { useState } from "react";
import "./DeleteArchive.css";
import moment from "moment/moment";
import axios from "axios";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const DeleteArchive = () => {
  const [dateStartBook, setDateStartBook] = useState(new Date());
  const [dateEndBook, setDateEndBook] = useState(new Date());
  const [dateStartOrders, setDateStartOrders] = useState(new Date());
  const [dateEndOrders, setDateEndOrders] = useState(new Date());
  const [logs, setLogs] = useState([]);

  const fetchDataBook = async () => {
    const formattedDateStart =
      moment(dateStartBook).utc().format();
    const formattedDateEnd =
      moment(dateEndBook).utc().format();
    const response = await axios.get(
      `https://crypto-aggregator-server.onrender.com/deleteDB?startTime=${formattedDateStart}&endTime=${formattedDateEnd}&type=book`
    );

    if (response.statusText === "OK") {
      setLogs((oldLogs) => [...oldLogs, "OK"]);
    } else {
      setLogs((oldLogs) => [...oldLogs, "ERROR"]);
    }

    console.log(response.statusText);
  };
  const fetchDataOrders = async () => {
    const formattedDateStart =
      moment(dateStartOrders).utc().format();
    const formattedDateEnd =
      moment(dateEndOrders).utc().format();
    const response = await axios.get(
      `https://crypto-aggregator-server.onrender.com/deleteDB?startTime=${formattedDateStart}&endTime=${formattedDateEnd}&type=orders`
    );

    if (response.statusText === "OK") {
      setLogs((oldLogs) => [...oldLogs, "OK"]);
    } else {
      setLogs((oldLogs) => [...oldLogs, "ERROR"]);
    }
    console.log(response.statusText);
  };

  return (
    <div className="App">
      <h1>Archive Orders</h1>

      <div className={"select-container"}>
        <div className={"select-block"}>
          <h3>Clear Book</h3>
        </div>
        <div className={"select-block-archive"}>
          <input
            className={"inputs"}
            type="datetime-local"
            value={moment(dateStartBook).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setDateStartBook(new Date(e.target.value))}
          />
          <input
            className={"inputs"}
            type="datetime-local"
            value={moment(dateEndBook).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setDateEndBook(new Date(e.target.value))}
          />
          <Button size="large" color={"primary"} onClick={fetchDataBook}>
            SEND
          </Button>
        </div>
        <div className={"select-block"}>
          <h3>Clear Orders</h3>
        </div>
        <div className={"select-block-archive"}>
          <input
            className={"inputs"}
            type="datetime-local"
            value={moment(dateStartOrders).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setDateStartOrders(new Date(e.target.value))}
          />
          <input
            className={"inputs"}
            type="datetime-local"
            value={moment(dateEndOrders).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setDateEndOrders(new Date(e.target.value))}
          />
          <Button size="large" color={"primary"} onClick={fetchDataOrders}>
            SEND
          </Button>
        </div>
      </div>
      <div className={"select-container-log"}>
        <div className={"select-block"}>
          <h2>Logger</h2>
        </div>
        {logs.length > 0 ? (
          logs.map((log) => {
            return log === "OK" ? (
              <Alert key={Math.random()} severity="success">
                Removal successful!
              </Alert>
            ) : (
              <Alert key={Math.random()} severity="warning">
                An error occurred while deleting!
              </Alert>
            );
          })
        ) : (
          <h2>No result found</h2>
        )}
      </div>
    </div>
  );
};

export default DeleteArchive;
