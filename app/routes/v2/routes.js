var v = "/v2/";

module.exports = function(router) {

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
    res.redirect(v + "san/plan/profile/?esp=created");
  });

  module.exports = router;

}
