import { Page, Protocol } from 'puppeteer';

export const loadCookies = async (page: Page, cookies?: Protocol.Network.CookieParam[]) => {
  if (!cookies || !cookies.length) {
    return;
  }

  // SET COOKIES
  const setCookies = async () => {
    return Promise.all(
      cookies.map(async (cookie) => {
        await page.setCookie(cookie);
      })
    );
  };
  await setCookies();
  console.log('Cookie state restored with:', JSON.stringify(cookies, null, 2));
};
