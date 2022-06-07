const bitmex = require("./bitmex");

Object.assign(module.exports, {
    API: bitmex.API,
    WebSocket: bitmex.WebSocket
});
