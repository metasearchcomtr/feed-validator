# Example feeds

These files are synthetic examples for documentation, local testing and CI examples. They do not represent a real hotel supplier or platform-certified feed.

## Files

- `hotels.csv` — broad hotel fields that can be used with Google Hotel Center, Wego, trivago and generic hotel master-data checks.
- `hotels.json` — the same synthetic records as JSON for normalization, readiness and SDK examples.

## Run locally

```bash
npx @metasearch/feed-validator validate examples/hotels.csv --target google-hotel-center
npx @metasearch/feed-validator validate examples/hotels.csv --target wego
npx @metasearch/feed-validator validate examples/hotels.csv --target trivago
npx @metasearch/feed-validator compare examples/hotels.csv --targets google-hotel-center,wego,trivago
```

Use the JSON sample for generic normalization or readiness checks:

```bash
npx @metasearch/feed-validator validate examples/hotels.json --target hotel-master-data
npx @metasearch/feed-validator validate examples/hotels.json --target meta
npx @metasearch/feed-validator validate examples/hotels.json --target criteo
```

## GitHub Actions example

```yaml
name: Validate hotel feed

on:
  pull_request:

jobs:
  validate-feed:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
      - run: npx @metasearch/feed-validator validate path/to/hotels.csv --target google-hotel-center --fail-on error
```

For stricter pipelines, use `--fail-on warning`. Use `--output json` when the result needs to be consumed by another CI step.
