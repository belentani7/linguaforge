# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes     |
| < 1.0   | ❌ No      |

## Reporting a Vulnerability

**Do NOT open public issues for security vulnerabilities.**

Email: **security@belentani.es** (ProtonMail)

Please include:
- Description of the issue
- Steps to reproduce
- Impact assessment
- Your PGP key (optional)

## Security Measures

- **Gitleaks** scans every commit for hardcoded secrets
- **Dependabot** auto-updates for vulnerable dependencies
- **Rate limiting** on all API endpoints
- **Zod/Pydantic validation** on all inputs
- **GDPR compliant** — no PII in logs or AI prompts

## Privacy

This project follows **privacy-by-design**:
- No tracking cookies
- No third-party analytics without consent
- Anonymous progress tracking (localStorage, UUID-based)
- Data retention: 30 days maximum for logs

## License

MIT — see [LICENSE](LICENSE)
