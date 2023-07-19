const express = require("express");
const router = express.Router();
const { getDataFromDb } = require("./DB.js");

router.get("/", async (req, res) => {
  const { dateTime, type } = req.query;

  console.log(`getting req with params: ${dateTime} and ${type}`);

  const startDate = new Date(dateTime);
  const endDate = new Date(dateTime);
  endDate.setHours(startDate.getHours() + 1);

  const dateStartTimeString = startDate.toISOString();
  const dateEndTimeString = endDate.toISOString();

  if (type === "book") {
    const data = await getDataFromDb(
      dateStartTimeString,
      dateEndTimeString,
      "book_order"
    );
    await res.send(data);
  } else if (type === "orders") {
    let data = {};
    data.binance = await getDataFromDb(
      dateStartTimeString,
      dateEndTimeString,
      "orders_binance"
    );
    data.bitfinex = await getDataFromDb(
      dateStartTimeString,
      dateEndTimeString,
      "orders_bitfinex"
    );
    await res.send(data);
  }
});

module.exports = router;
