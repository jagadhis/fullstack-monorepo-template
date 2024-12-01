module.exports = {
  branches: ['master'],
  plugins: [
    // Analyze commits for determining version bump (major, minor, patch)
    '@semantic-release/commit-analyzer',
    // Generate release notes
    '@semantic-release/release-notes-generator',

    // Publish to npm registry
    [
      '@semantic-release/npm',
      {
        npmPublish: true, // Ensure it publishes to npm
        tarballDir: 'npm-tarball', // Directory for npm tarball
        pkgRoot: '.',
        registry: 'https://registry.npmjs.org/', // Primary registry
        tag: 'latest'
      }
    ],

    // Publish tarball to GitHub Packages
    [
      '@semantic-release/npm',
      {
        npmPublish: true, // Also publish to GitHub Packages
        tarballDir: 'github-tarball', // Separate tarball directory for GitHub
        pkgRoot: '.',
        registry: 'https://npm.pkg.github.com', // GitHub Packages registry
        tag: 'latest'
      }
    ],

    // Attach tarball as an asset in GitHub Releases
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'npm-tarball/*.tgz', label: 'npm package' },
          { path: 'github-tarball/*.tgz', label: 'GitHub package' }
        ]
      }
    ],

    // Update package.json and push changes back to Git
    [
      '@semantic-release/git',
      {
        assets: ['package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ],
  prepare: [
    {
      path: '@semantic-release/exec',
      cmd: 'rm -rf npm-tarball github-tarball && mkdir npm-tarball github-tarball' // Clean tarball directories
    }
  ]
};