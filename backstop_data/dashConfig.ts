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

import { Scenario } from 'backstopjs';
import { createFixture, FixtureRoute } from 'puppeteer-request-intercepter';

import { ExtendedConfig, ExtendedScenario } from './engine_scripts/backstopUtils';
import { clickWhenVisible, delay, sel, url, waitForVisible } from './engine_scripts/puppeteerUtils';
import { baseConfig, baseScenario, includesScenario } from './sharedConfig';

if (!process.env.AXIOM_SID) {
  throw new Error(`'AXIOM_SID' is not set`);
}

const globalFixtures: FixtureRoute[] = [
  // Email "unknown"
  createFixture(
    'GET',
    'https://www.gravatar.com/avatar/ad921d60486366258809553a3db49a4a',
    '403ffc467d82f55e8b703d49ac7fa9b3.jpeg'
  ),
  // Email "christopher@axiom.co"
  createFixture(
    'GET',
    'https://www.gravatar.com/avatar/0576249ae1b5dbcb6d9ac9cdfdcefb29',
    '403ffc467d82f55e8b703d49ac7fa9b3.jpeg'
  ),
  // activeOrg.name "Slovak Industries Ltd"
  createFixture(
    'GET',
    'https://www.gravatar.com/avatar/b9dd037047d4c991e29c5cea76e86c93',
    'b9dd037047d4c991e29c5cea76e86c93.png'
  ),
  createFixture('GET', '/api/v1/messages/instance', 'instance.json'),
  // FIXME: Is the integrations fixture still needed?
  createFixture('GET', '/api/v1/integrations', 'integrations.json'),
  createFixture('GET', '/api/v1/users', 'users.json'),
];

const dashboardFixtures: FixtureRoute[] = [
  createFixture('GET', '/api/v1/dashboards', 'dashboards.json'),
  createFixture('POST', '/api/v1/datasets/synth', 'dashboards.synth.json'),
  createFixture('GET', '/api/v1/datasets/synth', 'dashboards.synth.get.json'),
  createFixture('GET', '/api/v1/vfields?dataset=synth', 'dashboards.vfields.json'),
];

const datasetFixtures: FixtureRoute[] = [createFixture('GET', '/api/v1/datasets', 'datasets.json')];

