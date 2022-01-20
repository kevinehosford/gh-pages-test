import { Scenario } from 'backstopjs';
import { Page } from 'puppeteer';

import { clickWhenVisible, sel, typingOptions } from './puppeteerUtils';

// 🐉🐉🐉
// WIP: Attempt at automating a login via GitHub.
// Having Axiom Console in the middle makes it more difficult. It doesn't seem to like that we're proxying using axiom-proxy.js.
export const axiomGitHubLogin = async (page: Page, scenario: Scenario) => {
  await page.setBypassCSP(true);
  await page.setRequestInterception(true);

  let gitHubRedirect: string;

  page.on('request', (request) => {
    // catch github redirect and redirect to our local Docker url instead.
    if (request.url().startsWith('http://localhost:8080/auth/github/callback?code=')) {
      gitHubRedirect = request.url().replace('localhost:8080', `${process.env.HOST_DOMAIN}:8083`);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    request.continue();
  });

  await page.goto(`http://${process.env.HOST_DOMAIN}:8083`);

  // Click "Sign-in with Axiom" which redirect to Axiom Console site.
  await clickWhenVisible(page, '.ant-btn-primary');

  // Click "GitHub" option.
  await clickWhenVisible(page, sel('githubLogin'));

  const selSubmit = 'input[type="submit"]';
  await page.waitForSelector(selSubmit, { visible: true });
  const submitButton = await page.$(selSubmit);

  await page.type('#login_field', 'axe2e', typingOptions);
  await page.type('#password', 'lewd-synonymy-mare', typingOptions);

  await submitButton.click();
};
