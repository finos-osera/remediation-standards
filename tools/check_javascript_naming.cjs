#!/usr/bin/env node
// Limited SemVer experiment; this does not install packages or test registries.
// Use the dependency pinned by website/package-lock.json after npm ci in website.
const {createRequire} = require('node:module');
const path = require('node:path');
const assert = require('node:assert/strict');
const fromWebsite = createRequire(path.resolve(__dirname, '../website/package.json'));
const semver = fromWebsite('semver');
const cases = [
  ['build metadata has equal precedence', () => semver.compare('1.4.1+osera-patch.001', '1.4.1'), 0],
  ['baseline prerelease sorts below baseline', () => semver.lt('1.4.1-osera-00001', '1.4.1'), true],
  ['Java fourth segment is invalid SemVer', () => semver.valid('1.4.1.1-osera-00001'), null],
  ['next-patch prerelease sorts above baseline', () => semver.gt('1.4.2-osera-00001', '1.4.1'), true],
  ['next-patch prerelease sorts below upstream patch', () => semver.lt('1.4.2-osera-00001', '1.4.2'), true],
  ['ordinary tilde excludes backpatch prerelease', () => semver.satisfies('1.4.2-osera-00001', '~1.4.1'), false],
  ['opt-in tilde accepts next backpatch', () => semver.satisfies('1.4.2-osera-00002', '~1.4.2-osera-00001'), true],
  ['opt-in tilde accepts upstream release candidate', () => semver.satisfies('1.4.2-rc.1', '~1.4.2-osera-00001'), true],
  ['opt-in tilde accepts another producer', () => semver.satisfies('1.4.2-zenith-00001', '~1.4.2-osera-00001'), true],
  ['opt-in tilde accepts upstream stable patch', () => semver.satisfies('1.4.2', '~1.4.2-osera-00001'), true],
  ['exact pin excludes subsequent patch', () => semver.satisfies('1.4.2-osera-00002', '1.4.2-osera-00001'), false],
  ['caret can leave the minor line', () => semver.maxSatisfying(['1.4.2-osera-00001', '1.5.0'], '^1.4.2-osera-00001'), '1.5.0'],
  ['padded counter sorts correctly', () => semver.gt('1.4.2-osera-00010', '1.4.2-osera-00009'), true],
  ['unpadded counter sorts incorrectly', () => semver.gt('1.4.2-osera-10', '1.4.2-osera-9'), false],
];
console.log(JSON.stringify({scope:'SemVer only; no registry, install, security-fix or compatibility verification', node:process.version, semver:fromWebsite('semver/package.json').version}, null, 2));
for (const [name, run, expected] of cases) {
  const actual = run();
  assert.deepEqual(actual, expected, name);
  console.log(JSON.stringify({case:name, expected, actual, result:'pass'}));
}
