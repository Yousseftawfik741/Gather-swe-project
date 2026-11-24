# Frontend Dependency Security Notes

## 1. Project Configuration

- Framework: React
- Build Tool: Create React App (CRA)
- React Scripts: 5.0.1
- React: 19.3.1
- React DOM: 19.3.1
- React Router DOM: 7.18.6
- Node.js: 22.17.0
- npm: 10.9.2

## 2. Historical Security Findings

During the initial dependency security investigation, `npm audit` reported 8 high-severity vulnerability findings involving two transitive dependency chains in the CRA 5 toolchain.

The findings included:

### 2.1 nth-check

- Severity: High
- Advisory: GHSA-rp65-9cf3-cjxr
- Dependency chain: react-scripts → @svgr/webpack → @svgr/plugin-svgo → svgo → css-select → nth-check.
- Cause: An affected transitive dependency in the existing CRA dependency tree.
- Historical status: Reported during the initial security investigation.

### 2.2 webpack-dev-middleware

- Severity: High
- Advisory: GHSA-g84c-rxfj-3j2c
- Dependency chain: react-scripts → webpack-dev-server → webpack-dev-middleware.
- Cause: An affected development-server dependency version.
- Historical status: Reported during the initial security investigation.

These findings were investigated as part of the dependency security remediation process.

## 3. Security Remediation and Compatibility Decisions

The team decided to retain Create React App 5.0.1 for the current application setup.

The following dependency overrides are configured in `package.json`:

- underscore: 1.13.8
- resolve-url-loader: 5.0.0
- @tootallnate/once: 2.0.1
- serialize-javascript: 7.1.4
- uuid: 11.1.1
- @svgr/webpack: 6.5.1
- webpack-dev-server: 5.2.7

The command `npm audit fix --force` was intentionally avoided because it proposed potentially breaking dependency changes, including an invalid react-scripts version.

### 3.1 CRA Compatibility Patch

A compatibility patch is maintained at:

`patches/react-scripts+5.0.1.patch`

It modifies two CRA files:

- `webpackDevServer.config.js`: Updates the development-server configuration to use the newer middleware setup API while preserving CRA middleware functionality.
- `scripts/start.js`: Improves development-server shutdown handling.

The patch is applied automatically through `patch-package` during installation.

This patch addresses development-server compatibility and lifecycle handling. It should not be considered a direct security vulnerability remediation.

### 3.2 Tailwind YAML Lockfile Correction

A missing optional peer dependency entry for `yaml@2.9.1` was identified during clean installation verification.

The correction was added under:

`node_modules/tailwindcss/node_modules/yaml`

The correction was committed and pushed in:

`93cf367` — fix(frontend): add missing Tailwind YAML peer dependency

This resolved the lockfile synchronization issue and allowed clean installation to succeed.

## 4. Current Security Status

Following the dependency corrections and lockfile synchronization, the latest local security audit completed successfully.

**Latest verified result:**

`npm audit` — 0 vulnerabilities.

The historical vulnerability findings are retained in this document for traceability. They are not current findings in the latest verified audit.

The current audit result applies to the verified dependency state and environment documented below.

## 5. Verification Environment

The final verification was performed using:

- Node.js: 22.17.0
- npm: 10.9.2
- React Scripts: 5.0.1
- Branch: `chore/react-setup`
- Verified commit: `93cf367`

## 6. Verification Results

The following checks were successfully completed against the corrected shared branch.

| Verification | Result |
|---|---|
| `npm ci` | Passed |
| CRA compatibility patch application | Passed |
| `npm ls` | Passed |
| `npm audit` | 0 vulnerabilities |
| `npm test -- --watchAll=false` | 1 test passed |
| `npm run build` | Compiled successfully |
| Git working tree | Clean |

The clean installation installed 1,336 packages and audited 1,337 packages.

The homepage test passed:

- Test Suites: 1 passed, 1 total.
- Tests: 1 passed, 1 total.

The optimized production build completed successfully.

### 6.1 Dependency Deprecation Warnings

During clean installation, npm displayed several dependency deprecation warnings.

These warnings indicate that certain packages or versions are deprecated or no longer maintained.

They did not prevent installation, testing, or production compilation.

They are distinct from the vulnerability count reported by `npm audit` and should be considered during future dependency maintenance.

## 7. Security Recommendations

- Continue running `npm audit` after dependency changes.
- Keep dependency overrides documented and review their compatibility.
- Avoid forced dependency upgrades without checking compatibility.
- Preserve the CRA compatibility patch until the development-server configuration is migrated or replaced.
- Reassess the CRA 5 toolchain during a future tooling upgrade.
- Review deprecated dependencies and plan compatible upgrades.
- Re-run clean installation, dependency checks, tests, and production builds after significant dependency changes.

## 8. Conclusion

The Gather frontend React application setup is functional and has successfully passed clean installation, dependency consistency, security audit, homepage testing, and production build verification.

Create React App 5.0.1 has been retained as agreed by the team, with the required compatibility patch preserved.

The historical security findings have been documented, and the latest verified dependency audit reports zero vulnerabilities.

The corrected dependency lockfile and installation process were independently verified on the shared `chore/react-setup` branch.

This documentation reflects the verified dependency state at commit `93cf367` and provides a record of the security investigation, remediation decisions, and verification results.