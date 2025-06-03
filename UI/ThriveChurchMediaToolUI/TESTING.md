# Testing Guide for Thrive Church Media Tool UI

This document provides information about the testing setup for the Thrive Church Media Tool UI application.

## Testing Framework

The application uses Jest for unit testing. We've set up a simplified testing configuration that allows running tests without TypeScript compilation issues.

## Test Files

The test files are located alongside the components and services they test, with a `.spec.js` extension. For example:

- `src/app/components/series-item/series-item.component.spec.js`
- `src/app/services/api-service.service.spec.js`

## Running Tests

To run the tests, use one of the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (automatically re-run when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

You can also use the provided script:

```bash
node run-jest-tests.js
```

## Test Structure

Each test file follows a similar structure:

```javascript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Test code here
    expect(true).toBe(true);
  });
});
```

## Components with Tests

The following components have tests:

1. **SeriesItemComponent**
   - Displays a single series item
   - Handles navigation to series details

2. **SeriesListComponent**
   - Displays a list of series
   - Handles loading state

3. **DashboardComponent**
   - Main dashboard view
   - Displays environment information

4. **EditSeriesComponent**
   - Form for editing series details
   - Handles API interactions

5. **ViewSeriesComponent**
   - Displays series details
   - Shows messages in the series

## Services with Tests

The following services have tests:

1. **ApiService**
   - Handles API communication
   - Manages HTTP requests and responses

2. **SeriesDataService**
   - Manages series data state
   - Provides data to components

## Extending Tests

To add more tests:

1. Create a new `.spec.js` file next to the component or service you want to test
2. Follow the existing test structure
3. Run the tests to verify they pass

## Future Improvements

Future improvements to the testing setup could include:

1. Adding more detailed tests with actual component testing
2. Setting up end-to-end tests with Cypress or Playwright
3. Implementing TypeScript-compatible tests
4. Adding snapshot testing for UI components
