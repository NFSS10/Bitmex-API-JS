# Bitmex API JS

A Javascript package to handle Bitmex APIs. Currently supports the REST API and the WebSocket API.

## Installation

```shell
npm install @nfss10/bitmex-api@latest
```

## Usage

**API example:**

```js
const bitmex = require("@nfss10/bitmex-api");

const apiKey = "YOUR API KEY HERE";
const apiSecret = "YOUR API SECRET HERE";

const api = new bitmex.API(apiKey, apiSecret);
const info = await api.info();

console.log("Info:", info); // Logs the API environment information
```

**WebSocket example:**

```js
const bitmex = require("@nfss10/bitmex-api");

const onMessage = event => {
    console.log("Event data:", event.data);
};

const ws = new bitmex.WebSocket(onMessage);
await ws.init();
```

#### API

```js
API(apiKey, apiSecret, testnet);
```

-   `apiKey` - API Key
-   `apiSecret` - API Secret 1
-   `testnet` - (optional) Dictates if runs on the testnet environment. Default is `false`

#### WebSocket

```js
WebSocket(onMessage, (onOpen = null), (onClose = null), (onError = null));
```

-   `onMessage` - On message callback
-   `onOpen` - (optional) On open callback
-   `onClose` - (optional) On close callback
-   `onError` - (optional) On error callback

## License

[Apache License 2.0](LICENSE)
