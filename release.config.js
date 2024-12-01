module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tarballDir: 'npm-tarball',
        pkgRoot: '.',
        registry: 'https://registry.npmjs.org/',
        tag: 'latest'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [{ path: 'npm-tarball/*.tgz', label: 'npm package' }]
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tarballDir: 'github-tarball',
        pkgRoot: '.',
        registry: 'https://npm.pkg.github.com',
        tag: 'latest'
      }
    ]
  ],

  prepare: [
    {
      path: '@semantic-release/exec',
      cmd: 'rm -rf npm-tarball github-tarball && mkdir npm-tarball github-tarball'
    }
  ]
};