module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', {
      npmPublish: true,
      tarballDir: 'dist',
      pkgRoot: '.'
    }],
    ['@semantic-release/github', {
      assets: [
        { path: 'dist/*.tgz', label: 'npm package' }
      ]
    }],
    ['@semantic-release/git', {
      assets: ['package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }]
  ]
};