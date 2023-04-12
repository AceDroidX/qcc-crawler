import CryptoJS from 'crypto-js';
import qs from 'qs'
import axios, { AxiosRequestConfig } from 'axios'

var o_default: any = {
    "n": 20,
    "codes": {
        "0": "W",
        "1": "l",
        "2": "k",
        "3": "B",
        "4": "Q",
        "5": "g",
        "6": "f",
        "7": "i",
        "8": "i",
        "9": "r",
        "10": "v",
        "11": "6",
        "12": "A",
        "13": "K",
        "14": "N",
        "15": "k",
        "16": "4",
        "17": "L",
        "18": "1",
        "19": "8"
    }
}
var win_tid = '645d31dd8b5faefeb54b927ac6fa7a00'

var qs_options: qs.IStringifyOptions = {
    // allowPrototypes: true,
    encodeValuesOnly: true,
    sort: function (e, t) {
        return e.localeCompare(t)
    },
    allowDots: true,
    arrayFormat: "brackets"
}

function HMACEncode(e: string, n: string) {
    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, n);
    let hash = hmac.finalize(e);
    return hash.toString()
}

function a_default(...args: any[]) {
    for (var e = (args.length > 0 && void 0 !== args[0] ? args[0] : "/").toLowerCase(), t = e + e, n = "", i = 0; i < t.length; ++i) {
        var a = t[i].charCodeAt() % o_default.n;
        n += o_default.codes[a]
    }
    return n
};

function value_r_default(...args: any[]) {
    var e = args.length > 1 && void 0 !== args[1] ? args[1] : {}
        , t = args.length > 2 && void 0 !== args[2] ? args[2] : ""
        , n = (args.length > 0 && void 0 !== args[0] ? args[0] : "/").toLowerCase()
        , i = JSON.stringify(e).toLowerCase();
    return HMACEncode(n + "pathString" + i + t, a_default(n))
};

function key_a_default(...args: any[]) {
    var e = args.length > 1 && void 0 !== args[1] ? args[1] : {}
        , t = (args.length > 0 && void 0 !== args[0] ? args[0] : "/").toLowerCase()
        , n = JSON.stringify(e).toLowerCase();
    return HMACEncode(t + n, a_default(t)).toLowerCase().substr(8, 20)
};

function calculateSignHeader(e: AxiosRequestConfig) {
    if (!e.baseURL || !e.url || !e.headers) return
    var t = e.url.replace(e.baseURL, "")
        , n = qs.stringify(e.params || {}, qs_options)
    n && (t += (-1 === t.indexOf("?") ? "?" : qs_options.delimiter || "&") + n),
        t = t.toLowerCase();
    var i = key_a_default(t, e.data)
        , l = value_r_default(t, e.data, win_tid);
    return { key: i, value: l }
}

export function QCCGet<T = any>(url: string) {
    const instance = axios.create({
        baseURL: 'https://www.qcc.com',
        headers: {
            accept: 'application/json, text/plain, */*', referer: 'https://www.qcc.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            cookie: process.env['cookie'],
        }
    });
    instance.interceptors.request.use((config) => {
        const sign = calculateSignHeader(config)
        // console.log(config)
        // console.log(sign)
        if (!sign) return config
        config.headers[sign.key] = sign.value
        return config;
    })
    return instance.get<T>(url)
    // console.log(resp.data)
}