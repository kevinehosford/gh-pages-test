"use strict";
const authCookies_1 = require("./authCookies");
const loadCookies_1 = require("./loadCookies");
module.exports = async (page, scenario, vp) => {
    // Load the auth cookie.
    await (0, loadCookies_1.loadCookies)(page, authCookies_1.authCookies);
    // Call the normal onBefore routine.
    await require('./onBefore')(page, scenario);
};
