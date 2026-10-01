---
schema-version: 0.1.0
sequence: 232
standard_id: REL-003-JAVASCRIPT
title: JavaScript Patch Version Naming
summary: A JavaScript patched release is a SemVer prerelease of the maintainer's
  next patch version, so npm tooling sorts it above the release it patches and
  below the maintainer's own fix.
extends: REL-003
doc-status: Draft
standard-version: 0.1.0
candidate-pack: OSERA-SP-0.2.0 required
ratified-in: Not ratified
ratified-date: Not ratified
fitness-role: Required JavaScript profile check
type: REL
category: Release Process
applies-to:
- JavaScript package patch providers
- Enterprise JavaScript recipients
- npm registry and dependency tooling
requirements:
- id: REL-003-JAVASCRIPT.REQ-001
  override-explanation: Specializes the generic applicable-profile rule with the npm form. The default `+osera-patch.NNN` build metadata is excluded from precedence under SemVer and cannot be selected on npm, so the profile uses a prerelease of the next patch version instead; the parent obligations to identify the latest applicable remediation on the same upstream line and preserve baseline and OSERA identity remain.
  level: MUST
  text: Official OSERA JavaScript patched releases must be published under the
    upstream package name at a version of the form
    `<MAJOR>.<MINOR>.<PATCH+1>-osera-<NNNNN>`, a SemVer prerelease of the
    version after the upstream baseline, where upstream has not released
    `<MAJOR>.<MINOR>.<PATCH+1>`.
  checkability: automated
  checks:
  - id: REL-003-JAVASCRIPT.CHECK-001
    override-explanation: Replaces generic profile-selection evidence with the npm pattern and resolver evidence. The parent consumer outcome remains the acceptance criterion; the form is the one described below.
    title: npm patch version is a prerelease of the baseline's next patch and orders between the baseline and that patch
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_javascript.version_pattern
    evidence:
    - release_tag
    - artifact_version
    - baseline_version
    - resolver_test_result
  - id: REL-003-JAVASCRIPT.CHECK-003
    title: Upstream has not released the version the backpatch precedes, and the backpatch is not tagged latest
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_javascript.upstream_headroom
    evidence:
    - artifact_version
    - upstream_versions
    - dist_tags
- id: REL-003-JAVASCRIPT.REQ-002
  override-explanation: Specializes the parent identifier-consistency obligation for npm packages by including npm package URLs. The same patched-release identity must still connect source tags, artifacts, feeds, and evidence.
  level: MUST
  text: JavaScript release tags, package versions, npm package URLs,
    vulnerability feeds, and release evidence must carry the same patched
    version identifier.
  checkability: automated
  checks:
  - id: REL-003-JAVASCRIPT.CHECK-002
    override-explanation: Uses npm package URL evidence for the parent consistency check while retaining release-tag, artifact-version, and feed identity matching.
    title: JavaScript release identifier is consistent across source, package, and feeds
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_javascript.identifier_consistency
    evidence:
    - release_tag
    - artifact_version
    - npm_purl
    - feed_purl
- id: REL-003-JAVASCRIPT.REQ-003
  level: MUST
  text: Each backpatch on a baseline must carry every fix of the backpatches
    published before it on that baseline.
  checkability: automated
  checks:
  - id: REL-003-JAVASCRIPT.CHECK-004
    title: A backpatch closes every vulnerability its predecessors on the same baseline closed
    type: release
    severity: blocking
    implementation: osera-fitness.rel003_javascript.cumulative
    evidence:
    - artifact_version
    - previous_backpatch_versions
    - vulnerability_statements
---

## Requirement

REL-003-JAVASCRIPT extends [REL-003]({{ site.baseurl }}/standards/rel-003-version-metadata/) for packages published to npm registries and installed by npm, pnpm and Yarn.

A JavaScript patched release MUST keep the upstream package name and MUST be versioned as a prerelease of the version after the baseline:

```text
<MAJOR>.<MINOR>.<PATCH+1>-osera-<NNNNN>
```

A patch to `1.4.1` is `1.4.2-osera-00001`. `NNNNN` is five digits, zero-padded, starting at `00001` for each baseline and rising by one with each release on it. Upstream MUST NOT have released `<MAJOR>.<MINOR>.<PATCH+1>` when the backpatch is published; if upstream has released `1.4.2`, the baseline is `1.4.2` and its backpatch is `1.4.3-osera-00001`. A backpatch MUST NOT be tagged `latest`. `latest` is what `npm install <name>` installs when no range is given, and it belongs to the maintainer's newest release.

A later backpatch on a baseline MUST carry every fix of the earlier ones. `1.4.2-osera-00002` contains the fix in `1.4.2-osera-00001` and one more, because the constraint this standard tells remediators to write moves a consumer from `00001` to `00002` without anyone reviewing the step.

