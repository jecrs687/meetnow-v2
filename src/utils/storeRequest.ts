
"use client";
function functionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}


export const storeRequest = async (func, callback, name) => {
    const value = 'cache__' + name
    const data = localStorage.getItem(value);
    if (data) callback(JSON.parse(data));
    const response = await func();
    localStorage.setItem(value, JSON.stringify(response));
    if (JSON.stringify(response) !== JSON.stringify(data)) callback(response);
    return response;
}