#!/usr/bin/env node
var WebSocket = require("ws");
const fetch = require("node-fetch");
const { parse } = require('./tradinglite.js');

// CHANGE THIS TO YOUR OWN CREDENTIALS
const token = 'acc_0TFmHg1UdssK0ZJJ4AbsKbUV1Ej'
const tab_id = 'tab_PHUfBeaPeR'
const wsId = 'eWGDsHnx' // Workspace Id (can be found in the url of your workspace)
const version = "v0.41.13"


async function onConnect(connection) {
  console.log("WebSocket Client Connected");
    
  // EXAMPLE SUBSCRIPTION
  ws.send(JSON.stringify({"action":"subscribe","exchange":"coinbase","symbols":["ETH-USD"],"channels":["volume,15"]}));
  ws.send(JSON.stringify({"action":"subscribe","exchange":"coinbase","symbols":["ETH-USD"],"channels":["trades"]}));
  ws.send(JSON.stringify({"action":"subscribe","exchange":"coinbase","symbols":["ETH-USD"],"channels":["orderbook"]}));
  ws.send(JSON.stringify({"action":"subscribe","exchange":"coinbase","symbols":["ETH-USD"],"channels":["heatmap@1"]}));
  ws.send(JSON.stringify({"action":"subscribe","exchange":"coinbase","symbols":["ETH-USD"],"channels":["candles@default,15"]}));
  ws.send(JSON.stringify({"action":"subscribe","exchange":"coinbase","symbols":["ETH-USD"],"channels":["stats,15"]}));

  // CUSTOM ACTION REQUESTS
  ws.send(JSON.stringify({"action":"range","kind":"heatmap@1","exchange":"coinbase","symbol":"ETH-USD","timeframe":15,"from":1655222400,"to":1655451900,"meta_id":8}));


}

// Your logic here
async function parsemsg(message, isBinary) {
  if (!isBinary) return console.log("Received: '" + message + "'");
  
    // binary data to  object
    const {id, meta_id, data, opts} = parse(message)
    
  
    console.log(`\nType: ${opts.type}, Exchange: ${opts.exchange}, Symbol: ${opts.symbol}, Timeframe: ${opts.timeframe}`)
    switch (opts.type) {
      case 'heatmap':
        console.log(id)
        break;
      case 'candles':
        console.log(id)
        break;
      case 'stats':
        console.log(id)
        break;
      case 'trades':
        console.log(id)
        break;
      case 'orderbook':
        console.log(id)
        break;
      case 'volume':
        console.log(id)
        break;
      default:
        // console.log(id)
        break;
    }
}

async function connect() {
  const data = await fetch("https://www.tradinglite.com/api/connect", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,es-ES;q=0.8,es;q=0.7,fa-IR;q=0.6,fa;q=0.5",
      "access-token": token,
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      cookie: `access-token-v2=${token}`,
      Referer: `https://www.tradinglite.com/chart/${wsId}`,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: JSON.stringify({"time": + new Date(),"tid": tab_id, "wsId": wsId,"version": version,"region":null}),
    method: "POST",
  });
  const { url } = await data.json();
  return url;
}
var ws;
(async () => {
  const url = await connect();
  ws = new WebSocket(url);
  ws.on("connectFailed", function (error) {
    console.log("Connect Error: " + error.toString());
  });
  ws.on("open", onConnect);
  ws.on("message", parsemsg);
})();

