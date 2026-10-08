# Publishing @metasearch/feed-validator

## First release bootstrap

The package must exist on npm before its Trusted Publisher relationship can be configured.

For the first public release:

1. Build and test the repository.
2. Authenticate locally with an npm account that can publish to the `metasearch` organization.
3. Publish `0.1.0` once:

```bash
npm login
npm publish --access public
```

4. On npmjs.com, open `@metasearch/feed-validator` → Settings → Trusted Publisher.
5. Configure GitHub Actions:
   - organization: `metasearchcomtr`
   - repository: `feed-validator`
   - workflow filename: `publish.yml`
6. Confirm the repository URL in `package.json` is exactly this repository.

After the bootstrap, releases should use GitHub Actions OIDC rather than a long-lived npm write token.

## Subsequent releases

Bump `package.json` version, merge, then tag that exact version:

```bash
git tag v0.1.1
git push origin v0.1.1
```

The `publish.yml` workflow verifies that the tag and package version match before publishing.
