# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure
- CI/CD pipeline with GitHub Actions
- Security scanning with CodeQL and Gitleaks
- Dependabot configuration for automated dependency updates
- Governance files (CODEOWNERS, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md)

### Changed
- Updated GitHub Actions to v5
- Removed `--if-present` from CI scripts
- Added explicit `continue-on-error: false` to security jobs

## [1.0.0] - 2026-10-25

### Added
- Initial release
- Core application features
- Documentation