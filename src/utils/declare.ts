export type IResolve<T> = (value?: T | PromiseLike<T>) => void;
export type IReject = (reason?: any) => void;
export type IMethod = "POST" | "GET" | "DELETE" | "PUT";

export interface IConCurrentParam {
    api: string,
    body: object
}

export interface IResJson {
    code?: number,
    data?: object | null | undefined,
    msg?: string | null | undefined,
    message?: string | null | undefined,
    status?: string | number | null | undefined
}
export interface IResponse {
    _success?: boolean,
    code?: number,
    data?: object | null | undefined,
    msg?: string | null | undefined,
    message?: string | null | undefined
}