# Integration Testing Setup

This directory contains integration tests for the SiteAware MVP application.

## Structure
- `integration/` - Integration tests for service connections
- `e2e/` - End-to-end tests using Playwright

## Running Tests
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests

## Adding New Tests
1. Create new test files in the appropriate directory
2. Follow the naming convention: `*.integration.test.tsx` for integration tests
3. Use data-testid attributes for component selection
4. Import shared components from `@shared/*` 