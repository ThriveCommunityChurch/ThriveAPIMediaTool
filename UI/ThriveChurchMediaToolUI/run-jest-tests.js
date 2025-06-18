const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Running Jest tests with simplified configuration...');

try {
  // Run the tests with Jest
  execSync('npm test', {
    stdio: 'inherit'
  });
  
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Error running tests:', error.message);
}
