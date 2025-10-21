// app/config.js
module.exports = {
  nunjucksPaths: [
    'app/views',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components',
    'node_modules/@ministryofjustice/frontend/',
    'node_modules/@ministryofjustice/frontend/components'
  ],

  // ✅ Store session data in cookies
  useCookieSessionStore: true,

  // ✅ Trust reverse proxy (for correct HTTPS detection)
  useHttps: true,

  // ✅ Force cookies to be secure and not expire early
  sessionCookieOptions: {
    secure: true,      // required for Cloud Platform (https)
    httpOnly: true,
    sameSite: 'lax'
  }
}
