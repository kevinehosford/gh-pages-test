import { Page } from 'puppeteer';
import { initFixtureRouter } from 'puppeteer-request-intercepter';

import { ExtendedScenario } from './backstopUtils';
import { loadCookies } from './loadCookies';

export = async (page: Page, scenario: ExtendedScenario, vp) => {
  await loadCookies(page, scenario.cookies);

  // Configure fixtures:
  if (scenario.fixtures) {
    const fixtureRouter = await initFixtureRouter(page, {
      baseUrl: `http://${process.env.HOST_DOMAIN}:8083`,
      fixtureBasePath: 'backstop_data/engine_scripts/fixtures',
    });

    scenario.fixtures.forEach((fixture) => {
      fixtureRouter.routeFixture(fixture);
    });
  }
};
