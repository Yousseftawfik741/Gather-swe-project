# Frontend Dependency Security Notes

## 1. Project Configuration

- Framework: React
- Build Tool: Create React App (CRA)
- React Scripts: 5.0.1
- React Router DOM: 7.18.6
- Node.js: 22.17.0
- npm: 10.9.2

## 2. Remaining Security Findings

The latest `npm audit` reports 8 high-severity vulnerability findings involving two dependency chains.

These findings are related to transitive dependencies in the existing CRA 5 toolchain.

### 2.1 nth-check

- Severity: High
- Advisory: GHSA-rp65-9cf3-cjxr
- Dependency chain: react-scripts -> @svgr/webpack -> @svgr/plugin-svgo -> svgo -> css-select -> nth-check.
- Cause: Legacy transitive dependencies in the CRA 5 toolchain.
- Status: Unresolved.

### 2.2 webpack-dev-middleware

- Severity: High
- Advisory: GHSA-g84c-rxfj-3j2c
- Dependency chain: react-scripts -> webpack-dev-server -> webpack-dev-middleware.
- Cause: The development-server dependency tree uses an affected middleware version.
- Status: Unresolved.

## 3. Remediation Decision

The team has decided to retain Create React App 5.0.1 for the current React application setup.

The command `npm audit fix --force` was intentionally not used because npm proposed breaking dependency changes, including an invalid react-scripts version.

Several compatible dependency overrides were applied during the investigation to address other findings.

However, the remaining vulnerabilities have not been fully resolved.

A future tooling upgrade or compatible dependency remediation is required.

## 4. Verification Results

The following checks were completed successfully:

- Dependency installation: Passed.
- Homepage test: Passed.
- Production build: Passed.
- Git commit: Created successfully.
- GitHub push: Successful.
- Security documentation: Added to the repository.

### Security Audit

- Latest reported high-severity findings: 8.
- Remaining affected dependency chains: 2.
- Security findings: Unresolved.

Passing tests and production builds do not mean that outstanding security vulnerabilities have been fixed.

## 5. Security Recommendations

- Review and remediate the outstanding vulnerabilities before production deployment.
- Avoid exposing the affected development server to untrusted networks.
- Reassess the CRA 5 dependency tree during a future tooling upgrade.
- Run `npm audit` after dependency changes.
- Do not use forced dependency upgrades without checking compatibility and verifying the application.

## 6. Conclusion

The React application setup is functional, and its homepage test and production build have passed.

The project currently retains Create React App 5.0.1 as agreed by the team.

The remaining 8 high-severity audit findings are documented and require future remediation.

These findings must not be considered fixed or ignored during future development and deployment.