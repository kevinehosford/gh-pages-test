"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCookies = void 0;
const loadCookies = async (page, cookies) => {
    if (!cookies || !cookies.length) {
        return;
    }
    // SET COOKIES
    const setCookies = async () => {
        return Promise.all(cookies.map(async (cookie) => {
            await page.setCookie(cookie);
        }));
    };
    await setCookies();
    console.log('Cookie state restored with:', JSON.stringify(cookies, null, 2));
};
exports.loadCookies = loadCookies;
