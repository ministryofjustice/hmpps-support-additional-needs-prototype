// app/config.js
module.exports = {
  nunjucksPaths: [
    'app/views',                               // your views
    'node_modules/govuk-frontend/',            // GOV.UK
    'node_modules/govuk-frontend/components',
    'node_modules/@ministryofjustice/frontend/',        // MOJ
    'node_modules/@ministryofjustice/frontend/components'
  ],

  // 👇 Add this line to store session data in the browser cookie
  useCookieSessionStore: true
}
