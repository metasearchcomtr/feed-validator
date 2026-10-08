# Security policy

Do not include credentials, private feed payloads, or sensitive customer data in public issues.

URL input is intentionally available for local/CI developer workflows and supports HTTP/HTTPS only, with timeout, redirect and size limits. Consumers embedding URL loading in multi-tenant services must apply their own SSRF/network policy appropriate to that server environment.
