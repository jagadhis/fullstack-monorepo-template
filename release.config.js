module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tarballDir: 'dist',
        pkgRoot: '.',
        registry: 'https://registry.npmjs.org/',
        tag: 'latest'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'dist/*.tgz', label: 'npm package' }
        ]
      }
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tarballDir: 'dist',
        pkgRoot: '.',
        registry: 'https://npm.pkg.github.com',
        tag: 'latest'
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
};