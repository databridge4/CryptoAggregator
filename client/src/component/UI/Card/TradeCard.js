import React from "react";
import "./TradeCard.css";
import moment from "moment-timezone";

function TradeCard({ trade, type }) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let time;
  
  if (type === "Archive") {
    time = moment(trade.timestamp).tz(timezone).format("DD-MM-YYYY HH:mm");
  } else {
    time = moment.utc(trade.timestamp).tz(timezone).format("DD-MM-YYYY HH:mm");

  }

  return (
    <div className="TradeCard">
      <p>
        {trade.type.toUpperCase()} - {trade.id}
      </p>
      <p>Time: {time}</p>
      <p>Amount: {trade.amount}</p>
      <p>Price: {trade.price}</p>
    </div>
  );
}

export default TradeCard;
