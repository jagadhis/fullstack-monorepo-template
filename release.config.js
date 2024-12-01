/** @type {import('semantic-release').GlobalConfig} */
module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', {
      npmPublish: true,
      registry: 'https://registry.npmjs.org/'
    }],
    '@semantic-release/github',
    ['@semantic-release/git', {
      assets: ['package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }]
  ],
  success: [
    ['@semantic-release/exec', {
      cmd: 'npm publish --registry https://npm.pkg.github.com --tag github'
    }]
  ]
};