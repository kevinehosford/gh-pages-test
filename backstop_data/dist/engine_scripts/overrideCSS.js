"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideCSS = void 0;
const BACKSTOP_TEST_CSS_OVERRIDE = `html {background-image: none;}`;
function overrideCSS(page, scenario) {
    // inject arbitrary css to override styles
    page.evaluate(`window._styleData = '${BACKSTOP_TEST_CSS_OVERRIDE}'`);
    page.evaluate(() => {
        const style = document.createElement('style');
        style.type = 'text/css';
        const styleNode = document.createTextNode(window._styleData);
        style.appendChild(styleNode);
        document.head.appendChild(style);
    });
    console.log(`BACKSTOP_TEST_CSS_OVERRIDE injected for: ${scenario.label}`);
}
exports.overrideCSS = overrideCSS;