const arnesynthFixtures: FixtureRoute[] = [
  createFixture('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
  createFixture('GET', '/api/v1/starred', 'analytics.arnesynth.starred.json'),
  createFixture('GET', '/api/v1/vfields', 'analytics.arnesynth.vfields.json'),
  createFixture('POST', '/api/v1/datasets/axiom-history/query', 'analytics.arnesynth.history.json'),
];

const explorerFixtures: FixtureRoute[] = [
  createFixture('GET', '/api/v1/datasets/_stats', 'explorer.stats.json'),
  createFixture('POST', '/api/v1/datasets/axiom-history/query', 'explorer.history.json'),
  createFixture('GET', '/api/v1/datasets/_info', 'explorer.datasets.info.json'),
  createFixture('GET', '/api/v1/datasets', 'explorer.datasets.json'),
];

const alertsNotifiersFixtures: FixtureRoute[] = [
  createFixture('GET', '/api/v1/datasets', 'alerts.datasets.json'),
  createFixture('GET', '/api/v1/monitors', 'alerts.monitors.json'),
  createFixture('GET', '/api/v1/notifiers', 'alerts.notifiers.json'),
];

const integrationsFixtures: FixtureRoute[] = [
  createFixture('GET', '/api/v1/integrations/github/configs', 'integrations.github.configs.json'),
  createFixture('GET', '/api/v1/integrations/github', 'integrations.github.json'),
];

const settingsFixtures: FixtureRoute[] = [
  createFixture('GET', '/api/v1/settings', 'settings.json'),
  createFixture('GET', '/api/v1/orgs/axiom/status', 'status.json'),
];

const settingsReadySelector = [`${sel('settingsHeader')} img`, `${sel('sidebar')} a`];

const alertsReadySelectors = [`${sel('alertsSummary')} > div:nth-child(2) a`];

const analyticsDetailsReadySelectors = [
  `${sel('filterBar')} > .e2e-ready`,
  `${sel('datasetFields')} > div:nth-child(2) a`,
  `${sel('starredSummary')} > div:nth-child(2) a`,
  `${sel('historySummary')} > div:nth-child(2) a`,
  `${sel('statStorageUsed')} .e2e-value`,
  `${sel('statEvents')} .e2e-value`,
  `${sel('statFields')} .e2e-value`,
  `${sel('statLastEvent')} .e2e-value`,
];

const monacoEditorSelectedReadySelectors = ['.monaco-editor .cursors-layer.has-selection'];

const monacoEditorCodeReadySelectors = ['.monaco-editor .view-line .QueryOperator'];

const includedScenarios = (
  [
    {
      ...baseScenario,
      label: 'login',
      url: url('/'),
      readySelectors: [sel('local-login')],
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
      ...baseScenario,
      label: 'collapsed',
      url: url('/axiom/stream/synth'),
      clickSelector: sel('navWidthToggle'),
      readySelector: sel('logsStream'),
      fixtures: [
        ...globalFixtures,
        ...datasetFixtures,
        createFixture('POST', '/api/v1/datasets/synth', 'stream.synth.json'),
      ],
    },
    {
      ...baseScenario,
      label: 'analytics',
      url: url('/axiom/datasets'),
      readySelectors: [
        `${sel('datasetsSummary')} > div:nth-child(2) a`,
        `${sel('starredSummary')} > div:nth-child(2) a`,
        `${sel('historySummary')} > div:nth-child(2) a`,
        `${sel('statStorageUsed')} .e2e-value`,
        `${sel('statDatasets')} .e2e-value`,
        `${sel('statEvents')} .e2e-value`,
      ],
      hideSelectors: [`${sel('statLastEvent')} .e2e-value`],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/_stats', 'analytics.stats.json'),
        createFixture('GET', '/api/v1/starred', 'analytics.starred.json'),
        createFixture('POST', '/api/v1/datasets/axiom-history/query', 'analytics.history.json'),
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'analytics/synth',
      url: url('/axiom/datasets/synth'),
      readySelectors: analyticsDetailsReadySelectors,
      hideSelectors: [`${sel('statLastEvent')} .e2e-value`],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/_stats', 'analytics.synth.stats.json'),
        createFixture('GET', '/api/v1/starred', 'analytics.synth.starred.json'),
        createFixture('POST', '/api/v1/datasets/axiom-history/query', 'analytics.synth.history.json'),
        createFixture('GET', '/api/v1/datasets/synth', 'analytics.synth.get.json'),
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'analytics/synth/run',
      url: url('/axiom/datasets/synth?qid=TQOjIEWUzEumXVEbgc'),
      readySelectors: ['.uplot', `${sel('filterBar')} > .e2e-ready`],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/synth/info', 'analytics.synth.run.get.json'),
        createFixture('POST', '/api/v1/datasets/synth/query', 'analytics.synth.run.json'),
        createFixture('GET', '/api/v1/datasets/_history/TQOjIEWUzEumXVEbgc', 'analytics.synth.run.history.json'),
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'analytics/arnesynth/run/0',
      url: url('/axiom/datasets/arnesynth?qid=qmJTVpDIt12D5xwTaX'),
      readySelectors: ['.uplot', `${sel('filterBar')} > .e2e-ready`],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
        createFixture('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.json'),
        createFixture('GET', '/api/v1/datasets/_history/qmJTVpDIt12D5xwTaX', 'analytics.arnesynth.run.history-0.json'),
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'analytics/arnesynth/run/1',
      url: url('/axiom/datasets/arnesynth?qid=bzOrrDHtO3cUhIlCv5'),
      readySelectors: ['.uplot', `${sel('filterBar')} > .e2e-ready`],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
        createFixture('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.json'),
        createFixture('GET', '/api/v1/datasets/_history/bzOrrDHtO3cUhIlCv5', 'analytics.arnesynth.run.history-1.json'),
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'analytics/arnesynth/run/2',
      url: url('/axiom/datasets/arnesynth?qid=ZtwVd1ScsPcX50twmz'),
      readySelectors: ['.uplot', `${sel('filterBar')} > .e2e-ready`],
      hoverSelectors: ['.u-under'],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.get.json'),
        createFixture('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.run.2.post.json'),
        createFixture(
          'GET',
          '/api/v1/datasets/_history/ZtwVd1ScsPcX50twmz',
          'analytics.arnesynth.run.2.history.get.json'
        ),
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'analytics/arnesynth/vfields',
      url: url('/axiom/datasets/arnesynth?view=vfields'),
      readySelectors: [...analyticsDetailsReadySelectors, `${sel('virtualFieldsSidebar')}`],
      hideSelectors: [`${sel('statLastEvent')} .e2e-value`],
      fixtures: [...arnesynthFixtures, ...datasetFixtures, ...globalFixtures],
    },
    {
      ...baseScenario,
      label: 'analytics/arnesynth/vfields/edit',
      url: url('/axiom/datasets/arnesynth?vfield=geo_city'),
      readySelectors: [
        ...analyticsDetailsReadySelectors,
        ...monacoEditorSelectedReadySelectors,
        ...monacoEditorCodeReadySelectors,
        `${sel('virtualFieldEditModal')}`,
        `${sel('virtualFieldPreviewTable')}`,
        `${sel('refreshAction')}.e2e-ready`,
      ],
      hideSelectors: [`${sel('statLastEvent')} .e2e-value`],
      clickSelectors: [`${sel('refreshAction')}`],
      postInteractionWait: 2000,
      fixtures: [
        createFixture('GET', '/api/v1/vfields/geo_city', 'analytics.arnesynth.vfields.vfield.json'),
        createFixture('POST', '/api/v1/datasets/arnesynth', 'analytics.arnesynth.vfields.edit.json'),
        ...arnesynthFixtures,
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'analytics/arnesynth/starred',
      url: url('/axiom/datasets/arnesynth?view=starred'),
      readySelectors: [...analyticsDetailsReadySelectors, `${sel('queriesSidebar')}`, `${sel('queries')}`],
      fixtures: [...arnesynthFixtures, ...datasetFixtures, ...globalFixtures],
    },
    {
      ...baseScenario,
      label: 'analytics/arnesynth/history',
      url: url('/axiom/datasets/arnesynth?view=history'),
      readySelectors: [...analyticsDetailsReadySelectors, `${sel('queriesSidebar')}`, `${sel('queries')}`],
      fixtures: [...arnesynthFixtures, ...datasetFixtures, ...globalFixtures],
    },
    {
      ...baseScenario,
      label: 'dashboards',
      url: url('/axiom/dashboards'),
      readySelectors: [`${sel('ownedSummary')} > div:nth-child(2) a`],
      fixtures: [
        createFixture('GET', '/api/v1/dashboards', 'dashboards.json'),
        createFixture('GET', '/api/v1/integrations/dashboards', 'dashboards.integrations.json'),
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'dashboards/QKmtYuGjLdqLdwkShf/empty',
      url: url('/axiom/dashboards/QKmtYuGjLdqLdwkShf'),
      readySelector: sel('addChart'),
      fixtures: [...globalFixtures, ...dashboardFixtures],
    },
    {
      ...baseScenario,
      label: 'dashboards/details',
      url: url('/axiom/dashboards/nGvSr9skxXm1Z2wQn3'),
      readySelector: '.uplot',
      fixtures: [...globalFixtures, ...dashboardFixtures],
    },
    {
      ...baseScenario,
      label: 'dashboards/details/edit',
      url: url('/axiom/dashboards/nGvSr9skxXm1Z2wQn3/edit/e0acca26-59a8-4b05-811d-d9f3ab9fd2a4'),
      hideSelectors: [`${sel('queryResultsTiming')}`],
      readySelectors: ['.sidebar-entered .uplot'],
      fixtures: [...globalFixtures, ...dashboardFixtures],
    },
    {
      ...baseScenario,
      label: 'explorer',
      url: url('/axiom/explorer'),
      readySelectors: [
        ...monacoEditorSelectedReadySelectors,
        '.monaco-editor .view-line .Comment',
        `${sel('datasetsSummary')} > div:nth-child(2) a`,
        `${sel('historySummary')} > div:nth-child(2) a`,
        `${sel('runQuery')}:enabled`,
      ],
      fixtures: [...explorerFixtures, ...globalFixtures],
    },
    {
      ...baseScenario,
      label: 'explorer/run/0',
      // cSpell:disable-next-line
      url: url('/axiom/explorer?qid=wJcvd0yL4vx-qzjdcm'),
      readySelectors: [...monacoEditorCodeReadySelectors, `${sel('runQuery')}:enabled`, '.uplot', '.monaco-editor'],
      hideSelectors: [sel('queryResultsTiming'), sel('lastRun')],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/_history', 'explorer.datasets._history.run.0.json'),
        createFixture('POST', '/api/v1/datasets/_apl', 'explorer.datasets.apl.run.0.json'),
        ...explorerFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'explorer/relative',
      description: 'Test restoring a query and clicking the re-run with relative times button',
      // cSpell:disable-next-line
      url: url('/axiom/explorer?qid=DLCvAjJCrwG-r2s8uf'),
      readySelectors: [
        ...monacoEditorCodeReadySelectors,
        `${sel('runQuery')}:enabled`,
        '.uplot',
        '.monaco-editor',
        `${sel('reRunRelative')}`,
      ],
      hideSelectors: [sel('queryResultsTiming'), sel('lastRun')],
      clickSelector: `${sel('reRunRelative')}`,
      onReady: async (page) => {
        const readySelectors = [
          ...monacoEditorCodeReadySelectors,
          `${sel('runQuery')}:enabled`,
          '.uplot',
          '.monaco-editor',
        ];

        for (const readySelector of readySelectors) {
          console.log('Waiting for...', readySelector);
          await page.waitFor(readySelector);
        }
      },
      fixtures: [
        createFixture('GET', '/api/v1/datasets/_history', 'explorer.datasets._history.relative.json'),
        createFixture('POST', '/api/v1/datasets/_apl', 'explorer.datasets._apl.relative.json'),
        ...explorerFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'explorer/fieldlist/datasets',
      url: url('/axiom/explorer?fieldList=1'),
      readySelectors: ['.monaco-editor .view-line .Comment', `${sel('runQuery')}:enabled`],
      fixtures: [...explorerFixtures, ...globalFixtures],
    },
    {
      ...baseScenario,
      label: 'explorer/fieldlist/fields',
      url: url('/axiom/explorer?fieldList=1&qid=DLCvAjJCrwG-r2s8uf'),
      readySelectors: ['.monaco-editor .view-line .Function', `${sel('runQuery')}:enabled`],
      hideSelectors: [sel('queryResultsTiming'), sel('lastRun')],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/_history', 'explorer.datasets._history.relative.json'),
        createFixture('POST', '/api/v1/datasets/_apl', 'explorer.datasets._apl.fields.relative.json'),
        ...explorerFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'stream',
      url: url('/axiom/stream'),
      readySelectors: [
        `${sel('datasetsSummary')} > div:nth-child(2) a`,
        `${sel('starredSummary')} > div:nth-child(2) a`,
        `${sel('statStorageUsed')} .e2e-value`,
        `${sel('statDatasets')} .e2e-value`,
        `${sel('statEvents')} .e2e-value`,
      ],
      hideSelectors: [`${sel('statLastEvent')} .e2e-value`],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/_stats', 'stream.stats.json'),
        createFixture('GET', '/api/v1/starred', 'stream.starred.json'),
        ...datasetFixtures,
        ...globalFixtures,
      ],
    },
    {
      ...baseScenario,
      label: 'stream/synth',
      url: url('/axiom/stream/synth'),
      readySelector: sel('logsStream'),
      fixtures: [
        ...globalFixtures,
        ...datasetFixtures,
        createFixture('POST', '/api/v1/datasets/synth', 'stream.synth.json'),
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
      ...baseScenario,
      label: 'settings/auth',
      url: url('/axiom/settings/auth'),
      readySelectors: [...settingsReadySelector, `${sel('authSummary')} .e2e-enabled`],
      fixtures: [
        ...globalFixtures,
        ...settingsFixtures,
        createFixture('GET', '/api/v1/settings/oauth', 'settings.oauth.json'),
      ],
    },
    {
      ...baseScenario,
      label: 'profile',
      url: url('/axiom/settings/profile'),
      readySelectors: [sel('profileSettings'), `${sel('personalTokensSummary')} > div:nth-child(2) button`],
      fixtures: [
        createFixture('GET', '/api/v1/datasets/_stats', 'analytics.stats.json'),
        createFixture('GET', '/api/v1/starred', 'analytics.starred.json'),
        createFixture('POST', '/api/v1/datasets/axiom-history/query', 'analytics.history.json'),
        ...globalFixtures,
        ...datasetFixtures,
        createFixture('GET', '/api/v1/tokens/personal', 'tokens.personal.json'),
      ],
    },
    {
      ...baseScenario,
      label: 'settings/datasets',
      url: url('/axiom/settings/datasets'),
      readySelectors: [
        ...settingsReadySelector,
        sel('addDatasetButton'),
        `${sel('datasetsSummary')} > div:nth-child(2) a`,
      ],
      fixtures: [...globalFixtures, ...settingsFixtures, ...datasetFixtures],
    },
    {
      ...baseScenario,
      label: 'settings/status',
      url: url('/axiom/settings/status'),
      readySelectors: [...settingsReadySelector, sel('statusSettingsLicense')],
      // hideSelectors: [`${sel('statusSettingsLicense')} > div:nth-child(4) > div:nth-child(2)`],
      fixtures: [...globalFixtures, ...settingsFixtures],
    },
    {
      ...baseScenario,
      label: 'settings/teams',
      url: url('/axiom/settings/teams'),
      readySelectors: [...settingsReadySelector, `${sel('teamsSummary')} > div:nth-child(2) a`],
      fixtures: [...globalFixtures, ...settingsFixtures, createFixture('GET', '/api/v1/teams', 'settings.teams.json')],
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
      ...baseScenario,
      label: 'settings/users',
      url: url('/axiom/settings/users'),
      readySelectors: [...settingsReadySelector, `${sel('usersSummary')} > div:nth-child(2) img`],
      fixtures: [...globalFixtures, ...settingsFixtures],
    },
    {
      ...baseScenario,
      label: 'alerts',
      url: url('/axiom/alerts'),
      readySelectors: [...alertsReadySelectors],
      fixtures: [...globalFixtures, ...alertsNotifiersFixtures],
    },
    {
      ...baseScenario,
      label: 'notifiers',
      url: url('/axiom/alerts/notifiers'),
      readySelectors: [...alertsReadySelectors, `${sel('notifiersSidebarList')} img[alt="Slack"]`],
      fixtures: [...globalFixtures, ...alertsNotifiersFixtures],
    },
    {
      ...baseScenario,
      label: 'alerts/monitor',
      // cSpell:disable-next-line
      url: url('/axiom/alerts/monitor/0E8LjxaGmlqqrTOtiv'),
      hideSelectors: [`${sel('queryResultsTiming')}`],
      readySelectors: [...alertsReadySelectors, sel('monitorForm'), '.uplot', `${sel('queryForm')}.e2e-ready`],
      fixtures: [
        ...globalFixtures,
        createFixture('GET', '/api/v1/datasets/k8s-logs/info', 'monitor.k8s-logs.json'),
        createFixture('POST', '/api/v1/datasets/k8s-logs/query', 'monitor.query.json'),
        createFixture('GET', '/api/v1/datasets', 'alerts.datasets.json'),
        // cSpell:disable-next-line
        createFixture('GET', '/api/v1/monitors/0E8LjxaGmlqqrTOtiv', 'monitor.monitor.json'),
        createFixture('GET', '/api/v1/monitors', 'alerts.monitors.json'),
        createFixture('GET', '/api/v1/notifiers', 'alerts.notifiers.json'),
      ],
    },
  ] as ExtendedScenario[]
).filter(includesScenario);

const config: ExtendedConfig = {
  ...baseConfig,
  id: 'dash',
  scenarios: includedScenarios,
};

// Just run last scenario.
// config.scenarios = [config.scenarios[config.scenarios.length - 1]];

// Just run specific scenario.
// config.scenarios = [config.scenarios.find((ss) => ss.label === 'analytics')];

export = config;
