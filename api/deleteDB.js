const express = require("express");
const router = express.Router();
const { deleteDataFromDb } = require("./DB.js");

router.get("/", async (req, res) => {
  const { startTime, endTime, type } = req.query;

  console.log(
    `getting req with params: start ${startTime} - end ${endTime} and ${type}`
  );

  if (type === "book") {
    const data = await deleteDataFromDb(startTime, endTime, "book_order");
    await res.send(data);
    console.log("done");
  } else if (type === "orders") {
    let data = {};
    data.binance = await deleteDataFromDb(startTime, endTime, "orders_binance");
    data.bitfinex = await deleteDataFromDb(
      startTime,
      endTime,
      "orders_bitfinex"
    );
    await res.send(data);
    console.log("done");
  }
});

module.exports = router;
