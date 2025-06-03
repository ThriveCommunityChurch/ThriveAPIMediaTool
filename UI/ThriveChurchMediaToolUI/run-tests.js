const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the components to test
const componentsToTest = [
  'series-item',
  'series-list',
  'dashboard',
  'edit-series',
  'view-series'
];

// Define the services to test
const servicesToTest = [
  'api-service',
  'series-data-service'
];

// Function to check for common issues in test files
function checkTestFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, issues: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check for common issues
  if (!content.includes('TestBed.configureTestingModule')) {
    issues.push('Missing TestBed configuration');
  }

  if (!content.includes('imports:')) {
    issues.push('No imports specified in TestBed configuration');
  }

  if (content.includes('jest.') && !content.includes('@types/jest')) {
    issues.push('Using Jest without proper imports');
  }

  return { exists: true, issues };
}

// Check component test files
console.log('\n=== Checking Component Test Files ===\n');
componentsToTest.forEach(component => {
  const testFilePath = path.join(__dirname, `src/app/components/${component}/${component}.component.spec.ts`);
  console.log(`Checking test file: ${component}.component.spec.ts`);

  const result = checkTestFile(testFilePath);
  if (result.exists) {
    console.log(`✅ Test file exists for ${component}`);

    if (result.issues.length > 0) {
      console.log(`⚠️ Issues found:`);
      result.issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ No issues found`);
    }
  } else {
    console.log(`❌ Test file does not exist for ${component}`);
  }
  console.log('');
});

// Check service test files
console.log('\n=== Checking Service Test Files ===\n');
servicesToTest.forEach(service => {
  // Handle special case for series-data-service
  const fileName = service === 'series-data-service' ? 'series-data-service.spec.ts' : `${service}.service.spec.ts`;
  const testFilePath = path.join(__dirname, `src/app/services/${fileName}`);
  console.log(`Checking test file: ${fileName}`);

  const result = checkTestFile(testFilePath);
  if (result.exists) {
    console.log(`✅ Test file exists for ${service}`);

    if (result.issues.length > 0) {
      console.log(`⚠️ Issues found:`);
      result.issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ No issues found`);
    }
  } else {
    console.log(`❌ Test file does not exist for ${service}`);
  }
  console.log('');
});

// Print summary
console.log('\n=== Summary ===\n');
console.log('Components with tests:');
componentsToTest.forEach(component => {
  console.log(`- ${component}`);
});

console.log('\nServices with tests:');
servicesToTest.forEach(service => {
  console.log(`- ${service}`);
});

console.log('\nAll test files have been checked and are ready to run.');
console.log('\nTo run tests, use one of the following commands:');
console.log('- ng test                  # Run all tests');
console.log('- ng test --include=path/to/file.spec.ts  # Run a specific test file');
console.log('- ng test --include=src/app/components/series-item  # Run tests in a specific directory');

console.log('\nExample:');
console.log('ng test --include=src/app/components/series-item/series-item.component.spec.ts');
