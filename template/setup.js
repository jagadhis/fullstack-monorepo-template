#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple spinner implementation
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

function copyTemplateFiles(targetDir) {
  const templateSpinner = spinner.start('Copying template files...');
  try {
    const templateDir = path.resolve(__dirname);

    const filesToCopy = [
      'apps',
      'packages',
      'turbo.json',
      'tsconfig.json',
      '.env'
    ];

    filesToCopy.forEach(file => {
      const src = path.resolve(templateDir, file);
      const dest = path.resolve(targetDir, file);

      if (fs.existsSync(src)) {
        if (fs.lstatSync(src).isDirectory()) {
          fs.cpSync(src, dest, { recursive: true });
        } else {
          fs.copyFileSync(src, dest);
        }
      } else {
        console.error(`File or directory not found: ${src}`);
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
      packageManager: "npm@10.8.2",
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

function updatePackageNames(targetDir) {
  const directories = [
    path.join(targetDir, 'apps/frontend'),
    path.join(targetDir, 'apps/backend'),
    path.join(targetDir, 'packages/types')
  ];

  const spinnerUpdateNames = spinner.start('Updating package names in package.json files...');
  try {
    directories.forEach((dir) => {
      const packageJsonPath = path.join(dir, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.name = path.basename(dir);
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      } else {
        console.warn(`⚠️ No package.json found in ${dir}`);
      }
    });
    spinnerUpdateNames.succeed('Package names updated successfully');
  } catch (error) {
    spinnerUpdateNames.fail('Failed to update package names');
    throw error;
  }
}

async function initializeGit(targetDir) {
  const gitSpinner = spinner.start('Initializing git repository...');
  try {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    gitSpinner.succeed('Git repository initialized');
  } catch (error) {
    gitSpinner.fail('Failed to initialize git repository');
    throw error;
  }
}

async function installDependencies(targetDir) {
  const depsSpinner = spinner.start('Installing dependencies...');
  try {
    execSync('npm install', { cwd: targetDir, stdio: 'ignore' });
    depsSpinner.succeed('Dependencies installed successfully');
  } catch (error) {
    depsSpinner.fail('Failed to install dependencies');
    throw error;
  }
}

async function initializeProject() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.error('❌ Please specify a project name:');
    console.error('   npx package-name <project-name>');
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory "${projectName}" already exists. Please choose a different name.`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  try {
    console.log(`\n🚀 Creating your fullstack monorepo in "${projectName}"...\n`);

    copyTemplateFiles(targetDir);
    updatePackageNames(targetDir);
    await initializeGit(targetDir);
    await installDependencies(targetDir);

    console.log('\n✨ Project setup completed successfully!\n');
    console.log('To get started:');
    console.log(`1. cd ${projectName}`);
    console.log('2. npm run dev     - Start development servers');
    console.log('3. npm run build   - Build all packages\n');

  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    process.exit(1);
  }
}

initializeProject();