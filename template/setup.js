#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple spinner implementation since ora is ESM only
const spinner = {
  text: '',
  interval: null,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  frameIndex: 0,

  start(text) {
    this.text = text;
    this.interval = setInterval(() => {
      process.stdout.write(`\r${this.frames[this.frameIndex]} ${this.text}`);
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }, 80);
    return this;
  },

  succeed(text) {
    clearInterval(this.interval);
    console.log(`\r✓ ${text}`);
  },

  fail(text) {
    clearInterval(this.interval);
    console.log(`\r✗ ${text}`);
  }
};

function copyTemplateFiles() {
  const templateSpinner = spinner.start('Copying template files...');
  try {
    const templateDir = path.join(__dirname);
    const targetDir = process.cwd();

    // Files to copy
    const filesToCopy = [
      'apps',
      'packages',
      'turbo.json',
      'tsconfig.json'
    ];

    // Copy each file/directory
    filesToCopy.forEach(file => {
      const src = path.join(templateDir, file);
      const dest = path.join(targetDir, file);

      if (fs.existsSync(src)) {
        if (fs.lstatSync(src).isDirectory()) {
          fs.cpSync(src, dest, { recursive: true });
        } else {
          fs.copyFileSync(src, dest);
        }
      }
    });

    // Create package.json for the new project
    const packageJson = {
      name: path.basename(targetDir),
      version: "0.1.0",
      private: true,
      workspaces: [
        "apps/*",
        "packages/*"
      ],
      scripts: {
        "build": "turbo run build",
        "dev": "turbo run dev",
        "lint": "turbo run lint",
        "test": "turbo run test",
        "clean": "turbo run clean && rm -rf node_modules"
      },
      devDependencies: {
        "turbo": "^2.3.3"
      }
    };

    fs.writeFileSync(
      path.join(targetDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    templateSpinner.succeed('Template files copied successfully');
  } catch (error) {
    templateSpinner.fail('Failed to copy template files');
    throw error;
  }
}

async function initializeGit() {
  const gitSpinner = spinner.start('Initializing git repository...');
  try {
    execSync('git init', { stdio: 'ignore' });
    gitSpinner.succeed('Git repository initialized');
  } catch (error) {
    gitSpinner.fail('Failed to initialize git repository');
    throw error;
  }
}

async function installDependencies() {
  const depsSpinner = spinner.start('Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'ignore' });
    depsSpinner.succeed('Dependencies installed successfully');
  } catch (error) {
    depsSpinner.fail('Failed to install dependencies');
    throw error;
  }
}

async function initializeProject() {
  try {
    console.log('\n🚀 Creating your fullstack monorepo...\n');

    copyTemplateFiles();
    await initializeGit();
    await installDependencies();

    console.log('\n✨ Project setup completed successfully!\n');
    console.log('To get started:');
    console.log('1. cd into your project directory');
    console.log('2. npm run dev     - Start development servers');
    console.log('3. npm run build   - Build all packages\n');

  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    process.exit(1);
  }
}

initializeProject();