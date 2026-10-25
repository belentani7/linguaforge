# Contributing to Belentani Flagships

Thank you for considering contributing to the Belentani ecosystem!

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the project's coding standards
4. **Run the quality checks** (`pnpm quality:check` or equivalent)
5. **Commit with conventional commits** (`feat:`, `fix:`, `chore:`, etc.)
6. **Push to your fork** and open a Pull Request

## Pull Request Requirements

- All CI checks must pass (lint, typecheck, test, build)
- At least one approval from @belentani7 required
- No merge conflicts
- Clear description of changes
- Related issue linked if applicable

## Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Typecheck
pnpm typecheck

# Lint
pnpm lint
```

## Coding Standards

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Conventional commits required
- Tests required for new features
- No `--if-present` in CI scripts
- No `|| true` masking failures

## Security

- Never commit secrets or credentials
- Use environment variables for configuration
- Report vulnerabilities via SECURITY.md process