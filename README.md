<h1>CryptoAggregator</h1>

<h2>Introduction</h2>

<p>CryptoAggregator is a cutting-edge web application designed for real-time crypto market analysis. It utilizes ReactJS for client-side and NodeJS - ExpressJS for server-side operations. PostgreSQL is used as the database, with the addition of WebSockets for real-time data fetching.</p>

<h2>Description</h2>

<p>The CryptoAggregator project is divided into two primary components, each represented by a folder:</p>

<ul>
  <li><strong>client</strong>: The client-side of the web application, written in ReactJS. It is responsible for the user interface and interaction with the server.</li>
  <li><strong>api</strong>: The server-side of the web application, written in NodeJS - ExpressJS. It handles requests from the client, interacts with the crypto exchanges, and manages data from the PostgreSQL database.</li>
</ul>

<h2>Functionality</h2>

<p>CryptoAggregator provides the following functionalities:</p>

<ul>
  <li><strong>Real-time Crypto Exchange Offers</strong>: CryptoAggregator fetches current offers on crypto exchanges such as Binance and Bitfinex using WebSockets. This allows for real-time analysis of buy and sell offers for various cryptocurrencies on two different crypto exchanges.</li>
  <li><strong>View List of Orders</strong>: The project allows users to view a list of executed orders from these two crypto exchanges. This provides the ability to filter and analyze information on crypto sales and purchases.</li>
  <li><strong>Data Persistence</strong>: The project stores all current and executed offer data in a PostgreSQL database every minute, allowing for market analysis in the past by minute.</li>
</ul>

<p>CryptoAggregator is an essential tool for anyone looking to deeply analyze and understand the trends of the crypto market.</p>
