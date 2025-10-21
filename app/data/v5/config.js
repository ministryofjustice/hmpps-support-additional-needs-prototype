// app/config.js
module.exports = {
  nunjucksPaths: [
    'app/views',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components',
    'node_modules/@ministryofjustice/frontend/',
    'node_modules/@ministryofjustice/frontend/components'
  ],

  // ✅ Use cookie-based sessions (safe now that data is smaller)
  useCookieSessionStore: true,

  // ✅ Trust proxy for HTTPS
  trustProxy: true,
  useHttps: true,

  // ✅ Secure cookie options for MOJ Cloud
  sessionCookieOptions: {
    secure: true,
    httpOnly: true,
    sameSite: 'lax'
  }
}
