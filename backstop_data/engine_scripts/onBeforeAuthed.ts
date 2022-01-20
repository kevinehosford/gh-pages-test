import { Scenario } from 'backstopjs';
import { Page } from 'puppeteer';

import { authCookies } from './authCookies';
import { loadCookies } from './loadCookies';

export = async (page: Page, scenario: Scenario, vp) => {
  // Load the auth cookie.
  await loadCookies(page, authCookies);

  // Call the normal onBefore routine.
  await require('./onBefore')(page, scenario);
};
