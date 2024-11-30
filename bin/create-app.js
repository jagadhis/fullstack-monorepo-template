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

  console.log('Installing dependencies...');
  process.chdir(projectDir);
  execSync('npm install');

  console.log(`
Success! Created ${projectName} at ${projectDir}
Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm run lint
    Lints the code.

Start developing by typing:

  cd ${projectName}
  npm run dev
  `);

} catch (error) {
  console.log('Error:', error);
  process.exit(1);
}