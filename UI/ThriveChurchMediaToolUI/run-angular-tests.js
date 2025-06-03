const { execSync } = require('child_process');
const path = require('path');

console.log('Running Angular tests with Karma...');

try {
  // Run the tests with Karma
  execSync('npm run test:karma -- --watch=false --browsers=ChromeHeadless', {
    stdio: 'inherit'
  });
  
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Error running tests:', error.message);
  console.log('\nTry running the tests with the Angular CLI directly:');
  console.log('ng test --watch=false --browsers=ChromeHeadless');
}
