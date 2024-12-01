#!/usr/bin/env node
import ora from 'ora'
import { execSync } from 'child_process'
import { existsSync, lstatSync, cpSync, copyFileSync, writeFileSync } from 'fs'
import { join, basename } from 'path'

function copyTemplateFiles() {
  const spinner = ora('Copying template files...').start()
  try {
    const templateDir = join(__dirname)
    const targetDir = process.cwd()

    // Files to copy
    const filesToCopy = [
      'apps',
      'packages',
      'turbo.json',
      'tsconfig.json'
    ]

    // Copy each file/directory
    filesToCopy.forEach(file => {
      const src = join(templateDir, file)
      const dest = join(targetDir, file)

      if (existsSync(src)) {
        if (lstatSync(src).isDirectory()) {
          cpSync(src, dest, { recursive: true })
        } else {
          copyFileSync(src, dest)
        }
      }
    })

    // Create package.json for the new project
    const packageJson = {
      name: basename(targetDir),
      version: '0.1.0',
      private: true,
      workspaces: [
        'apps/*',
        'packages/*'
      ],
      scripts: {
        'build': 'turbo run build',
        'dev': 'turbo run dev',
        'lint': 'turbo run lint',
        'test': 'turbo run test',
        'clean': 'turbo run clean && rm -rf node_modules'
      },
      devDependencies: {
        'turbo': '^2.3.3'
      }
    }

    writeFileSync(
      join(targetDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    spinner.succeed('Template files copied successfully');
  } catch (error) {
    spinner.fail('Failed to copy template files');
    throw error;
  }
}

async function initializeGit() {
  const spinner = ora('Initializing git repository...').start();
  try {
    execSync('git init', { stdio: 'ignore' });
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git repository');
    throw error;
  }
}

async function installDependencies() {
  const spinner = ora('Installing dependencies...').start();
  try {
    execSync('npm install', { stdio: 'ignore' });
    spinner.succeed('Dependencies installed successfully');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
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