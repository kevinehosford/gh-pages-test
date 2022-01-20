import { Protocol } from 'puppeteer';

export const authCookies: Protocol.Network.CookieParam[] = [
  {
    url: `http://${process.env.HOST_DOMAIN}`,
    path: '/',
    name: 'axiom.sid',
    value: process.env.AXIOM_SID,
    expires: 1798790400, // Fri, 01 Jan 2027 08:00:00
    httpOnly: false,
    secure: false,
    sameSite: 'Lax',
  },
];
