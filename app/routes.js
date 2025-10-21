//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

require('./routes/v2.js')(router);
require('./routes/v3.js')(router);
require('./routes/v4.js')(router);
require('./routes/v5.js')(router);

// ✅ Works with both cookie and memory sessions
router.get('/manage-prototype/clear-data', function (req, res) {
  req.session.data = {}  // Reset all prototype data
  res.clearCookie('govuk-prototype-kit-session') // Correct cookie name
  res.redirect('/')
})
