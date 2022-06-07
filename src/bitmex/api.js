const fetch = require("node-fetch");
const crypto = require('crypto');

const API_PATH = "/api/v1";

const __get = async (baseUrl, route, apiSecret, apiKey) => {
    const requestType = "GET";
    const routePath = `${API_PATH}${route}`;

    const expires = Math.round(Date.now() / 1000) + 60; // 1 min. from now
    const signature = crypto.createHmac("sha256", apiSecret)
        .update(requestType + routePath + expires)
        .digest("hex");
    
    const url = `${baseUrl}${routePath}`  
    const response = await fetch(url,
    {
        method: requestType,
        headers: {
            "Content-Type": "application/json", 
        "api-key": apiKey,
        "api-expires": expires,
        "api-signature": signature}
    });
    const json = await response.json();
    return json;
}

const __post = async (baseUrl, route, body, apiSecret, apiKey) => {
    const requestType = "POST";
    const routePath = `${API_PATH}${route}`;
    const bodyStr = JSON.stringify(body);

    const expires = Math.round(Date.now() / 1000) + 60; // 1 min. from now
    const signature = crypto.createHmac("sha256", apiSecret)
        .update(requestType + routePath + expires + bodyStr)
        .digest("hex");

        const url = `${baseUrl}${routePath}`  
        const response = await fetch(url, {
            method: requestType,
            body: bodyStr,
            headers: {
                'Content-Type': 'application/json', 
            'api-key': apiKey,
            'api-expires': expires,
            'api-signature': signature}
        })
        const json = await response.json();
        return json;
}


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
        const url = `${this._baseUrl}${API_PATH}` 
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    async createOrder() {
        const body = {
            symbol: "XBTUSD",
            side: "Buy",
            ordType: "Limit",
            orderQty: 100, // lot size has to be a multiple of 100
            price: 30400,
            text: "example message"
        }
        const result = await __post(this._baseUrl, "/order", body, this._apiSecret, this._apiKey);
        return result;
    }

    async updateLeverage() {
        const body = {
            symbol: "XBTUSD",
            leverage: 15
        }
        const result = await __post(this._baseUrl, "/position/leverage", body, this._apiSecret, this._apiKey);
        return result;
    }

    async position() {
        const result = await __get(this._baseUrl, "/position", this._apiSecret, this._apiKey);
        return result;
    }
}

module.exports = API;
