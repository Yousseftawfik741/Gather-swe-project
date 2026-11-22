# Frontend Dependency Security Notes

## Project configuration
- Framework: React
- Build tooling: Create React App (CRA)
- React Scripts: 5.0.1
- React Router DOM: 7.18.6

## Remaining security findings

The latest npm audit reports 8 high-severity findings involving two dependency chains:

### 1. nth-check
- Severity: High
- Dependency chain: react-scripts → @svgr/webpack → @svgr/plugin-svgo → svgo → css-select → nth-check.
- Cause: Legacy transitive dependencies in the CRA 5 toolchain.
- Status: Unresolved.

### 2. webpack-dev-middleware
- Severity: High
- Dependency chain: react-scripts → webpack-dev-server → webpack-dev-middleware.
- Cause: The development-server dependency tree uses an affected middleware version.
- Status: Unresolved.

## Remediation decision

The team has decided to retain Create React App 5.0.1 for the current setup.

`npm audit fix --force` was not used because npm proposed breaking dependency changes, including an invalid react-scripts version.

A future tooling upgrade or compatible dependency remediation is required.

## Verification

- Homepage test: Passed.
- Production build: Passed.
- Dependency installation: Verified.
- Security audit: 8 high-severity findings remain.

Passing tests and builds do not indicate that the outstanding security findings have been resolved.

**Note:** These findings should be reviewed before production deployment, particularly before exposing the development server to untrusted networks.