# CLI reference

## Validate

```bash
metasearch validate <file|url|-> --target <target>
```

Targets:

- `google-hotel-center`
- `wego`
- `trivago`
- `meta`
- `criteo`
- `hotel-master-data`

Options:

- `--format auto|csv|tsv|json|xml|ndjson`
- `--output pretty|json`
- `--fail-on error|warning|none`
- `--timeout <ms>`
- `--max-bytes <bytes>`
- `--max-redirects <count>`

Exit codes:

- `0`: validation threshold passed
- `1`: validation threshold failed
- `2`: CLI, input, fetch, or parse error

## Compare

```bash
metasearch compare hotels.csv --targets google-hotel-center,wego,trivago
```

## URL behavior

URL input accepts only HTTP and HTTPS. Fetching has a configurable timeout, response-size limit, and redirect limit. This is a local developer CLI: private/internal HTTP endpoints are not blocked by default because validating internal feed URLs is a legitimate use case.
