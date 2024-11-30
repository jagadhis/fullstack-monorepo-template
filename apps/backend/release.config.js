/** @type {import('semantic-release').GlobalConfig} */
const config = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', {
      npmPublish: true,
      tarballDir: 'dist'
    }],
    '@semantic-release/github'
  ],
  debug: true
}

module.exports = config