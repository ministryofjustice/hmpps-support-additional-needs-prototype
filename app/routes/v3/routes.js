var v = "v3";

function matchref(req){
  // find matching ref in session data
  objIndex = req.session.data["prisoners"].findIndex(obj => obj.prisonerNumber === req.params.ref);
  // store selected ref in a ession variable
  let ref = req.params.ref;
  return ref;
}

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

  router.get("/"+v+"/san/:ref/profile/", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/profile/overview", {ref});
  });


/**
 * Create education support plan
 */

  router.get("/"+v+"/san/:ref/plan/create/person-who-met", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/person-who-met", {ref});
  });


  router.post("/"+v+"/san/plan/create/person-who-met", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/other-people-consulted");
  });

  router.post("/"+v+"/san/plan/create/other-people-consulted", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/review-needs");
  });

  router.post("/"+v+"/san/plan/create/review-needs", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/teaching-adjustments");
  });

  router.post("/"+v+"/san/plan/create/teaching-adjustments", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/environment-adjustments");
  });

  router.post("/"+v+"/san/plan/create/environment-adjustments", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/knowledge-skills");
  });

  router.post("/"+v+"/san/plan/create/knowledge-skills", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/exams-assessments");
  });

  router.post("/"+v+"/san/plan/create/exams-assessments", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/ehcp");
  });

  router.post("/"+v+"/san/plan/create/ehcp", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/lnsp-support");
  });

  router.post("/"+v+"/san/plan/create/lnsp-support", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/review-date");
  });

  router.post("/"+v+"/san/plan/create/review-date", function (req, res) {
    res.redirect("/"+v+"/san/plan/create/check-answers");
  });

  router.post("/"+v+"/san/plan/create/check-answers", function (req, res) {
    res.redirect("/"+v+"/san/profile/");
  });


/************************
 * Add support strategy *
 ************************/

  router.get("/"+v+"/san/:ref/support/add/category", function (req, res){
    let ref = matchref(req);
    res.render("/"+v+"/san/support/add/category", {ref});
  });

  router.post("/"+v+"/san/:ref/support/add/category", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/support/add/description");
  });

  router.get("/"+v+"/san/:ref/support/add/description", function (req, res){
    let ref = matchref(req);
    res.render("/"+v+"/san/support/add/description", {ref});
  });

  router.post("/"+v+"/san/:ref/support/add/description", function (req, res) {
    let ref = matchref(req);

    //letNewSupportCat = req.session.data["san-"+v+"-"+ref+"-support-category"]

    // convert line breaks to html
    let needsSupportDescHTML = req.session.data["san-"+v+"-"+ref+"-support-desc"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    // take support strategy data and add it to the prisoner session data
    let newSupportEntry = {
      needsSupportCategory: req.session.data["san-"+v+"-"+ref+"-support-category"],
      needsSupportDescription: needsSupportDescHTML,
      needsSupportDate: "13 Jun 2025",
      needsSupportAuthor: "W. Knight"
    };

    let thisprisoner = req.session.data['prisoners'].find(p => p.prisonerNumber === ref);
    thisprisoner.needsSupport.push(newSupportEntry);
    delete req.session.data["san-"+v+"-"+ref+"-support-category"];
    delete req.session.data["san-"+v+"-"+ref+"-support-desc"];

    res.redirect("/"+v+"/san/"+ref+"/profile");
  });


  module.exports = router;

}
