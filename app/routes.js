// app/routes.js
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

require('./routes/v2.js')(router);
require('./routes/v3.js')(router);
require('./routes/v4.js')(router);
require('./routes/v5.js')(router);

// ✅ Clear all prototype session data (works locally + Cloud)
router.get('/manage-prototype/clear-data', function (req, res) {
  req.session = null;
  res.clearCookie('prototype-kit-session', {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax'
  });
  res.redirect('/');
});
