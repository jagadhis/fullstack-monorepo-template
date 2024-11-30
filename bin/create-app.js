#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectName = process.argv[2];

if (!projectName) {
  console.log('Please specify the project name:');
  console.log('  npx @jagadhis/fullstack-monorepo-template my-app');
  process.exit(1);
}

const currentDir = process.cwd();
const projectDir = path.join(currentDir, projectName);

try {
  fs.mkdirSync(projectDir, { recursive: true });

  // Copy template files
  execSync(`cp -r ${path.join(__dirname, '../')}* ${projectDir}`);

  // Remove git related files and node_modules
  execSync(`rm -rf ${projectDir}/.git ${projectDir}/node_modules ${projectDir}/apps/*/node_modules ${projectDir}/packages/*/node_modules`);

  console.log('Installing dependencies...');
  process.chdir(projectDir);

  // Initialize new git repository
  execSync('git init');

  // Install dependencies without running scripts
  execSync('npm install --ignore-scripts');

  // Install lefthook separately
  try {
    execSync('npx lefthook install', { stdio: 'inherit' });
  } catch (error) {
    console.log('Note: Lefthook installation skipped, you can install it later with: npx lefthook install');
  }

  console.log(`
Success! Created ${projectName} at ${projectDir}

Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm run lint
    Lints the code.

To set up git hooks (optional):
  npx lefthook install

Start developing by typing:

  cd ${projectName}
  npm run dev
  `);

} catch (error) {
  console.log('Error:', error);
  process.exit(1);
}