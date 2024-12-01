/** @type {import('semantic-release').GlobalConfig} */
module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', {
      npmPublish: true,
      pkgRoot: '.',
      assets: ['template/**/*']
    }],
    ['@semantic-release/github', {
      assets: [
        { path: "template/**/*", label: "Template Files" }
      ]
    }],
    ['@semantic-release/git', {
      assets: ['package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }]
  ]
};