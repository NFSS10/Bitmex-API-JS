const api = require("./api");
const websocket = require("./websocket");

Object.assign(module.exports, {
    API: api,
    WebSocket: websocket
});