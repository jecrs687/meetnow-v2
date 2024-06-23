"use client";


const temp = {
    get: () => null,
    set: () => null,
    remove: () => null,
    clear: () => null,
}
export const storage = () => {
    if (typeof window === "undefined") return temp;
    if (!window.localStorage) return temp;
    const storage = window.localStorage;
    return {
        get: (key: string) => {
            const value = storage.getItem(key);
            if (value) return JSON.parse(value);
            return null;
        },
        set: (key: string, value: any) => {
            storage.setItem(key, JSON.stringify(value));
        },
        remove: (key: string) => {
            storage.removeItem(key);
        },
        clear: () => {
            storage.clear();
        },
    };
}