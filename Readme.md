# OSERA Remediation Standards

[![badge-labs](docs/assets/finos-labs-badge.svg)](https://community.finos.org/docs/governance/lifecycle-stages/labs)

# What OSERA Remediation Standards are

This repository contains the vulnerability remediation standards used for FINOS OSERA patch production and consumption. It is intended to help OSERA members, patch providers, and enterprise recipients converge on an open, bank-consumable format before formal ratification. 

The work is inspired by the catalog-oriented approach used by the [FINOS SDLC Controls Framework](https://github.com/finos-labs/SDLC-Controls-Framework), but focuses on OSERA backpatches: fork management, source provenance, release compatibility, OpenVEX and CycloneDX feeds, and the recipient evidence enterprises need to decide what changed and what to test. 

## Status

The OSERA Remediation Standards project was approved by the OSERA Governing Board in August 2026. A draft proposal is available at (https://standards.osera.finos.org).

## Documentation

The standards site lives in [`docs/`](docs/) and is designed for GitHub Pages/Jekyll.

```sh
cd docs
bundle install
bundle exec jekyll serve
```

The site includes:

* a searchable standards catalog;
* numbered draft standards such as `FORK-001`, `SRC-002`, `REL-002`, `FEED-001`, and `EVD-001`;
* examples for patch evidence and recipient guidance;
* governance notes for moving from provisional evaluation content toward a Community Specification.

## Source material

The initial content is aligned with:

* current OSERA community materials at <https://osera.finos.org> and <https://github.com/finos-osera/community>;
* the public OSERA GitHub organization, which had 62 public repositories on July 10, 2026, including 60 public `backpatch-*` repositories;
* a provider-hosted OpenVEX and CycloneDX reference example;
* Jonathan Schneider / Moderne OSERA backpatching work summarized in the July 7, 2026 OSERA update deck;
* the group discussion about publishing patch-provider evidence such as "what changed" and "what surface area should recipients test".

## Governance

This repository follows the Community Specification process. See [`GOVERNANCE.md`](GOVERNANCE.md), [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SCOPE.md`](SCOPE.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and remaining templates in [`governance-documents/`](governance-documents/).

## Getting involved
Join and subscribe to the working group mailing list by emailing [osera-remediations-wg+subscribe@lists.finos.org](mailto:osera-remediations-wg+subscribe@lists.finos.org).

Discussion also happens in the [OSERA Remediation Standards Slack channel](https://app.slack.com/client/T01E7QRQH97/C0BRSPGUYQJ). If you are not already in the FINOS Slack workspace, email [help@finos.org](mailto:help@finos.org).

To become a voting participant, please follow the enrollment process described at [PARTICIPANTS.MD](PARTICIPANTS.MD). To become a maintainer please see [GOVERNANCE.md](GOVERNANCE.md).

## License

This project uses the **Community Specification License 1.0** for its specifications and **Apache License v2** for the underlying source code; you can read more in the [LICENSE](LICENSE) file.
