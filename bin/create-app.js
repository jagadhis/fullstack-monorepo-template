#!/usr/bin/env node
import ora from 'ora';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function executeCommand(command, cwd) {
  return execSync(command, {
    stdio: 'inherit',
    cwd: cwd
  });
}

async function installDependencies(targetPath, packageName) {
  const spinner = ora(`Installing dependencies for ${packageName}...`).start();
  try {
    await executeCommand('npm install', targetPath);
    spinner.succeed(`Dependencies installed for ${packageName}`);
  } catch (error) {
    spinner.fail(`Failed to install dependencies for ${packageName}`);
    throw error;
  }
}

async function copyTemplate(targetPath) {
  const spinner = ora('Copying template files...').start();
  try {
    // Get the template directory path (relative to the installed package)
    const templateDir = path.join(__dirname, '..');

    // Copy essential files and directories
    const filesToCopy = [
      'apps',
      'packages',
      'turbo.json',
      'tsconfig.json',
      '.commitlintrc.yaml',
      'lefthook.yml'
    ];

    for (const file of filesToCopy) {
      const sourcePath = path.join(templateDir, file);
      const destPath = path.join(targetPath, file);

      if (fs.existsSync(sourcePath)) {
        if (fs.lstatSync(sourcePath).isDirectory()) {
          fs.cpSync(sourcePath, destPath, { recursive: true });
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    }

    // Create a new package.json with only necessary fields
    const templatePkg = JSON.parse(fs.readFileSync(path.join(templateDir, 'package.json'), 'utf8'));
    const newPkg = {
      name: path.basename(targetPath),
      version: '0.1.0',
      private: true,
      workspaces: templatePkg.workspaces,
      scripts: templatePkg.scripts,
      devDependencies: {
        "@commitlint/cli": templatePkg.devDependencies["@commitlint/cli"],
        "@commitlint/config-conventional": templatePkg.devDependencies["@commitlint/config-conventional"],
        "lefthook": templatePkg.devDependencies.lefthook,
        "turbo": templatePkg.devDependencies.turbo
      }
    };

    fs.writeFileSync(
      path.join(targetPath, 'package.json'),
      JSON.stringify(newPkg, null, 2)
    );

    spinner.succeed('Template files copied successfully');
  } catch (error) {
    spinner.fail('Failed to copy template files');
    throw error;
  }
}

async function initializeGit(targetPath) {
  const spinner = ora('Initializing git repository...').start();
  try {
    await executeCommand('git init', targetPath);
    // Copy .gitignore
    const templateDir = path.join(__dirname, '..');
    fs.copyFileSync(
      path.join(templateDir, '.gitignore'),
      path.join(targetPath, '.gitignore')
    );
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git repository');
    throw error;
  }
}

async function setupProject() {
  try {
    const targetPath = process.cwd();
    console.log('\n🚀 Creating your fullstack monorepo...\n');

    // Copy template files
    await copyTemplate(targetPath);

    // Initialize git
    await initializeGit(targetPath);

    // Install root dependencies
    await installDependencies(targetPath, 'root');

    // Install workspace dependencies
    const workspaces = ['apps/frontend', 'apps/backend'];
    for (const workspace of workspaces) {
      const workspacePath = path.join(targetPath, workspace);
      if (fs.existsSync(workspacePath)) {
        await installDependencies(workspacePath, workspace);
      }
    }

    console.log('\n✨ Project setup completed successfully!\n');
    console.log('To get started:');
    console.log('\n1. npm run dev     - Start development servers');
    console.log('2. npm run build   - Build all packages');
    console.log('3. npm run lint    - Lint all packages');
    console.log('\nHappy coding! 🎉\n');

  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    process.exit(1);
  }
}

setupProject();