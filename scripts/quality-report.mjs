#!/usr/bin/env node
/**
 * Writes content/quality-report.json from REAL measurements only:
 *   - Lighthouse: runs `lhci autorun` against the production build (mobile, simulated slow 4G),
 *     takes the median of the runs per page, then the LOWEST score across pages.
 *   - Test counts: runs Vitest and Playwright with JSON reporters and counts passed tests.
 * If anything fails, nothing is written, so the public page can never show invented numbers.
 *
 * Usage: npm run build && npm run quality:report
 * Flags: --skip-lighthouse  --skip-tests   (keep the existing value for that part)
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'content', 'quality-report.json');
const args = new Set(process.argv.slice(2));

const run = (command, options = {}) =>
  spawnSync(command, {
    shell: true,
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    ...options,
  });

const fail = (message) => {
  console.error(`\nquality-report: ${message}\nNothing was written.`);
  process.exit(1);
};

const previous = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const report = { ...previous };

// ---------------------------------------------------------------- Lighthouse
if (!args.has('--skip-lighthouse')) {
  console.log('Running Lighthouse CI (this takes a few minutes)…');
  fs.rmSync(path.join(root, '.lighthouseci'), { recursive: true, force: true });

  const env = { ...process.env };
  if (!env.CHROME_PATH) {
    const chrome = run(
      'node -e "console.log(require(\'@playwright/test\').chromium.executablePath())"',
    );
    if (chrome.status === 0) env.CHROME_PATH = chrome.stdout.trim();
  }
  const lhci = run('npx lhci autorun', { env, stdio: ['ignore', 'inherit', 'inherit'] });
  // Warnings (e.g. the LCP target) exit 0; only failed error-level assertions fail here.
  if (lhci.status !== 0) fail('Lighthouse CI assertions failed.');

  const dir = path.join(root, '.lighthouseci');
  const runs = fs
    .readdirSync(dir)
    .filter((file) => /^lhr-.*\.json$/.test(file))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
  if (runs.length === 0) fail('No Lighthouse reports found.');

  const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const byUrl = new Map();
  for (const lhr of runs)
    byUrl.set(lhr.finalDisplayedUrl, [...(byUrl.get(lhr.finalDisplayedUrl) ?? []), lhr]);

  const categories = {
    performance: 'performance',
    accessibility: 'accessibility',
    bestPractices: 'best-practices',
    seo: 'seo',
  };
  report.lighthouse = Object.fromEntries(
    Object.entries(categories).map(([key, id]) => [
      key,
      Math.min(
        ...[...byUrl.values()].map((pageRuns) =>
          median(pageRuns.map((lhr) => Math.round(lhr.categories[id].score * 100))),
        ),
      ),
    ]),
  );
  console.log('Lighthouse (lowest page median):', report.lighthouse);
}

// --------------------------------------------------------------------- Tests
if (!args.has('--skip-tests')) {
  // Both runners write their JSON to a file (stdout is not reliable across versions).
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'quality-report-'));
  const readJson = (file, what) => {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return fail(`Could not read ${what} results.`);
    }
  };

  console.log('Running unit tests…');
  const unitFile = path.join(tmp, 'vitest.json');
  const unit = run(`npx vitest run --reporter=json --outputFile="${unitFile}"`);
  const unitStats = readJson(unitFile, 'Vitest');
  if (unit.status !== 0 || unitStats.numFailedTests > 0) fail('Unit tests failed.');
  report.unitTests = unitStats.numPassedTests;

  console.log('Running e2e tests…');
  const e2eFile = path.join(tmp, 'playwright.json');
  const e2e = run('npx playwright test --reporter=json', {
    env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: e2eFile },
  });
  const e2eStats = readJson(e2eFile, 'Playwright').stats;
  if (e2e.status !== 0 || e2eStats.unexpected > 0 || e2eStats.flaky > 0) {
    fail('E2E tests failed or were flaky.');
  }
  report.e2eTests = e2eStats.expected;
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ------------------------------------------------------------------- Output
const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
report.runUrl =
  GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
    ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
    : previous.runUrl;
report.generatedAt = new Date().toISOString();

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`\nWrote ${path.relative(root, reportPath)}:`, report);
