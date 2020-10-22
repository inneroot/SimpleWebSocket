const express = require('express');
const WebSocket = require('ws');

const app = express();

const WebSocketServer = new WebSocket.Server({ noServer: true });

WebSocketServer.on('connection', socket => {
  console.log('connection')
  var stopInterval = setInterval(() => {
    console.log(WebSocketServer.clients.size)
    if( WebSocketServer.clients.size > 0) {
    console.log('interval message')
    socket.send('interval message')
    }
    else {
      clearInterval(stopInterval)
    }
  }, 1000)
  socket.on('message', message => {
    console.log(message)
    socket.send('Server: '+message)
  });
});

WebSocketServer.on('close', () => {
  clearInterval(stopInterval)
  console.log('connection closed')})
WebSocketServer.on('error', e => console.log(e.message))
// `server` is a vanilla Node.js HTTP server, so use
// the same WebSocket upgrade process described here:
// https://www.npmjs.com/package/WebSocket#multiple-servers-sharing-a-single-https-server
const server = app.listen(8000);
console.log('Server Start.')

server.on('upgrade', (request, socket, head) => {
  WebSocketServer.handleUpgrade(request, socket, head, socket => {
    WebSocketServer.emit('connection', socket, request);
  });
});