const WebSocket = require("ws");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on("connection", ws => {
  clients.add(ws);
  ws.on("message", msg => {
    for (const c of clients)
      if (c !== ws && c.readyState === WebSocket.OPEN)
        c.send(msg);
  });
  ws.on("close", () => clients.delete(ws));
});

app.get("/", (req, res) => res.send("🛰️ WebSocket server online!"));
server.listen(process.env.PORT || 3000, () =>
  console.log("✅ Running on port", process.env.PORT || 3000)
);
