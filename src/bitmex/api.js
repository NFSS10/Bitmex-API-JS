const fetch = require("node-fetch");
const crypto = require("crypto");

const API_PATH = "/api/v1";

const __get = async (baseUrl, route, params, apiSecret, apiKey) => {
    const requestType = "GET";
    const urlParams = new URLSearchParams(params);
    const routePath = `${API_PATH}${route}?${urlParams}`;

    const expires = Math.round(Date.now() / 1000) + 60; // 1 min. from now
    const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(requestType + routePath + expires)
        .digest("hex");

    const url = `${baseUrl}${routePath}`;
    const response = await fetch(url, {
        method: requestType,
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
            "api-expires": expires,
            "api-signature": signature
        }
    });
    const json = await response.json();
    return json;
};

const __post = async (baseUrl, route, body, apiSecret, apiKey) => {
    const requestType = "POST";
    const routePath = `${API_PATH}${route}`;
    const bodyStr = JSON.stringify(body);

    const expires = Math.round(Date.now() / 1000) + 60; // 1 min. from now
    const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(requestType + routePath + expires + bodyStr)
        .digest("hex");

    const url = `${baseUrl}${routePath}`;
    const response = await fetch(url, {
        method: requestType,
        body: bodyStr,
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
            "api-expires": expires,
            "api-signature": signature
        }
    });
    const json = await response.json();
    return json;
};

const __put = async (baseUrl, route, body, apiSecret, apiKey) => {
    const requestType = "PUT";
    const routePath = `${API_PATH}${route}`;
    const bodyStr = JSON.stringify(body);

    const expires = Math.round(Date.now() / 1000) + 60; // 1 min. from now
    const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(requestType + routePath + expires + bodyStr)
        .digest("hex");

    const url = `${baseUrl}${routePath}`;
    const response = await fetch(url, {
        method: requestType,
        body: bodyStr,
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
            "api-expires": expires,
            "api-signature": signature
        }
    });
    const json = await response.json();
    return json;
};

const __delete = async (baseUrl, route, body, apiSecret, apiKey) => {
    const requestType = "DELETE";
    const routePath = `${API_PATH}${route}`;
    const bodyStr = JSON.stringify(body);

    const expires = Math.round(Date.now() / 1000) + 60; // 1 min. from now
    const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(requestType + routePath + expires + bodyStr)
        .digest("hex");

    const url = `${baseUrl}${routePath}`;
    const response = await fetch(url, {
        method: requestType,
        body: bodyStr,
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
            "api-expires": expires,
            "api-signature": signature
        }
    });
    const json = await response.json();
    return json;
};

const __sleep = async ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

class API {
    _apiKey;
    _apiSecret;
    _isTestnet;
    _baseUrl;

    constructor(apiKey, apiSecret, testnet = false) {
        if (!apiKey) throw new Error("apiKey argument is required");
        if (!apiSecret) throw new Error("apiSecret argument is required");

        this._apiKey = apiKey;
        this._apiSecret = apiSecret;
        this._isTestnet = testnet;
        this._baseUrl = testnet ? "https://testnet.bitmex.com" : "https://www.bitmex.com";
    }

    async info() {
        const url = `${this._baseUrl}${API_PATH}`;
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    async updateOrder(orderId, body = {}) {
        body.orderID = orderId;
        const result = await __put(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async listOrdersOpen(symbol) {
        const params = {
            symbol: symbol,
            filter: JSON.stringify({ open: true })
        };
        const result = await __get(this._baseUrl, "/order", params, this._apiSecret, this._apiKey);
        return result;
    }

    async cancelOrders(ids, clOrdID = null) {
        const body = {
            orderID: ids,
            clOrdID: clOrdID
        };
        const result = await __delete(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async buyMarket(symbol, orderQty, clOrdID = null) {
        const body = {
            side: "Buy",
            ordType: "Market",
            symbol: symbol,
            orderQty: orderQty,
            clOrdID: clOrdID
        };
        const result = await __post(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async sellMarket(symbol, orderQty, clOrdID = null) {
        const body = {
            side: "Sell",
            ordType: "Market",
            symbol: symbol,
            orderQty: orderQty,
            clOrdID: clOrdID
        };
        const result = await __post(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async buyLimit(symbol, orderQty, price, clOrdID = null) {
        const body = {
            side: "Buy",
            ordType: "Limit",
            execInst: "ParticipateDoNotInitiate",
            symbol: symbol,
            orderQty: orderQty,
            price: price,
            clOrdID: clOrdID
        };
        const result = await __post(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async sellLimit(symbol, orderQty, price, clOrdID = null) {
        const body = {
            side: "Sell",
            ordType: "Limit",
            execInst: "ParticipateDoNotInitiate",
            symbol: symbol,
            orderQty: orderQty,
            price: price,
            clOrdID: clOrdID
        };
        const result = await __post(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async reduceOnlyOrder(symbol, side, orderQty, limitPrice, clOrdID = null) {
        const body = {
            ordType: "Limit",
            execInst: "ReduceOnly",
            side: side,
            symbol: symbol,
            orderQty: orderQty,
            price: limitPrice,
            clOrdID: clOrdID
        };
        const result = await __post(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async stopMarket(symbol, side, orderQty, price, clOrdID = null) {
        const body = {
            ordType: "Stop",
            side: side,
            symbol: symbol,
            orderQty: orderQty,
            stopPx: price,
            clOrdID: clOrdID
        };
        const result = await __post(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async setLeverage(symbol, leverage = 1) {
        const body = {
            symbol: symbol,
            leverage: leverage
        };
        const result = await __post(this._baseUrl, "/position/leverage", body, this._apiSecret, this._apiKey);
        return result;
    }

    async position(symbol = null) {
        const params = {};
        let result = await __get(this._baseUrl, "/position", params, this._apiSecret, this._apiKey);
        result = symbol ? result.find(p => p.symbol === symbol) : result;
        return result;
    }

    async getHistoricalData(symbol, interval = "1m", start = 0, count = 1000, startTime = null, endTime = null) {
        if (count > 1000) throw new Error("'count' cannot be greater than 1000");
        const params = {
            count: count,
            start: start,
            symbol: symbol,
            binSize: interval,
            startTime: startTime,
            endTime: endTime
        };
        const result = await __get(this._baseUrl, "/trade/bucketed", params, this._apiSecret, this._apiKey);
        return result;
    }

    async getAllHistoricalData(symbol, interval = "1m", startTime = null, endTime = null) {
        const result = [];

        let start = 0;
        const count = 1000;
        let isFinished = false;
        while (!isFinished) {
            const promises = [];

            // the Bitmex request limit is 120 requests per minute, so it
            // tries avoid that limit by first waiting a minute and then
            // keep doing 115 requests per minute util it has all the data
            await __sleep(60000);
            for (let i = 0; i < 115; i++) {
                const promise = this.getHistoricalData(symbol, interval, start, count, startTime, endTime);
                promises.push(promise);
                start += 1000;
            }
            const data = await Promise.all(promises);

            // checks for errors
            const invalidData = data.find(r => !Array.isArray(r));
            if (invalidData) return invalidData;

            // merges data
            result.push(...data.flat());
            isFinished = data[data.length - 1].length === 0;
        }

        return result;
    }
}

module.exports = API;