Release tags, package versions, npm package URLs, vulnerability feeds and release evidence MUST identify the same patched release.

`REL-003-JAVASCRIPT.REQ-001` and `REL-003-JAVASCRIPT.CHECK-001` specialize the base naming rule. `REL-003-JAVASCRIPT.REQ-002` and `REL-003-JAVASCRIPT.CHECK-002` specialize the consistency rule with npm package URL evidence. `REL-003-JAVASCRIPT.CHECK-003`, `REL-003-JAVASCRIPT.REQ-003` and `REL-003-JAVASCRIPT.CHECK-004` have no counterpart in REL-003.

## Why the next patch

npm, pnpm and Yarn resolve versions through `node-semver`, which implements [SemVer 2.0.0](https://semver.org/) precedence exactly. REL-003-JAVA can add a fourth numeric segment because no JVM build tool implements SemVer; `1.4.1.1-osera-00001` is not a SemVer version, and npm will not publish it. SemVer allows exactly three numeric segments, so the OSERA marker has to go in the prerelease.

SemVer gives a prerelease lower precedence than the release it is attached to. Attached to `1.4.1`, a backpatch would sort below the version it patches. Attached to `1.4.2`, it sorts between the baseline and the maintainer's next patch:

```text
1.4.1                the baseline, vulnerable
1.4.2-osera-00001    the first backpatch
1.4.2-osera-00002    a second, carrying the first fix and another
1.4.2                the maintainer's own patch, which supersedes both
```

When the maintainer releases `1.4.2`, it outranks every backpatch on `1.4.1`, and a consumer whose constraint admits it moves onto the maintainer's release without the producer doing anything.

The counter is padded because a hyphen does not separate prerelease identifiers; only a dot does. `osera-00001` is one alphanumeric identifier, compared with its neighbours as an ASCII string, so an unpadded `osera-10` would sort below `osera-9`. Five digits match REL-003-JAVA.

### Consistent release identity

```text
Upstream version:  1.4.1
Source branch:     patch/1.4.x
Baseline tag:      v1.4.1+patch.baseline
Release tag:       v1.4.2-osera-00001
Package version:   1.4.2-osera-00001
npm purl:          pkg:npm/acme-logger@1.4.2-osera-00001
Scoped npm purl:   pkg:npm/%40acme/logger@1.4.2-osera-00001
```

The `v` prefix identifies the source tag; the package version and purl carry the release identifier without it. A scoped package's `@` is encoded as `%40` in the purl namespace, as the [purl specification](https://github.com/package-url/purl-spec) requires. Feed entries under [FEED-001]({{ site.baseurl }}/standards/feed-001-openvex-cyclonedx/) use the exact published purl.

Source branch naming follows [FORK-002]({{ site.baseurl }}/standards/fork-002-patch-branches/), and baseline tags follow [FORK-003]({{ site.baseurl }}/standards/fork-003-baseline-tags/). A baseline tag keeps the patched version, `v1.4.1+patch.baseline`, while the release tag carries the next one.

## What npm selectors do

`node-semver` adds one rule to SemVer precedence: a range does not match a prerelease unless the range itself names a prerelease at the same `MAJOR.MINOR.PATCH`. `~1.4.1` does not name one, so `1.4.2-osera-00001` is invisible to it, although it lies inside the range numerically. A consumer therefore reaches a backpatch only through a range that names one, and no range written before the backpatch existed does. The table below is a fresh install of `acme-logger`. Backpatches exist because the maintainer has moved on, so the registry also holds the maintainer's later releases:

```text
1.4.0   1.4.1   1.4.2-osera-00001   1.5.0   2.0.0        latest = 2.0.0
```

The table is npm's; pnpm and Yarn Berry gave the same answer on the four rows checked against them. A lockfile keeps the version it last recorded; the table is what a range selects when it is resolved.

| Declared | Resolves to | Reaches the backpatch | A remediator should |
| --- | --- | --- | --- |
| `~1.4.1` | `1.4.1` | No | Rewrite to `~1.4.2-osera-00001`. |
| `1.4.x` | `1.4.1` | No | Rewrite to `~1.4.2-osera-00001`. |
| `1.4.1` | `1.4.1` | No | Rewrite to `~1.4.2-osera-00001`, or to `1.4.2-osera-00001` where the consumer pins exact versions by policy. |
| `^1.4.1` | `1.5.0` | No | Leave it. The range already resolves past `1.4.x`. |
| `^1.4.1-0` | `1.5.0` | No | Leave it, as for `^1.4.1`. |
| `^1.4.2-0` | `1.5.0` | No | Leave it, as for `^1.4.1`. |
| `>=1.4.1 <2.0.0` | `1.5.0` | No | Leave it, as for `^1.4.1`. |
| `1.4.1 - 1.5.0` | `1.5.0` | No | Leave it, as for `^1.4.1`. |
| `1.x` | `1.5.0` | No | Leave it, as for `^1.4.1`. |
| `>=1.4.1` | `2.0.0` | No | Leave it. The range has left the major version. |
| `*` | `2.0.0` | No | Leave it, as for `>=1.4.1`. |
| no range | `2.0.0` | No | Leave it, as for `>=1.4.1`. |
| `~1.4.2-0` | `1.4.2-osera-00001` | Yes | Leave it. |
| `~1.4.2-osera-00001` | `1.4.2-osera-00001` | Yes | Leave it. This is the form remediators write. |
| `1.4.2-osera-00001` | `1.4.2-osera-00001` | Yes | Rewrite to `~1.4.2-osera-00001` unless the consumer pins exact versions by policy. |

Twelve of fifteen ranges miss the backpatch, and they miss it two ways. `~1.4.1`, `1.4.x` and `1.4.1` resolve to `1.4.1`, the vulnerable version. These consumers cannot upgrade past `1.4.x`, which is why a backpatch exists, and none of them reaches it without a rewrite. The other nine move the consumer to `1.5.0` or `2.0.0`. A consumer who can accept that upgrade does not need a `1.4.1` backpatch; if the release they reach is itself vulnerable, they need a backpatch of that release instead.

A backpatch on npm therefore reaches no consumer until a remediator rewrites a declaration, where on the JVM a dynamic version can pick one up unaided.

## What remediators should do

Remediation tooling that moves a consumer onto an OSERA backpatch SHOULD write `~<MAJOR>.<MINOR>.<PATCH+1>-osera-<NNNNN>`, naming the newest backpatch on the baseline. The tilde is chosen over the other two candidates by what each does as the registry fills up:

| The registry also holds | `~1.4.2-osera-00001` | `1.4.2-osera-00001` | `^1.4.2-osera-00001` |
| --- | --- | --- | --- |
| nothing more | the backpatch | the backpatch | `1.5.0` |
| a second backpatch, `1.4.2-osera-00002` | `1.4.2-osera-00002` | `1.4.2-osera-00001` | `1.5.0` |
| the maintainer's `1.4.2` | `1.4.2` | `1.4.2-osera-00001` | `1.5.0` |
| the maintainer's `1.4.2` and `1.4.3` | `1.4.3` | `1.4.2-osera-00001` | `1.5.0` |
| the maintainer's prerelease `1.4.2-rc.1` | `1.4.2-rc.1` | `1.4.2-osera-00001` | `1.5.0` |
| another producer's `1.4.2-zenith-00001` | `1.4.2-zenith-00001` | `1.4.2-osera-00001` | `1.5.0` |

The caret resolves to `1.5.0` in the first row, an upgrade a consumer who has to stay on `1.4.x` cannot take. The exact pin stays where it was put, including after the maintainer ships `1.4.2`, so the consumer keeps a producer's build of a package that upstream has since fixed until another remediation run moves them. The tilde takes the next backpatch with no tool involved and hands the consumer back to the maintainer when the maintainer releases, so a remediator is needed once, to write the first tilde.

The last two rows are the tilde's cost. It admits every prerelease of `1.4.2`, so it takes the maintainer's release candidate, which a consumer asking for a security fix did not ask to test, and it takes another producer's backpatch of the same release when that producer's token sorts after `osera`. Naming `osera` in the constraint does not exclude other producers, because every `1.4.2` prerelease that sorts higher also satisfies it. The exact pin avoids both and gives up the three rows above them; no npm constraint follows the maintainer's releases and excludes other producers at once.

In practice the cost is bounded by where backpatches are published. A producer cannot publish `acme-logger@1.4.2-osera-00001` to npmjs without owning `acme-logger`, so a backpatch reaches a consumer only through a registry the consumer configured, typically a repository manager that overlays npmjs with a producer's versions. Two producers' backpatches of one release meet only where one registry carries both. Recipients SHOULD NOT overlay two producers' backpatches for the same package unless they accept that the tilde selects between them by name.

### Lockfiles

A remediator SHOULD update the lockfile in the same change as the manifest. A manifest and a lockfile that disagree fail `npm ci`, and a change that does not install is not a remediation.

### Catalogs

pnpm (`pnpm-workspace.yaml`) and Yarn (`.yarnrc.yml`) let a manifest say `catalog:` and keep the version in a catalog. Where the version is in a catalog, default or named, a remediator SHOULD edit the catalog entry. Replacing `catalog:` in one manifest with a literal version takes that package out of the catalog: it fixes one workspace member and leaves the others on the vulnerable version, with nothing left keeping them in step.

### Transitive dependencies

When no declaration names the vulnerable package, a remediator SHOULD pin it with the package manager's override key, set to the same tilde constraint, and update the lockfile so it records the backpatch. Each manager honours its key for a package the consumer never declared:

| Package manager | Key | Installs the backpatch |
| --- | --- | --- |
| npm | `overrides` | Yes |
| pnpm | `pnpm.overrides` | Yes |
| Yarn Berry | `resolutions` | Yes |
| Yarn Classic | `resolutions`, keyed by plain name | Yes |
| Yarn Classic | `resolutions`, keyed by `**/name` | Yes |
| Yarn Classic | `resolutions`, keyed by `name@range` | No |

Yarn Classic splits a `name@range` key at the `@` and looks for a package named after the range, so a remediator writing `resolutions` for Yarn Classic SHOULD key by plain name.

### Update tooling

Dependency-update tooling commonly drops prereleases unless the current version is already a prerelease at the same `MAJOR.MINOR.PATCH`. A consumer on `~1.4.1` is then offered `1.5.0` or `2.0.0`, both upgrades out of `1.4.x`, and never the backpatch. Recipients SHOULD configure update tooling for a backpatched package to accept versions containing `-osera-` and to stay below the next minor version, and SHOULD NOT rely on unconfigured update tooling to start a consumer on a backpatch. Once a remediator has written the tilde, the same tooling can move the consumer to later backpatches.

### Minimum publish age

Some package managers refuse to install a version the registry dates within a recent window. Yarn Berry 4.18, through `npmMinimalAgeGate`, defaults to 1440 minutes. Under that default a backpatch less than a day old does not install, and a range such as `~1.4.1` that the maintainer's new `1.4.2` would satisfy installs `1.4.1` instead and reports success. The gate reads a date and does not distinguish a backpatch from the maintainer's release, so it delays the maintainer's security releases by the same day, and no version form a producer chooses can shorten it.

## Evidence

`REL-003-JAVASCRIPT.CHECK-001` reads the release. The version parses as SemVer, its `MAJOR.MINOR.PATCH` is the baseline with the patch number raised by one, its prerelease is the single identifier `osera-` followed by five digits, and `node-semver` orders it above the baseline and below `<MAJOR>.<MINOR>.<PATCH+1>`. The resolver test installs it with `~<version>` and records the version installed.

`REL-003-JAVASCRIPT.CHECK-002` reads the release tag, the published package version, its npm purl and the feed's purl, and requires the same identifier in all four.

`REL-003-JAVASCRIPT.CHECK-003` reads the upstream package's registry metadata at publication. Upstream has no release at `<MAJOR>.<MINOR>.<PATCH+1>`, and `latest` does not name the backpatch.

`REL-003-JAVASCRIPT.CHECK-004` reads the feed. The new backpatch is recorded as fixing every vulnerability that any earlier backpatch on the same baseline is recorded as fixing.

The resolver behaviour and remediator outcomes in this standard were measured against npm 11.4, pnpm 9.15, Yarn Berry 4.18 and Yarn Classic 1.22 in an OSERA versioning study, which installs from a mock registry overlaying npmjs and reads the result from `node_modules`. The working group SHOULD rerun it when a package manager release changes prerelease matching, override handling or publish-age defaults.

## Alternatives considered

### Build metadata

REL-003's default form, `1.4.1+osera-patch.001`, puts the producer in SemVer build metadata. SemVer excludes build metadata from precedence, so npm treats `1.4.1+osera-patch.001` and `1.4.1` as one version. A consumer who asks for `1.4.1+osera-patch.001` exactly is given the maintainer's `1.4.1`, without the fix, and npm reports success. No constraint reaches the backpatch, so no remediator can help.

### A prerelease of the baseline

`1.4.1-osera-00001` keeps the baseline's number visible, and sorts below `1.4.1`. Every range that admits it admits `1.4.1` first, so a consumer who already has `1.4.1` is never moved.

### A fourth segment

REL-003-JAVA's `1.4.1.1-osera-00001` is not SemVer, and npm refuses to publish it.

### A scoped name

A producer could publish under a scope it controls, as `@osera/acme-logger`. That reaches consumers, but it changes the package's identity rather than its version: every declaration, lockfile entry and transitive reference to `acme-logger` has to be redirected, and a feed entry for `pkg:npm/acme-logger` no longer describes what is installed. Yarn's `npm:` aliases redirect a name to another package and carry the same objection. REQ-001 keeps the upstream name.
