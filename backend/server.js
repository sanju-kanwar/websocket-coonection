const WebSocket = require('ws');

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });
const HEARTBEAT_INTERVAL = 30000;

function heartbeat() {
  this.isAlive = true;
}

server.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  console.log('Client connected');
  ws.send(JSON.stringify({ type: 'status', message: 'Connected to WebSocket server' }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

setInterval(() => {
  server.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);

console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
