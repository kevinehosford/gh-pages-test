"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typingOptions = exports.url = exports.clickWhenVisible = exports.waitForVisible = exports.waitForHidden = exports.sel = exports.delay = exports.backspace = void 0;
const backspace = async (page, times, focusSelector) => {
    if (focusSelector) {
        await page.focus(focusSelector);
    }
    for (let ii = 0; ii < times - 1; ii += 1) {
        await page.keyboard.press('Backspace');
    }
    return page.keyboard.press('Backspace');
};
exports.backspace = backspace;
const delay = async (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};
exports.delay = delay;
const sel = (id) => {
    return `[data-test="${id}"]`;
};
exports.sel = sel;
const waitForHidden = async (page, selector, extraDelay, timeout) => {
    await page.waitForSelector(selector, { hidden: true, timeout: timeout });
    if (extraDelay) {
        await (0, exports.delay)(extraDelay);
    }
};
exports.waitForHidden = waitForHidden;
const waitForVisible = async (page, selector, extraDelay, timeout) => {
    await page.waitForSelector(selector, { visible: true, timeout: timeout });
    if (extraDelay) {
        await (0, exports.delay)(extraDelay);
    }
};
exports.waitForVisible = waitForVisible;
const clickWhenVisible = async (page, selector, timeout, clickOptions) => {
    await (0, exports.waitForVisible)(page, selector, undefined, timeout);
    return page.click(selector, clickOptions);
};
exports.clickWhenVisible = clickWhenVisible;
const url = (relativePath = '') => {
    return `http://${process.env.HOST_DOMAIN}:8083${relativePath}`;
};
exports.url = url;
exports.typingOptions = {
    delay: 20,
};
