"use strict";
const puppeteer_request_intercepter_1 = require("puppeteer-request-intercepter");
const loadCookies_1 = require("./loadCookies");
module.exports = async (page, scenario, vp) => {
    await (0, loadCookies_1.loadCookies)(page, scenario.cookies);
    // Configure fixtures:
    if (scenario.fixtures) {
        const fixtureRouter = await (0, puppeteer_request_intercepter_1.initFixtureRouter)(page, {
            baseUrl: `http://${process.env.HOST_DOMAIN}:8083`,
            fixtureBasePath: 'backstop_data/engine_scripts/fixtures',
        });
        scenario.fixtures.forEach((fixture) => {
            fixtureRouter.routeFixture(fixture);
        });
    }
};
