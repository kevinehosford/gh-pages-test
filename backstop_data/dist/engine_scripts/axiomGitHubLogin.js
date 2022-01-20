"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiomGitHubLogin = void 0;
const puppeteerUtils_1 = require("./puppeteerUtils");
// 🐉🐉🐉
// WIP: Attempt at automating a login via GitHub.
// Having Axiom Console in the middle makes it more difficult. It doesn't seem to like that we're proxying using axiom-proxy.js.
const axiomGitHubLogin = async (page, scenario) => {
    await page.setBypassCSP(true);
    await page.setRequestInterception(true);
    let gitHubRedirect;
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
    await (0, puppeteerUtils_1.clickWhenVisible)(page, '.ant-btn-primary');
    // Click "GitHub" option.
    await (0, puppeteerUtils_1.clickWhenVisible)(page, (0, puppeteerUtils_1.sel)('githubLogin'));
    const selSubmit = 'input[type="submit"]';
    await page.waitForSelector(selSubmit, { visible: true });
    const submitButton = await page.$(selSubmit);
    await page.type('#login_field', 'axe2e', puppeteerUtils_1.typingOptions);
    await page.type('#password', 'lewd-synonymy-mare', puppeteerUtils_1.typingOptions);
    await submitButton.click();
};
exports.axiomGitHubLogin = axiomGitHubLogin;
