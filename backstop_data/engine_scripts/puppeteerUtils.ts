import { ClickOptions, Page } from 'puppeteer';

export const backspace = async (page: Page, times: number, focusSelector?: string): Promise<void> => {
  if (focusSelector) {
    await page.focus(focusSelector);
  }

  for (let ii = 0; ii < times - 1; ii += 1) {
    await page.keyboard.press('Backspace');
  }

  return page.keyboard.press('Backspace');
};

export const delay = async (timeout: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const sel = (id: string): string => {
  return `[data-test="${id}"]`;
};

export const waitForHidden = async (
  page: Page,
  selector: string,
  extraDelay?: number,
  timeout?: number
): Promise<void> => {
  await page.waitForSelector(selector, { hidden: true, timeout: timeout });

  if (extraDelay) {
    await delay(extraDelay);
  }
};

export const waitForVisible = async (
  page: Page,
  selector: string,
  extraDelay?: number,
  timeout?: number
): Promise<void> => {
  await page.waitForSelector(selector, { visible: true, timeout: timeout });

  if (extraDelay) {
    await delay(extraDelay);
  }
};

export const clickWhenVisible = async (
  page: Page,
  selector: string,
  timeout?: number,
  clickOptions?: ClickOptions
): Promise<void> => {
  await waitForVisible(page, selector, undefined, timeout);

  return page.click(selector, clickOptions);
};

export const url = (relativePath: string = ''): string => {
  return `http://${process.env.HOST_DOMAIN}:8083${relativePath}`;
};

export const typingOptions = {
  delay: 20,
};
