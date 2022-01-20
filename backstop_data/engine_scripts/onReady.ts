import { Page } from 'puppeteer';

import { ExtendedScenario } from './backstopUtils';
import { clickAndHoverHelper } from './clickAndHoverHelper';

function imagesHaveLoaded() {
  return Array.from(document.images).every((i) => i.complete);
}

export = async (page: Page, scenario: ExtendedScenario, vp) => {
  console.log(`SCENARIO > ${scenario.label}`);

  // Support having multiple readySelectors.
  if (scenario.readySelectors) {
    for (const readySelector of scenario.readySelectors) {
      console.log('Waiting for...', readySelector);
      await page.waitFor(readySelector);
    }
  }

  await clickAndHoverHelper(page, scenario);

  await page.waitForFunction(imagesHaveLoaded);

  if (scenario.onReady) {
    await scenario.onReady(page, scenario);
  }
};
