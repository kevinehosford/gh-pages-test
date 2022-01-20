"use strict";
const clickAndHoverHelper_1 = require("./clickAndHoverHelper");
function imagesHaveLoaded() {
    return Array.from(document.images).every((i) => i.complete);
}
module.exports = async (page, scenario, vp) => {
    console.log(`SCENARIO > ${scenario.label}`);
    // Support having multiple readySelectors.
    if (scenario.readySelectors) {
        for (const readySelector of scenario.readySelectors) {
            console.log('Waiting for...', readySelector);
            await page.waitFor(readySelector);
        }
    }
    await (0, clickAndHoverHelper_1.clickAndHoverHelper)(page, scenario);
    await page.waitForFunction(imagesHaveLoaded);
    if (scenario.onReady) {
        await scenario.onReady(page, scenario);
    }
};
