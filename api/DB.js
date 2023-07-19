// const { Pool } = require('pg');
const pgp = require("pg-promise")();
require("dotenv").config();

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: {
    rejectUnauthorized: false,
  },
});

let binanceData = [];
let bitfinexData = [];
let bitfinexIds = new Set();
let bookData = {
  binance: {},
  bitfinex: {},
};

const insertData = async (table) => {
  const data = table === "orders_binance" ? binanceData : bitfinexData;
  if (data.length !== 0) {
    const cs = new pgp.helpers.ColumnSet(["amount", "price", "type"], {
      table: `${table}`,
    });
    const query = pgp.helpers.insert(data, cs);
    try {
      await db.none(query);
      console.log(
        `Data inserted into ${table} table - ${data.length} elements.`
      );
      if (table === "orders_binance") {
        binanceData.splice(0, binanceData.length); // clear binanceData by removing all elements
      } else {
        bitfinexData.splice(0, bitfinexData.length); // clear bitfinexData by removing all elements
        bitfinexIds.clear();
      }
    } catch (error) {
      console.error("Error inserting data into binance table:", error);
    }
  }
};

const runInsertData = async (table) => {
  try {
    await insertData(table);
  } catch (error) {
    console.error(`Error running insertData for table ${table}:`, error);
  }
  setTimeout(async () => {
    await runInsertData(table);
  }, 60000);
};

function addTradeData(data) {
  if (!bitfinexIds.has(data.id)) {
    bitfinexData.push(data);
    bitfinexIds.add(data.id);
  }
}

//Book DB
const insertArrayData = async (table) => {
  const data = JSON.stringify(bookData);
  if (data.length !== 0) {
    const cs = new pgp.helpers.ColumnSet(["info"], { table: "book_order" });
    const insertData = {
      info: data,
    };
    const query = pgp.helpers.insert(insertData, cs);
    try {
      await db.none(query);
      console.log(`Array data inserted into book_order table!.`);
      // console.log(JSON.stringify(bookData))
    } catch (error) {
      console.error(
        `Error inserting array data into trade_data_minute table for ${table}:`,
        error
      );
    }
  }
};

const runInsertArrayData = async () => {
  try {
    await insertArrayData();
  } catch (error) {
    console.error(`Error running insertArrayData for table :`, error);
  }
  setTimeout(async () => {
    await runInsertArrayData();
  }, 60000);
};

const getDataFromDb = async (startDate, endDate, tableName) => {
  const query = `
        SELECT *
        FROM ${tableName}
        WHERE timestamp >= '${startDate}' AND timestamp < '${endDate}'
        `;

  try {
    return await db.any(query, [startDate, endDate]);
  } catch (error) {
    console.error("Error getting data from database:", error);
  }
};

const deleteDataFromDb = async (startDate, endDate, tableName) => {
  const query = `
        DELETE
        FROM ${tableName}
        WHERE timestamp >= '${startDate}' AND timestamp < '${endDate}'
        `;

  try {
    return await db.any(query, [startDate, endDate]);
  } catch (error) {
    console.error("Error getting data from database:", error);
  }
};

module.exports = {
  binanceData,
  bitfinexData,
  runInsertData,
  addTradeData,
  bookData,
  runInsertArrayData,
  getDataFromDb,
  deleteDataFromDb,
};
