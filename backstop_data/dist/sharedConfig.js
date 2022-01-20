"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConfig = exports.viewports = exports.includesScenario = exports.baseScenario = void 0;
const minimist = require('minimist');
// Process the args, e.g. npm run test -- --include=<scenario label> --include=<other scenario label> --debugWindow=true
const { debugWindow, include, viewport, CI } = minimist(process.argv.slice(2));
if (!process.env.HOST_DOMAIN) {
    process.env.HOST_DOMAIN = CI ? 'localhost' : 'host.docker.internal';
    console.warn(`'HOST_DOMAIN' is not set. Using ${process.env.HOST_DOMAIN}`);
}
const useDebugWindow = debugWindow === 'true';
if (useDebugWindow) {
    // If debugWindow is true then we're not using Docker, so reset HOST_DOMAIN to localhost.
    process.env.HOST_DOMAIN = 'localhost';
    console.log(`Using debugWindow. Resetting 'HOST_DOMAIN' to ${process.env.HOST_DOMAIN}.`);
}
exports.baseScenario = {
    referenceUrl: '',
    readyEvent: '',
    readySelector: '',
    delay: useDebugWindow ? 3000000 : 0,
    hideSelectors: [],
    removeSelectors: [],
    hoverSelector: '',
    clickSelector: '',
    postInteractionWait: 0,
    selectors: [],
    selectorExpansion: true,
    expect: 0,
    misMatchThreshold: 0.0,
    requireSameDimensions: true,
};
const includesScenario = ({ label }) => !include || (Array.isArray(include) && include.indexOf(label) !== -1) || include === label;
exports.includesScenario = includesScenario;
exports.viewports = [
    // {
    //   label: 'phone',
    //   width: 320,
    //   height: 1200,
    // },
    {
        label: 'tablet',
        width: 1024,
        height: 768,
    },
    {
        label: 'desktop',
        width: 1200,
        height: 900,
    },
    {
        label: 'desktop-lg',
        width: 2000,
        height: 1200,
    },
];
exports.baseConfig = {
    // Add the ` --net="host"` param for Linux.
    dockerCommandTemplate: 'docker run -e AXIOM_SID="$AXIOM_SID" --rm -i --net="host" --mount type=bind,source="{cwd}",target=/src dockerman33/backstopjs:5.4.4 {backstopCommand} {args}',
    viewports: exports.viewports,
    paths: {
        bitmaps_reference: 'backstop_data/bitmaps_reference',
        bitmaps_test: 'backstop_data/bitmaps_test',
        engine_scripts: 'backstop_data/dist/engine_scripts',
        html_report: 'backstop_data/html_report',
        ci_report: 'backstop_data/ci_report',
    },
    report: CI ? ['CI'] : ['browser'],
    engine: 'puppeteer',
    engineOptions: {
        args: ['--no-sandbox'],
        executablePath: useDebugWindow ? undefined : '/usr/bin/chromium',
    },
    asyncCaptureLimit: 1,
    asyncCompareLimit: 10,
    debug: false,
    debugWindow: useDebugWindow,
    onBeforeScript: 'onBeforeAuthed.js',
    onReadyScript: 'onReady.js',
};
