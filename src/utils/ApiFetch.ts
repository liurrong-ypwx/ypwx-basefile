require("whatwg-fetch");

// 粉刷匠 类型定义
export type IMethod = "POST" | "GET";
export type IReject = (reason: any) => void;
export type IResolve<T> = (value?: T | PromiseLike<T>) => void;

// 粉刷匠 默认请求头数据
const defaultHeaders = {
    'Content-Type': 'application/json'
}

interface IApiFetch {
    host: string,
    get: (url: string, param?: object, header?: object) => Promise<{}>,
    post: (url: string, param?: object, heander?: object) => Promise<{}>,
}

const getUrl = (url: string, param: any) => {
    if (param) {
        const arr: any = [];
        Object.keys(param).forEach(key => arr.push(`${key}=${param[key]}`));
        if (url.search(/\?/) === -1) {
            url += `?${arr.join("&")}`
        } else {
            url += `&${arr.join("&")}`
        }
    }
    return url;
}

export const ApiFetch: IApiFetch = {
    host: "",
    get: async (url, param = {}, header = JSON.parse(JSON.stringify(defaultHeaders))) => {
        const realUrl = getUrl(url, param);
        return doFetch(realUrl, "GET", undefined, header)
    },
    post: async (url, param = {}, header = JSON.parse(JSON.stringify(defaultHeaders))) => {
        const realParam = getParam(url, param);
        const body = typeof realParam === "object" ? JSON.stringify(realParam) : realParam;
        return doFetch(url, "POST", body, {})
    },
}

// 添加版本信息或者其他额外需要添加的数据
const getParam = (url: string, param: object | undefined) => {
    if (typeof param !== "object") { return param }
    return {
        version: "1.0.0",
        method: url,
        ...param
    }
}

const doFetch = async (api: string, method: IMethod, body: string | undefined, header: any) =>
    new Promise<object>((resolve: IResolve<object>, reject: IReject) => {
        const options = {
            method,
        }
        fetch(api, method === "GET" ? options : { ...options, body })
            .then(response => response)
            .then(response => handleResponse(response, resolve, reject, method))
            .catch(err => resolve({ code: -1 }))
    })

interface IResJson {
    code?: number,
    data?: object | null | undefined,
    msg?: string | null | undefined,
    message?: string | null | undefined,
    status?: string | number | null | undefined
}
interface IResponse {
    _success?: boolean,
    code?: number,
    data?: object | null | undefined,
    msg?: string | null | undefined,
    message?: string | null | undefined
}
const handleResponse = async (response: any, resolve: IResolve<object>, reject: IReject, method: IMethod) => {
    return response.json().then((json: IResJson) => {
        const result: IResponse = json;

        // 错误代码合计
        if (json.status && json.status === "404") {
            reject({ msg: "错误代码:404(找不到)" });
        } else if (json.status && json.status === "403") {
            // 退出登录
            reject({ msg: "错误代码:403(没有访问权限，请联系管理员)" });
        } else if (json.status && json.status === "401") {
            // 退出登录
            reject({ msg: "错误代码:401(未登录或登录已失效)" });
        } else {
            reject({ msg: "服务端异常" });
        }

        resolve(result);
    })
}