import { IMethod, IReject, IResponse } from "./declare";
import { CURRENT_VERSION } from "./global-const";
// import * as CommonFunc from "./common-fun";

require("whatwg-fetch");


// let host = "";
// let localHost = "";

if (process.env.NODE_ENV === "production") {
    // 
}

// 粉刷匠 默认请求头数据
const defaultHeaders = {
    // 'Accept': 'application/json',
    // 'Content-Type': 'application/json',
    // todo: 添加其他的一些请求头数据
}

interface IApiFetch {
    host: string,
    get: (url: string, param?: object | string, needDefaultParam?: boolean, header?: object) => Promise<{}>,
    post: (url: string, param?: object | string, header?: object, isConCurrent?: boolean) => Promise<{}>,
}


// 将url中的参数名替换成对应的值
const getApi = (url: string, params: any): string => {
    if (!params || typeof params !== 'object') { return url; }

    // 特殊处理数组
    if (Object.prototype.toString.call(params) === '[object Array]') {
        return url;
    }

    const api: string = Object.keys(params)
        .reduce((accUrl, key) => {
            const keyReg = new RegExp(`:${key}\\??`);
            return accUrl.replace(keyReg, params[key]);
        }, url.trim())
        .replace(/\/:([\w]*)\??/g, "");

    return api;
}

export const ApiFetch: IApiFetch = {
    host: "",
    get: async (url, param = {}, needDefaultParam = true, header = JSON.parse(JSON.stringify(defaultHeaders))) => {
        const params: any = getParam(url, param);
        let api = url.startsWith('http') || url.startsWith('https') ? getApi(url, params) : CURRENT_VERSION.gateway + getApi(url, params);

        if (params && typeof params === 'object' && needDefaultParam) {
            const paramsArray: string[] = [];
            Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
            if (api.search(/\?/) === -1) {
                api += `?${paramsArray.join("&")}`
            } else {
                api += `&${paramsArray.join("&")}`
            }
        }
        return doFetch(api, "GET", undefined, header)
    },

    post: async (url, param = {}, header = JSON.parse(JSON.stringify(defaultHeaders)), isConCurrent = false) => {
        const params = getParam(url, param);
        const api = getApi(url, params);
        const body = typeof params === 'object' ? JSON.stringify(params) : params;
        return doFetch(api, "POST", body, {})
    },
}

// 添加版本信息或者其他额外需要添加的数据
const getParam = (url: string, param: object | undefined | string) => {
    if (typeof param !== "object") { return param }
    return {
        version: "1.0.0",
        // method: url,
        ...param
    }
}

const doFetch = async (api: string, method: IMethod, body: string | undefined, header: any, isConCurrent: boolean = false) =>
    new Promise<object>((resolve: any, reject: IReject) => {
        
        let url: string = '';
        if(url){
            // 
        }
        // let tmpPqm = {};
        body && (/^\{.*\}$/.test(body) || /^\[.*\]$/.test(body)) && JSON.parse(body).baseUrl ?
            url = `${ApiFetch.host}${JSON.parse(body).baseUrl}` :
            url = api.startsWith("http") ? api : `${ApiFetch.host}${api}`;
        const options: RequestInit = {
            method, headers: (body && body !== "{}" && method === "POST") ?
                // new Headers({ ...header, "tkUserToken": CommonFunc.getCookie("tkUserToken") || "", ...tmpPqm }) :
                // new Headers({ ...header, "tkUserToken": CommonFunc.getCookie("tkUserToken") || "" }),
                new Headers({ ...header }) :
                new Headers({ ...header }),
        };

        fetch(api, method === "GET" ? options : { ...options, body })
            .then(response => response)
            .then(response => handleResponse(response, resolve, reject, method, isConCurrent))
            .catch(err => isConCurrent ? resolve({ code: -1 }) : handleCatch(err, reject))
    })


const handleResponse = async (response: any, resolve: any, reject: IReject,
    method: IMethod = "POST", isConCurrent: boolean = false): Promise<IResponse> => {
    return response.json().then((json: any) => {
        const result: IResponse = method === "GET" ? json : {
            _success: json.code === 200 || json.code === 0,
            data: json.data,
            status: response.status,
            statusText: response.statusText,
            code: json.code,
            message: json.msg || json.message,
            getContent: json,
        };


        // 错误代码合计
        // if (json.status && json.status === "404") {
        //     reject({ msg: "错误代码:404(找不到)" });
        // } else if (json.status && json.status === "403") {
        //     // 退出登录
        //     reject({ msg: "错误代码:403(没有访问权限，请联系管理员)" });
        // } else if (json.status && json.status === "401") {
        //     // 退出登录
        //     reject({ msg: "错误代码:401(未登录或登录已失效)" });
        // } else {
        //     reject({ msg: "服务端异常" });
        // }

        resolve(result);
    })
}

const handleCatch = async (err: any, reject: IReject): Promise<any> => {
    let error = err;
    if (typeof err === "object") {
        console.log(err.message);
    } else {
        console.log(err);
        error = { _success: false, message: err }
    }
    reject(error);
    return error;
}