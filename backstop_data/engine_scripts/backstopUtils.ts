import { Config, Scenario } from 'backstopjs';
import { Page, Protocol } from 'puppeteer';
import { FixtureRoute } from 'puppeteer-request-intercepter';

export interface ExtendedConfig extends Config {
  dockerCommandTemplate?: string;
}

export interface ExtendedScenario extends Scenario {
  // Use `cookies`, instead of `cookiePath`.
  // `cookies` has better type checking and `cookiePath` no longer has code to support it.
  cookies?: Protocol.Network.CookieParam[];
  fixtures?: FixtureRoute[];
  readySelectors?: string[];
  description?: string;
  onReady?(page: Page, scenario: ExtendedScenario): Promise<void>;
}
