# Contributing

Thanks for helping improve `@metasearch/feed-validator`.

## Before opening a change

- Keep published-contract validators tied to documented platform requirements.
- Do not promote heuristics or readiness checks as official certification.
- Include or update tests for behavioral changes.
- Do not commit customer feeds, credentials, tokens, private URLs, or production payloads.

## Development

```bash
npm install
npm run typecheck
npm test
npm pack --dry-run
```

## Pull requests

Prefer small, focused pull requests with:

- a clear problem statement,
- the platform/target affected,
- evidence for new required fields or constraints when applicable,
- tests covering the change.

## Security issues

Do not report sensitive vulnerabilities with secrets or private feed data in a public issue. See [SECURITY.md](SECURITY.md).
