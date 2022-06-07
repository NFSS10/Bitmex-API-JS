const nodeWebSocket = require("ws");

const CONNECTION_URI = "wss://ws.bitmex.com/realtime"

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
    _ws;
    _isOpen;
    _onMessage;
    _onOpen;
    _onClose;
    _onError;

    constructor(
        onMessage,
        onOpen = null,
        onClose = null,
        onError = null) {
        if (!onMessage) throw new Error("onMessage argument is required");

        this._onMessage = onMessage;
        this._onOpen = onOpen || __onOpen;
        this._onClose = onClose || __onClose;
        this._onError = onError || __onError;
    }

    async init() {
        return new Promise(resolve => {
            this._ws = new nodeWebSocket(CONNECTION_URI);

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

    close() {
        this._ws.close();
    }
}

module.exports = WebSocket;