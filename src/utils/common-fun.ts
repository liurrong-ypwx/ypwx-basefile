export const getCookie = (key: string): string | undefined => {
    const reg = new RegExp(`(^|)*${key}=([^;]*)(;|$)`);
    const res = document.cookie.match(reg);
    return res ? unescape(res[2]) : undefined;
}