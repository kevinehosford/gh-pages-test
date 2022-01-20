"use strict";
// cSpell:ignore apexcharts Ebgc gridcell hljs Ldwk rcvd Sjdvt uplot vfields arnesynth twmz vfield Fqwk fieldlist
require('dotenv').config();
const minimist = require('minimist');
// Process the args, e.g. npm run test -- --include=<scenario label> --include=<other scenario label> --debugWindow=true
const { debugWindow } = minimist(process.argv.slice(2));
const useDebugWindow = debugWindow === 'true';
// If debugWindow is true then we're not using Docker, so reset HOST_DOMAIN to localhost.
if (useDebugWindow) {
    process.env.HOST_DOMAIN = 'localhost';
}
const puppeteer_request_intercepter_1 = require("puppeteer-request-intercepter");
const puppeteerUtils_1 = require("./engine_scripts/puppeteerUtils");
const sharedConfig_1 = require("./sharedConfig");
if (!process.env.AXIOM_SID) {
    throw new Error(`'AXIOM_SID' is not set`);
}
const globalFixtures = [
    // Email "unknown"
    (0, puppeteer_request_intercepter_1.createFixture)('GET', 'https://www.gravatar.com/avatar/ad921d60486366258809553a3db49a4a', '403ffc467d82f55e8b703d49ac7fa9b3.jpeg'),
    // Email "christopher@axiom.co"
    (0, puppeteer_request_intercepter_1.createFixture)('GET', 'https://www.gravatar.com/avatar/0576249ae1b5dbcb6d9ac9cdfdcefb29', '403ffc467d82f55e8b703d49ac7fa9b3.jpeg'),
    // activeOrg.name "Slovak Industries Ltd"
    (0, puppeteer_request_intercepter_1.createFixture)('GET', 'https://www.gravatar.com/avatar/b9dd037047d4c991e29c5cea76e86c93', 'b9dd037047d4c991e29c5cea76e86c93.png'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/messages/instance', 'instance.json'),
    // FIXME: Is the integrations fixture still needed?
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/integrations', 'integrations.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/users', 'users.json'),
];
const dashboardFixtures = [
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/dashboards', 'dashboards.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/synth', 'dashboards.synth.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/synth', 'dashboards.synth.get.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/vfields?dataset=synth', 'dashboards.vfields.json'),
];
const datasetFixtures = [(0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets', 'datasets.json')];
const arnesynthFixtures = [
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/starred', 'analytics.arnesynth.starred.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/vfields', 'analytics.arnesynth.vfields.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/axiom-history/query', 'analytics.arnesynth.history.json'),
];
const explorerFixtures = [
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_stats', 'explorer.stats.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/axiom-history/query', 'explorer.history.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_info', 'explorer.datasets.info.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets', 'explorer.datasets.json'),
];
const alertsNotifiersFixtures = [
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets', 'alerts.datasets.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/monitors', 'alerts.monitors.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/notifiers', 'alerts.notifiers.json'),
];
const integrationsFixtures = [
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/integrations/github/configs', 'integrations.github.configs.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/integrations/github', 'integrations.github.json'),
];
const settingsFixtures = [
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/settings', 'settings.json'),
    (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/orgs/axiom/status', 'status.json'),
];
const settingsReadySelector = [`${(0, puppeteerUtils_1.sel)('settingsHeader')} img`, `${(0, puppeteerUtils_1.sel)('sidebar')} a`];
const alertsReadySelectors = [`${(0, puppeteerUtils_1.sel)('alertsSummary')} > div:nth-child(2) a`];
const analyticsDetailsReadySelectors = [
    `${(0, puppeteerUtils_1.sel)('filterBar')} > .e2e-ready`,
    `${(0, puppeteerUtils_1.sel)('datasetFields')} > div:nth-child(2) a`,
    `${(0, puppeteerUtils_1.sel)('starredSummary')} > div:nth-child(2) a`,
    `${(0, puppeteerUtils_1.sel)('historySummary')} > div:nth-child(2) a`,
    `${(0, puppeteerUtils_1.sel)('statStorageUsed')} .e2e-value`,
    `${(0, puppeteerUtils_1.sel)('statEvents')} .e2e-value`,
    `${(0, puppeteerUtils_1.sel)('statFields')} .e2e-value`,
    `${(0, puppeteerUtils_1.sel)('statLastEvent')} .e2e-value`,
];
const monacoEditorSelectedReadySelectors = ['.monaco-editor .cursors-layer.has-selection'];
const monacoEditorCodeReadySelectors = ['.monaco-editor .view-line .QueryOperator'];
const includedScenarios = [
    {
        ...sharedConfig_1.baseScenario,
        label: 'login',
        url: (0, puppeteerUtils_1.url)('/'),
        readySelectors: [(0, puppeteerUtils_1.sel)('local-login')],
        onBeforeScript: 'onBefore.js',
    },
    // Home is just analytics now.
    // {
    //   ...baseScenario,
    //   label: 'home',
    //   url: url('/'),
    //   fixtures: [...globalFixtures, createFixture('GET', '/api/v1/dashboards', 'dashboards.json')],
    // },
    {
        // Test collapsed nav.
        ...sharedConfig_1.baseScenario,
        label: 'collapsed',
        url: (0, puppeteerUtils_1.url)('/axiom/stream/synth'),
        clickSelector: (0, puppeteerUtils_1.sel)('navWidthToggle'),
        readySelector: (0, puppeteerUtils_1.sel)('logsStream'),
        fixtures: [
            ...globalFixtures,
            ...datasetFixtures,
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/synth', 'stream.synth.json'),
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets'),
        readySelectors: [
            `${(0, puppeteerUtils_1.sel)('datasetsSummary')} > div:nth-child(2) a`,
            `${(0, puppeteerUtils_1.sel)('starredSummary')} > div:nth-child(2) a`,
            `${(0, puppeteerUtils_1.sel)('historySummary')} > div:nth-child(2) a`,
            `${(0, puppeteerUtils_1.sel)('statStorageUsed')} .e2e-value`,
            `${(0, puppeteerUtils_1.sel)('statDatasets')} .e2e-value`,
            `${(0, puppeteerUtils_1.sel)('statEvents')} .e2e-value`,
        ],
        hideSelectors: [`${(0, puppeteerUtils_1.sel)('statLastEvent')} .e2e-value`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_stats', 'analytics.stats.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/starred', 'analytics.starred.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/axiom-history/query', 'analytics.history.json'),
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/synth',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/synth'),
        readySelectors: analyticsDetailsReadySelectors,
        hideSelectors: [`${(0, puppeteerUtils_1.sel)('statLastEvent')} .e2e-value`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_stats', 'analytics.synth.stats.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/starred', 'analytics.synth.starred.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/axiom-history/query', 'analytics.synth.history.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/synth', 'analytics.synth.get.json'),
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/synth/run',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/synth?qid=TQOjIEWUzEumXVEbgc'),
        readySelectors: ['.uplot', `${(0, puppeteerUtils_1.sel)('filterBar')} > .e2e-ready`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/synth/info', 'analytics.synth.run.get.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/synth/query', 'analytics.synth.run.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_history/TQOjIEWUzEumXVEbgc', 'analytics.synth.run.history.json'),
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/arnesynth/run/0',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/arnesynth?qid=qmJTVpDIt12D5xwTaX'),
        readySelectors: ['.uplot', `${(0, puppeteerUtils_1.sel)('filterBar')} > .e2e-ready`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_history/qmJTVpDIt12D5xwTaX', 'analytics.arnesynth.run.history-0.json'),
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/arnesynth/run/1',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/arnesynth?qid=bzOrrDHtO3cUhIlCv5'),
        readySelectors: ['.uplot', `${(0, puppeteerUtils_1.sel)('filterBar')} > .e2e-ready`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_history/bzOrrDHtO3cUhIlCv5', 'analytics.arnesynth.run.history-1.json'),
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/arnesynth/run/2',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/arnesynth?qid=ZtwVd1ScsPcX50twmz'),
        readySelectors: ['.uplot', `${(0, puppeteerUtils_1.sel)('filterBar')} > .e2e-ready`],
        hoverSelectors: ['.u-under'],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.2.post.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_history/ZtwVd1ScsPcX50twmz', 'analytics.arnesynth.run.2.history.get.json'),
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/arnesynth/vfields',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/arnesynth?view=vfields'),
        readySelectors: [...analyticsDetailsReadySelectors, `${(0, puppeteerUtils_1.sel)('virtualFieldsSidebar')}`],
        hideSelectors: [`${(0, puppeteerUtils_1.sel)('statLastEvent')} .e2e-value`],
        fixtures: [...arnesynthFixtures, ...datasetFixtures, ...globalFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/arnesynth/vfields/edit',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/arnesynth?vfield=geo_city'),
        readySelectors: [
            ...analyticsDetailsReadySelectors,
            ...monacoEditorSelectedReadySelectors,
            ...monacoEditorCodeReadySelectors,
            `${(0, puppeteerUtils_1.sel)('virtualFieldEditModal')}`,
            `${(0, puppeteerUtils_1.sel)('virtualFieldPreviewTable')}`,
            `${(0, puppeteerUtils_1.sel)('refreshAction')}.e2e-ready`,
        ],
        hideSelectors: [`${(0, puppeteerUtils_1.sel)('statLastEvent')} .e2e-value`],
        clickSelectors: [`${(0, puppeteerUtils_1.sel)('refreshAction')}`],
        postInteractionWait: 2000,
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/vfields/geo_city', 'analytics.arnesynth.vfields.vfield.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.vfields.edit.json'),
            ...arnesynthFixtures,
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/arnesynth/starred',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/arnesynth?view=starred'),
        readySelectors: [...analyticsDetailsReadySelectors, `${(0, puppeteerUtils_1.sel)('queriesSidebar')}`, `${(0, puppeteerUtils_1.sel)('queries')}`],
        fixtures: [...arnesynthFixtures, ...datasetFixtures, ...globalFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'analytics/arnesynth/history',
        url: (0, puppeteerUtils_1.url)('/axiom/datasets/arnesynth?view=history'),
        readySelectors: [...analyticsDetailsReadySelectors, `${(0, puppeteerUtils_1.sel)('queriesSidebar')}`, `${(0, puppeteerUtils_1.sel)('queries')}`],
        fixtures: [...arnesynthFixtures, ...datasetFixtures, ...globalFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'dashboards',
        url: (0, puppeteerUtils_1.url)('/axiom/dashboards'),
        readySelectors: [`${(0, puppeteerUtils_1.sel)('ownedSummary')} > div:nth-child(2) a`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/dashboards', 'dashboards.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/integrations/dashboards', 'dashboards.integrations.json'),
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'dashboards/QKmtYuGjLdqLdwkShf/empty',
        url: (0, puppeteerUtils_1.url)('/axiom/dashboards/QKmtYuGjLdqLdwkShf'),
        readySelector: (0, puppeteerUtils_1.sel)('addChart'),
        fixtures: [...globalFixtures, ...dashboardFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'dashboards/details',
        url: (0, puppeteerUtils_1.url)('/axiom/dashboards/nGvSr9skxXm1Z2wQn3'),
        readySelector: '.uplot',
        fixtures: [...globalFixtures, ...dashboardFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'dashboards/details/edit',
        url: (0, puppeteerUtils_1.url)('/axiom/dashboards/nGvSr9skxXm1Z2wQn3/edit/e0acca26-59a8-4b05-811d-d9f3ab9fd2a4'),
        hideSelectors: [`${(0, puppeteerUtils_1.sel)('queryResultsTiming')}`],
        readySelectors: ['.sidebar-entered .uplot'],
        fixtures: [...globalFixtures, ...dashboardFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'explorer',
        url: (0, puppeteerUtils_1.url)('/axiom/explorer'),
        readySelectors: [
            ...monacoEditorSelectedReadySelectors,
            '.monaco-editor .view-line .Comment',
            `${(0, puppeteerUtils_1.sel)('datasetsSummary')} > div:nth-child(2) a`,
            `${(0, puppeteerUtils_1.sel)('historySummary')} > div:nth-child(2) a`,
            `${(0, puppeteerUtils_1.sel)('runQuery')}:enabled`,
        ],
        fixtures: [...explorerFixtures, ...globalFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'explorer/run/0',
        // cSpell:disable-next-line
        url: (0, puppeteerUtils_1.url)('/axiom/explorer?qid=wJcvd0yL4vx-qzjdcm'),
        readySelectors: [...monacoEditorCodeReadySelectors, `${(0, puppeteerUtils_1.sel)('runQuery')}:enabled`, '.uplot', '.monaco-editor'],
        hideSelectors: [(0, puppeteerUtils_1.sel)('queryResultsTiming'), (0, puppeteerUtils_1.sel)('lastRun')],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_history', 'explorer.datasets._history.run.0.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/_apl', 'explorer.datasets.apl.run.0.json'),
            ...explorerFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'explorer/relative',
        description: 'Test restoring a query and clicking the re-run with relative times button',
        // cSpell:disable-next-line
        url: (0, puppeteerUtils_1.url)('/axiom/explorer?qid=DLCvAjJCrwG-r2s8uf'),
        readySelectors: [
            ...monacoEditorCodeReadySelectors,
            `${(0, puppeteerUtils_1.sel)('runQuery')}:enabled`,
            '.uplot',
            '.monaco-editor',
            `${(0, puppeteerUtils_1.sel)('reRunRelative')}`,
        ],
        hideSelectors: [(0, puppeteerUtils_1.sel)('queryResultsTiming'), (0, puppeteerUtils_1.sel)('lastRun')],
        clickSelector: `${(0, puppeteerUtils_1.sel)('reRunRelative')}`,
        onReady: async (page) => {
            const readySelectors = [
                ...monacoEditorCodeReadySelectors,
                `${(0, puppeteerUtils_1.sel)('runQuery')}:enabled`,
                '.uplot',
                '.monaco-editor',
            ];
            for (const readySelector of readySelectors) {
                console.log('Waiting for...', readySelector);
                await page.waitFor(readySelector);
            }
        },
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_history', 'explorer.datasets._history.relative.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/_apl', 'explorer.datasets._apl.relative.json'),
            ...explorerFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'explorer/fieldlist/datasets',
        url: (0, puppeteerUtils_1.url)('/axiom/explorer?fieldList=1'),
        readySelectors: ['.monaco-editor .view-line .Comment', `${(0, puppeteerUtils_1.sel)('runQuery')}:enabled`],
        fixtures: [...explorerFixtures, ...globalFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'explorer/fieldlist/fields',
        url: (0, puppeteerUtils_1.url)('/axiom/explorer?fieldList=1&qid=DLCvAjJCrwG-r2s8uf'),
        readySelectors: ['.monaco-editor .view-line .Function', `${(0, puppeteerUtils_1.sel)('runQuery')}:enabled`],
        hideSelectors: [(0, puppeteerUtils_1.sel)('queryResultsTiming'), (0, puppeteerUtils_1.sel)('lastRun')],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_history', 'explorer.datasets._history.relative.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/_apl', 'explorer.datasets._apl.fields.relative.json'),
            ...explorerFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'stream',
        url: (0, puppeteerUtils_1.url)('/axiom/stream'),
        readySelectors: [
            `${(0, puppeteerUtils_1.sel)('datasetsSummary')} > div:nth-child(2) a`,
            `${(0, puppeteerUtils_1.sel)('starredSummary')} > div:nth-child(2) a`,
            `${(0, puppeteerUtils_1.sel)('statStorageUsed')} .e2e-value`,
            `${(0, puppeteerUtils_1.sel)('statDatasets')} .e2e-value`,
            `${(0, puppeteerUtils_1.sel)('statEvents')} .e2e-value`,
        ],
        hideSelectors: [`${(0, puppeteerUtils_1.sel)('statLastEvent')} .e2e-value`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_stats', 'stream.stats.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/starred', 'stream.starred.json'),
            ...datasetFixtures,
            ...globalFixtures,
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'stream/synth',
        url: (0, puppeteerUtils_1.url)('/axiom/stream/synth'),
        readySelector: (0, puppeteerUtils_1.sel)('logsStream'),
        fixtures: [
            ...globalFixtures,
            ...datasetFixtures,
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/synth', 'stream.synth.json'),
        ],
    },
    // {
    //   ...baseScenario,
    //   label: 'integrations',
    //   url: url('/axiom/integrations'),
    //   readySelector: sel('integrationsList'),
    //   fixtures: [...globalFixtures],
    // },
    // {
    //   ...baseScenario,
    //   label: 'integrations/github',
    //   url: url('/integrations/github'),
    //   readySelector: sel('configsList'),
    //   fixtures: [
    //     ...integrationsFixtures,
    //     // Put globalFixtures on the bottom otherwise it will match '/api/v1/integrations'
    //     ...globalFixtures,
    //   ],
    // },
    // {
    //   ...baseScenario,
    //   label: 'integrations/github/87e709e6-4ec1-4074-beca-b9716606161e',
    //   url: url('/integrations/github/87e709e6-4ec1-4074-beca-b9716606161e'),
    //   readySelectors: [sel('configsList'), sel('configForm')],
    //   fixtures: [
    //     ...integrationsFixtures,
    //     // Put globalFixtures on the bottom otherwise it will match '/api/v1/integrations'
    //     ...globalFixtures,
    //   ],
    // },
    {
        ...sharedConfig_1.baseScenario,
        label: 'settings/auth',
        url: (0, puppeteerUtils_1.url)('/axiom/settings/auth'),
        readySelectors: [...settingsReadySelector, `${(0, puppeteerUtils_1.sel)('authSummary')} .e2e-enabled`],
        fixtures: [
            ...globalFixtures,
            ...settingsFixtures,
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/settings/oauth', 'settings.oauth.json'),
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'profile',
        url: (0, puppeteerUtils_1.url)('/axiom/settings/profile'),
        readySelectors: [(0, puppeteerUtils_1.sel)('profileSettings'), `${(0, puppeteerUtils_1.sel)('personalTokensSummary')} > div:nth-child(2) button`],
        fixtures: [
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/_stats', 'analytics.stats.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/starred', 'analytics.starred.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/axiom-history/query', 'analytics.history.json'),
            ...globalFixtures,
            ...datasetFixtures,
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/tokens/personal', 'tokens.personal.json'),
        ],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'settings/datasets',
        url: (0, puppeteerUtils_1.url)('/axiom/settings/datasets'),
        readySelectors: [
            ...settingsReadySelector,
            (0, puppeteerUtils_1.sel)('addDatasetButton'),
            `${(0, puppeteerUtils_1.sel)('datasetsSummary')} > div:nth-child(2) a`,
        ],
        fixtures: [...globalFixtures, ...settingsFixtures, ...datasetFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'settings/status',
        url: (0, puppeteerUtils_1.url)('/axiom/settings/status'),
        readySelectors: [...settingsReadySelector, (0, puppeteerUtils_1.sel)('statusSettingsLicense')],
        // hideSelectors: [`${sel('statusSettingsLicense')} > div:nth-child(4) > div:nth-child(2)`],
        fixtures: [...globalFixtures, ...settingsFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'settings/teams',
        url: (0, puppeteerUtils_1.url)('/axiom/settings/teams'),
        readySelectors: [...settingsReadySelector, `${(0, puppeteerUtils_1.sel)('teamsSummary')} > div:nth-child(2) a`],
        fixtures: [...globalFixtures, ...settingsFixtures, (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/teams', 'settings.teams.json')],
    },
    // Page was removed (for now):
    // {
    //   ...baseScenario,
    //   label: 'settings/updates',
    //   url: url('/axiom/settings/updates'),
    //   readySelectors: [...settingsReadySelector, sel('updatesSettings')],
    //   fixtures: [
    //     ...globalFixtures,
    //     ...settingsFixtures,
    //     createFixture('GET', '/api/v1/admin/upgrade', 'settings.upgrade.json'),
    //     createFixture('GET', '/api/v1/users', 'users.json'),
    //   ],
    // },
    {
        ...sharedConfig_1.baseScenario,
        label: 'settings/users',
        url: (0, puppeteerUtils_1.url)('/axiom/settings/users'),
        readySelectors: [...settingsReadySelector, `${(0, puppeteerUtils_1.sel)('usersSummary')} > div:nth-child(2) img`],
        fixtures: [...globalFixtures, ...settingsFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'alerts',
        url: (0, puppeteerUtils_1.url)('/axiom/alerts'),
        readySelectors: [...alertsReadySelectors],
        fixtures: [...globalFixtures, ...alertsNotifiersFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'notifiers',
        url: (0, puppeteerUtils_1.url)('/axiom/alerts/notifiers'),
        readySelectors: [...alertsReadySelectors, `${(0, puppeteerUtils_1.sel)('notifiersSidebarList')} img[alt="Slack"]`],
        fixtures: [...globalFixtures, ...alertsNotifiersFixtures],
    },
    {
        ...sharedConfig_1.baseScenario,
        label: 'alerts/monitor',
        // cSpell:disable-next-line
        url: (0, puppeteerUtils_1.url)('/axiom/alerts/monitor/0E8LjxaGmlqqrTOtiv'),
        hideSelectors: [`${(0, puppeteerUtils_1.sel)('queryResultsTiming')}`],
        readySelectors: [...alertsReadySelectors, (0, puppeteerUtils_1.sel)('monitorForm'), '.uplot', `${(0, puppeteerUtils_1.sel)('queryForm')}.e2e-ready`],
        fixtures: [
            ...globalFixtures,
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets/k8s-logs/info', 'monitor.k8s-logs.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('POST', '/api/v1/datasets/k8s-logs/query', 'monitor.query.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/datasets', 'alerts.datasets.json'),
            // cSpell:disable-next-line
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/monitors/0E8LjxaGmlqqrTOtiv', 'monitor.monitor.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/monitors', 'alerts.monitors.json'),
            (0, puppeteer_request_intercepter_1.createFixture)('GET', '/api/v1/notifiers', 'alerts.notifiers.json'),
        ],
    },
].filter(sharedConfig_1.includesScenario);
const config = {
    ...sharedConfig_1.baseConfig,
    id: 'dash',
    scenarios: includedScenarios,
};
module.exports = config;
