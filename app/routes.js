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

// ✅ Clear session data (works locally and after publishing)
router.get('/prototype-admin/clear-data', function (req, res) {
    req.session.destroy(function (err) {
      res.clearCookie('connect.sid')  // clear cookie in browser
      res.redirect('/')
    })
  })
  