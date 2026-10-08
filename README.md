# @metasearch/feed-validator

[![npm version](https://img.shields.io/npm/v/%40metasearch%2Ffeed-validator)](https://www.npmjs.com/package/@metasearch/feed-validator)
[![CI](https://github.com/metasearchcomtr/feed-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/metasearchcomtr/feed-validator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Open-source hotel feed validation CLI and Node.js SDK for travel and metasearch integrations.

Validate hotel data against published requirements for **Google Hotel Center**, **Wego Hotels**, and **trivago**, run readiness checks for **Meta** and **Criteo**, or apply platform-independent hotel master-data quality checks.

> This project is independent and is not an official validator or certification tool for Google, Wego, trivago, Meta, or Criteo.

## Install

Use it without installing:

```bash
npx @metasearch/feed-validator validate hotels.csv --target google-hotel-center
```

Or install it in a project:

```bash
npm install @metasearch/feed-validator
```

Requires Node.js 22+.

## Quick start

### Validate a local file

```bash
npx @metasearch/feed-validator validate hotels.csv --target google-hotel-center
```

### Validate a public URL

```bash
npx @metasearch/feed-validator validate https://example.com/hotels.xml --target wego
```

### Validate stdin

```bash
curl -s https://example.com/hotels.csv \
  | npx @metasearch/feed-validator validate - --target trivago
```

### Compare several targets

```bash
npx @metasearch/feed-validator compare hotels.csv \
  --targets google-hotel-center,wego,trivago
```

### Machine-readable output

```bash
npx @metasearch/feed-validator validate hotels.csv \
  --target google-hotel-center \
  --output json
```

### Use it as a CI gate

```bash
npx @metasearch/feed-validator validate hotels.csv \
  --target google-hotel-center \
  --fail-on error
```

Exit codes:

| Code | Meaning |
| ---: | --- |
| `0` | Validation passed at the configured threshold |
| `1` | Validation threshold failed |
| `2` | CLI, input, fetch, or parse error |

## Supported targets

| CLI target | Validator mode | Notes |
| --- | --- | --- |
| `google-hotel-center` | Published-contract validation | Checks documented hotel list/feed requirements implemented by this project |
| `wego` | Published-contract validation | Checks documented Wego hotel feed requirements implemented by this project |
| `trivago` | Published-contract validation | Checks documented trivago hotel-data requirements implemented by this project |
| `meta` | Readiness / mapping pre-check | Not Meta certification |
| `criteo` | Readiness / mapping pre-check | Not Criteo certification |
| `hotel-master-data` | Generic quality check | Platform-independent hotel master-data checks |

Published-contract validation and readiness checks are intentionally kept separate. Undocumented mandatory fields are not invented.

## Supported input formats

The parser supports:

- CSV
- TSV
- JSON
- NDJSON
- XML

Format detection is automatic by default and can be overridden with `--format`.

## CLI options

```text
--target <target>
--targets <a,b,c>
--format auto|csv|tsv|json|xml|ndjson
--output pretty|json
--fail-on error|warning|none
--timeout <ms>
--max-bytes <bytes>
--max-redirects <count>
```

See [docs/cli.md](docs/cli.md) for additional examples.

## Node.js SDK

```ts
import {
  validateFeed,
  normalizeHotelRecords,
  comparePlatformRequirements,
} from "@metasearch/feed-validator";

const result = validateFeed("google_hotel_center", csv);
console.log(result.score, result.issues);
```

For Node-specific input loading:

```ts
import {
  loadFeedInput,
  validateFeed,
} from "@metasearch/feed-validator/node";

const content = await loadFeedInput("https://example.com/hotels.csv");
const result = validateFeed("wego", content);
```

## Security and URL inputs

URL loading supports HTTP/HTTPS with timeout, redirect, and payload-size limits. If you embed URL loading in a multi-tenant or server-side product, apply network-level SSRF protections appropriate to your environment.

Do not post private hotel feeds, credentials, or customer data in public GitHub issues. See [SECURITY.md](SECURITY.md).

## MCP server

Prefer an agent-native interface? The companion remote MCP server is available at:

```text
https://metasearch.com.tr/mcp
```

Repository: [metasearchcomtr/metasearch-mcp](https://github.com/metasearchcomtr/metasearch-mcp)

Registry identity: `tr.com.metasearch/metasearch-mcp`

## Documentation

- [Hotel Feed Validator](https://metasearch.com.tr/en/tools/hotel-feed-validator)
- [Hotel feed requirements comparison](https://metasearch.com.tr/en/compare/hotel-feed-requirements)
- [Validate hotel feeds with MCP](https://metasearch.com.tr/en/resources/validate-hotel-feeds-with-mcp)

## Contributing

Issues and focused pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
