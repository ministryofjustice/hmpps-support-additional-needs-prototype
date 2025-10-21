// app/config.js
module.exports = {
  nunjucksPaths: [
    'app/views',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components',
    'node_modules/@ministryofjustice/frontend/',
    'node_modules/@ministryofjustice/frontend/components'
  ],

  // ❌ Disable cookie-based sessions (too small for your data)
  useCookieSessionStore: false,

  // ✅ Trust reverse proxy and enforce HTTPS for secure sessions
  useHttps: true
}
