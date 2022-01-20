import { Scenario, Viewport } from 'backstopjs';

import { ExtendedConfig, ExtendedScenario } from './engine_scripts/backstopUtils';

const minimist = require('minimist');

// Process the args, e.g. npm run test -- --include=<scenario label> --include=<other scenario label> --debugWindow=true
const { debugWindow, include, viewport } = minimist(process.argv.slice(2));

if (!process.env.HOST_DOMAIN) {
  throw new Error(`'HOST_DOMAIN' is not set`);
}

const useDebugWindow = debugWindow === 'true';

export const baseScenario: Partial<Scenario> = {
  referenceUrl: '',
  readyEvent: '',
  readySelector: '',
  delay: useDebugWindow ? 3000000 : 0, // Add a huge delay while debugging.
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

export const includesScenario = ({ label }: ExtendedScenario) =>
  !include || (Array.isArray(include) && include.indexOf(label) !== -1) || include === label;

export const viewports: Viewport[] = [
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

export const baseConfig: Omit<ExtendedConfig, 'id' | 'scenarios'> = {
  // Add the ` --net="host"` param for Linux.
  dockerCommandTemplate:
    'docker run -e AXIOM_SID="$AXIOM_SID" --rm -it --net="host" --mount type=bind,source="{cwd}",target=/src dockerman33/backstopjs:5.4.4 {backstopCommand} {args}',
  viewports: viewports,
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'backstop_data/dist/engine_scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report',
  },
  report: ['browser'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
    executablePath: useDebugWindow ? undefined : '/usr/bin/chromium',
  } as any,
  asyncCaptureLimit: 1, // Set to 1 for the sake of tests that render the Monaco editor. (was 3) You can bump up to get a faster run but a few things may fail.
  asyncCompareLimit: 10,
  debug: false,
  debugWindow: useDebugWindow, // Set to `true` to turn off headless and show the browser while debugging. --debugWindow=true
  onBeforeScript: 'onBeforeAuthed.js',
  onReadyScript: 'onReady.js',
};
