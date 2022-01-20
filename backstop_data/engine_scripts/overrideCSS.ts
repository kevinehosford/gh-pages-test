/* eslint-disable @typescript-eslint/no-floating-promises */
import { Scenario } from 'backstopjs';
import { Page } from 'puppeteer';

const BACKSTOP_TEST_CSS_OVERRIDE = `html {background-image: none;}`;

export function overrideCSS(page: Page, scenario: Scenario) {
  // inject arbitrary css to override styles
  page.evaluate(`window._styleData = '${BACKSTOP_TEST_CSS_OVERRIDE}'`);
  page.evaluate(() => {
    const style = document.createElement('style');
    style.type = 'text/css';
    const styleNode = document.createTextNode((window as any)._styleData);
    style.appendChild(styleNode);
    document.head.appendChild(style);
  });

  console.log(`BACKSTOP_TEST_CSS_OVERRIDE injected for: ${scenario.label}`);
}
