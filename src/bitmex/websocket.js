const NodeWebSocket = require("ws");
const crypto = require("crypto");

const __onOpen = event => {
    console.log("Connected to Bitmex Realtime API");
};

const __onClose = event => {
    console.log("Closed Bitmex Realtime API connection");
};

const __onError = event => {
    console.error("[Bitmex WebSocket Error]:", event.message);
};

class WebSocket {
    _connectionURI;
    _ws;
    _isOpen;
    _onMessage;
    _onOpen;
    _onClose;
    _onError;
    _keepAliveInterval;

    constructor(onMessage, onOpen = null, onClose = null, onError = null) {
        if (!onMessage) throw new Error("onMessage argument is required");

        this._onMessage = onMessage;
        this._onOpen = onOpen || __onOpen;
        this._onClose = onClose || __onClose;
        this._onError = onError || __onError;
    }

    async init(testnet = false) {
        return new Promise(resolve => {
            this._connectionURI = testnet ? "wss://ws.testnet.bitmex.com/realtime" : "wss://ws.bitmex.com/realtime";
            this._ws = new NodeWebSocket(this._connectionURI);

            this._ws.onopen = event => {
                this._isOpen = true;
                this._onOpen(event);
                resolve(true);
            };
            this._ws.onmessage = event => this._onMessage(event);
            this._ws.onclose = event => {
                this._isOpen = false;
                this._onClose(event);
            };
            this._ws.onerror = event => this._onError(event);
        });
    }

    async auth(apiKey = null, apiSecret = null) {
        if (!apiKey) throw new Error("apiKey argument is required");
        if (!apiSecret) throw new Error("apiSecret argument is required");
        if (!this._isOpen) return false;

        const requestType = "GET";
        const routePath = "/realtime";
        const expires = Math.round(Date.now() / 1000) + 60; // 1 min. from now
        const signature = crypto
            .createHmac("sha256", apiSecret)
            .update(requestType + routePath + expires)
            .digest("hex");

        const op = JSON.stringify({ op: "authKeyExpires", args: [apiKey, expires, signature] });
        this._ws.send(op);
    }

    subscribe(args = []) {
        if (!this._isOpen) return false;

        const op = JSON.stringify({ op: "subscribe", args: args });
        this._ws.send(op);

        return true;
    }

    unsubscribe(args = []) {
        if (!this._isOpen) return false;

        const op = JSON.stringify({ op: "unsubscribe", args: args });
        this._ws.send(op);

        return true;
    }

    keepAlive() {
        if (!this._isOpen) return false;

        this._ws.send("ping");
        clearInterval(this._keepAliveInterval);
        this._keepAliveInterval = setInterval(() => this._ws.send("ping"), 2700000); // 45 min.

        return true;
    }

    close() {
        clearInterval(this._keepAliveInterval);
        this._keepAliveInterval = null;

        this._ws.close();
        process.nextTick(() => {
            if ([this._ws.OPEN, this._ws.CLOSING].includes(this._ws.readyState)) this._ws.terminate();
        });
    }
}

module.exports = WebSocket;
