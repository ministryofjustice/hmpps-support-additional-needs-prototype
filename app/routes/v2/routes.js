var v = "/v2/";

module.exports = function(router) {

  router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    if (res.locals.prevURL) {
      req.session.data["prevurl"] = res.locals.prevURL.substring(res.locals.prevURL.lastIndexOf('/') +1);
    }
    // console.log('previous page is: ' + res.locals.prevURL + " and current page is " + req.url + " " + res.locals.currentURL );
    next();
  });

  router.post(v + "san/plan/create/person-who-met", function (req, res) {
    res.redirect(v + "san/plan/create/other-people-consulted");
  });

  router.post(v + "san/plan/create/other-people-consulted", function (req, res) {
    res.redirect(v + "san/plan/create/review-needs");
  });

  router.post(v + "san/plan/create/review-needs", function (req, res) {
    res.redirect(v + "san/plan/create/teaching-adjustments");
  });

  router.post(v + "san/plan/create/teaching-adjustments", function (req, res) {
    res.redirect(v + "san/plan/create/environment-adjustments");
  });

  router.post(v + "san/plan/create/environment-adjustments", function (req, res) {
    res.redirect(v + "san/plan/create/knowledge-skills");
  });

  router.post(v + "san/plan/create/knowledge-skills", function (req, res) {
    res.redirect(v + "san/plan/create/exams-assessments");
  });

  router.post(v + "san/plan/create/exams-assessments", function (req, res) {
    res.redirect(v + "san/plan/create/ehcp");
  });

  router.post(v + "san/plan/create/ehcp", function (req, res) {
    res.redirect(v + "san/plan/create/lnsp-support");
  });

  router.post(v + "san/plan/create/lnsp-support", function (req, res) {
    res.redirect(v + "san/plan/create/review-date");
  });

  router.post(v + "san/plan/create/review-date", function (req, res) {
    res.redirect(v + "san/plan/create/check-answers");
  });

  router.post(v + "san/plan/create/check-answers", function (req, res) {
    res.redirect(v + "san/profile/");
  });

  module.exports = router;

}
