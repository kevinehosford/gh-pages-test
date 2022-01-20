"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCookies = void 0;
exports.authCookies = [
    {
        url: `http://${process.env.HOST_DOMAIN}`,
        path: '/',
        name: 'axiom.sid',
        value: process.env.AXIOM_SID,
        expires: 1798790400,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
    },
];
