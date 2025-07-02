var v = "v4";

function matchref(req){
  // find matching ref in session data
  objIndex = req.session.data[v+"prisoners"].findIndex(obj => obj.prisonerNumber === req.params.ref);
  // store selected ref in a ession variable
  let ref = req.params.ref;
  return ref;
}

function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

module.exports = function(router) {

  router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen
    if (res.locals.prevURL) {
      req.session.data["prevurl"] = res.locals.prevURL.substring(res.locals.prevURL.lastIndexOf('/') +1);
    }
    next();
  });


/********************
 * Prisoner profile *
 ********************/

  router.get("/"+v+"/san/:ref/profile/", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/profile/overview", {ref});
  });

  router.get("/"+v+"/san/:ref/profile/support-strategies", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/support/overview", {ref});
  });

  router.get("/"+v+"/san/:ref/profile/challenges", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/challenges/overview", {ref});
  });

  router.get("/"+v+"/san/:ref/profile/strengths", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/strengths/overview", {ref});
  });

  router.get("/"+v+"/san/:ref/profile/conditions", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/conditions/overview", {ref});
  });

  router.get("/"+v+"/san/:ref/profile/plan", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/overview", {ref});
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
      needsSupportDate: getFormattedDate(),
      needsSupportAuthor: "W. Knight"
    };

    let thisprisoner = req.session.data[v+'prisoners'].find(p => p.prisonerNumber === ref);
    if (!Array.isArray(thisprisoner.needsSupport)) {
      thisprisoner.needsSupport = [];
    }
    thisprisoner.needsSupport.push(newSupportEntry);
    //delete req.session.data["san-"+v+"-"+ref+"-support-category"];
    //delete req.session.data["san-"+v+"-"+ref+"-support-desc"];

    res.redirect("/"+v+"/san/"+ref+"/profile");
  });


/*****************
 * Add challenge *
 *****************/

  router.get("/"+v+"/san/:ref/challenges/add/category", function (req, res){
    let ref = matchref(req);
    res.render("/"+v+"/san/challenges/add/category", {ref});
  });

  router.post("/"+v+"/san/:ref/challenges/add/category", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/challenges/add/description");
  });

  router.get("/"+v+"/san/:ref/challenges/add/description", function (req, res){
    let ref = matchref(req);
    res.render("/"+v+"/san/challenges/add/description", {ref});
  });

  router.post("/"+v+"/san/:ref/challenges/add/description", function (req, res) {
    let ref = matchref(req);

    // convert line breaks to html
    let needsChallengeDescHTML = req.session.data["san-"+v+"-"+ref+"-challenge-desc"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    let needsChallengeIdentifiedHTML = req.session.data["san-"+v+"-"+ref+"-challenge-identified"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    // take challenge data and add it to the prisoner session data
    let newChallengeEntry = {
      needsChallengeCategory: req.session.data["san-"+v+"-"+ref+"-challenge-category"],
      needsChallengeDescription: needsChallengeDescHTML,
      needsChallengeIdentified: needsChallengeIdentifiedHTML,
      needsChallengeDate: getFormattedDate(),
      needsChallengeAuthor: "W. Knight"
    };

    let thisprisoner = req.session.data[v+'prisoners'].find(p => p.prisonerNumber === ref);
    if (!Array.isArray(thisprisoner.needsChallenges)) {
      thisprisoner.needsChallenges = [];
    }
    thisprisoner.needsChallenges.push(newChallengeEntry);
    delete req.session.data["san-"+v+"-"+ref+"-challenge-category"];
    delete req.session.data["san-"+v+"-"+ref+"-challenge-desc"];
    delete req.session.data["san-"+v+"-"+ref+"-challenge-identified"];

    res.redirect("/"+v+"/san/"+ref+"/profile");
  });


/*****************
 * Add strength *
 *****************/

  router.get("/"+v+"/san/:ref/strengths/add/category", function (req, res){
    let ref = matchref(req);
    res.render("/"+v+"/san/strengths/add/category", {ref});
  });

  router.post("/"+v+"/san/:ref/strengths/add/category", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/strengths/add/description");
  });

  router.get("/"+v+"/san/:ref/strengths/add/description", function (req, res){
    let ref = matchref(req);
    res.render("/"+v+"/san/strengths/add/description", {ref});
  });

  router.post("/"+v+"/san/:ref/strengths/add/description", function (req, res) {
    let ref = matchref(req);

    // convert line breaks to html
    let needsStrengthDescHTML = req.session.data["san-"+v+"-"+ref+"-strength-desc"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    let needsStrengthIdentifiedHTML = req.session.data["san-"+v+"-"+ref+"-strength-identified"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    // take support strategy data and add it to the prisoner session data
    let newStrengthEntry = {
      needsStrengthCategory: req.session.data["san-"+v+"-"+ref+"-strength-category"],
      needsStrengthDescription: needsStrengthDescHTML,
      needsStrengthIdentified: needsStrengthIdentifiedHTML,
      needsStrengthDate: getFormattedDate(),
      needsStrengthAuthor: "W. Knight"
    };

    let thisprisoner = req.session.data[v+'prisoners'].find(p => p.prisonerNumber === ref);
    if (!Array.isArray(thisprisoner.needsStrengths)) {
      thisprisoner.needsStrengths = [];
    }
    thisprisoner.needsStrengths.push(newStrengthEntry);
    delete req.session.data["san-"+v+"-"+ref+"-strength-category"];
    delete req.session.data["san-"+v+"-"+ref+"-strength-desc"];
    delete req.session.data["san-"+v+"-"+ref+"-strength-identified"];

    res.redirect("/"+v+"/san/"+ref+"/profile");
  });


/*****************
 * Add condition *
 *****************/

  router.get("/"+v+"/san/:ref/conditions/add", function (req, res){
    let ref = matchref(req);
    res.render("/"+v+"/san/conditions/add", {ref});
  });
  
  router.post("/"+v+"/san/:ref/conditions/add", function (req, res) {
    let ref = matchref(req);
    let thisprisoner = req.session.data[v+'prisoners'].find(p => p.prisonerNumber === ref);
    thisprisoner.conditions = [];
    thisprisoner.otherConditions = [];

    if (req.session.data["san-"+v+"-"+ref+"-conditions"]){

      if (req.session.data["san-" + v + "-" + ref + "-conditions"]) {
        const selectedConditions = req.session.data["san-" + v + "-" + ref + "-conditions"];
        const fullConditionList = req.session.data[v + "conditionlist"] || [];
      
        selectedConditions.forEach((selectedConditionName) => {
          // Find the matching condition from the full list
          const matchingCondition = fullConditionList.find(
            (cond) => cond.conditionName === selectedConditionName
          );
      
          if (matchingCondition) {
            const newConditionEntry = {
              conditionName: selectedConditionName,
              conditionDate: getFormattedDate(),
              conditionAuthor: "W. Knight"
            };
      
            // If it needs extra detail, try to get it from the session data
            if (matchingCondition.conditionDetail && matchingCondition.conditionID) {
              const detailFieldName = `san-${v}-${ref}-conditions-${matchingCondition.conditionID}`;
              const detailValue = req.session.data[detailFieldName];
      
              if (detailValue && detailValue.trim() !== "") {
                newConditionEntry.conditionDetail = detailValue.trim();
              }
            }
      
            thisprisoner.conditions.push(newConditionEntry);
          }
        });
      }
    }

    if (req.session.data["san-"+v+"-"+ref+"-otherconditions"]){

      if (req.session.data["san-" + v + "-" + ref + "-otherconditions"]) {
        const selectedOtherConditions = req.session.data["san-" + v + "-" + ref + "-otherconditions"];
        const fullOtherConditionList = req.session.data[v + "otherconditionlist"] || [];
      
        selectedOtherConditions.forEach((selectedConditionName) => {
          // Find the matching condition from the full list
          const matchingOtherCondition = fullOtherConditionList.find(
            (cond) => cond.conditionName === selectedConditionName
          );
      
          if (matchingOtherCondition) {
            const newOtherConditionEntry = {
              conditionName: selectedConditionName,
              conditionDate: getFormattedDate(),
              conditionAuthor: "W. Knight"
            };
      
            // If it needs extra detail, try to get it from the session data
            if (matchingOtherCondition.conditionDetail && matchingOtherCondition.conditionID) {
              const detailFieldName = `san-${v}-${ref}-otherconditions-${matchingOtherCondition.conditionID}`;
              const detailValue = req.session.data[detailFieldName];
      
              if (detailValue && detailValue.trim() !== "") {
                newOtherConditionEntry.conditionDetail = detailValue.trim();
              }
            }
      
            thisprisoner.otherConditions.push(newOtherConditionEntry);
          }
        });
      }
    }
    
    delete req.session.data["san-"+v+"-"+ref+"-conditions"];
    delete req.session.data["san-"+v+"-"+ref+"-conditions-learningdisabilities"];
    delete req.session.data["san-"+v+"-"+ref+"-conditions-mentalhealth"];
    delete req.session.data["san-"+v+"-"+ref+"-conditions-neurodegenerative"];
    delete req.session.data["san-"+v+"-"+ref+"-conditions-restrictedmobility"];
    delete req.session.data["san-"+v+"-"+ref+"-conditions-visualimpairment"];
    delete req.session.data["san-"+v+"-"+ref+"-otherconditions"];
    delete req.session.data["san-"+v+"-"+ref+"-otherconditions-otherdisabilities"];
    delete req.session.data["san-"+v+"-"+ref+"-otherconditions-otherlanguage"];
    delete req.session.data["san-"+v+"-"+ref+"-otherconditions-otherlearning"];
    delete req.session.data["san-"+v+"-"+ref+"-otherconditions-otherlongterm"];
    delete req.session.data["san-"+v+"-"+ref+"-otherconditions-otherneurological"];

    res.redirect("/"+v+"/san/"+ref+"/profile");
  });


/*********************************
 * Create education support plan *
 *********************************/

  /* Render screens based on ref */

  router.get("/"+v+"/san/:ref/plan/create/person-who-met", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/person-who-met", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/other-people-consulted", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/other-people-consulted", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/other-people-add", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/other-people-add", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/other-people-list", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/other-people-list", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/other-people-remove/:personid", function (req, res) {
    let ref = matchref(req);
    let personid = req.params.personid;
    // remove item from list
    req.session.data["san-"+v+"-"+ref+"-create-otherpeople"].splice(personid,1);
    // if none left in list go to other-people-consulted
    if (req.session.data["san-"+v+"-"+ref+"-create-otherpeople"].length === 0){
      res.redirect("/"+v+"/san/"+ref+"/plan/create/other-people-consulted");
    } else {
      // else show list again
      res.render("/"+v+"/san/plan/create/other-people-list", {ref});
    }
  });

  router.get("/"+v+"/san/:ref/plan/create/review-needs", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/review-needs", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/review-needs-strengths", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/review-needs-strengths", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/review-needs-challenges", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/review-needs-challenges", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/review-needs-support", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/review-needs-support", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/prisoner-view", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/prisoner-view", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/teaching-adjustments", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/teaching-adjustments", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/teaching-adjustments", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/teaching-adjustments", {ref});
  });
/*
  router.get("/"+v+"/san/:ref/plan/create/environment-adjustments", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/environment-adjustments", {ref});
  });
*/
  router.get("/"+v+"/san/:ref/plan/create/knowledge-skills", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/knowledge-skills", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/exams-assessments", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/exams-assessments", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/ehcp", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/ehcp", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/lnsp-support", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/lnsp-support", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/other-details", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/other-details", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/review-date", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/review-date", {ref});
  });

  router.get("/"+v+"/san/:ref/plan/create/check-answers", function (req, res) {
    let ref = matchref(req);
    res.render("/"+v+"/san/plan/create/check-answers", {ref});
  });


  /* Routing for create edcation plan */

  router.post("/"+v+"/san/:ref/plan/create/person-who-met", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/other-people-consulted");
  });

  router.post("/"+v+"/san/:ref/plan/create/other-people-consulted", function (req, res) {
    let ref = matchref(req);
    if (req.session.data["san-"+v+"-"+ref+"-create-otherpeopleconsulted"] == "Yes") {
      res.redirect("/"+v+"/san/"+ref+"/plan/create/other-people-add");
    } else {
      res.redirect("/"+v+"/san/"+ref+"/plan/create/review-needs");
    }
  });

  router.post("/"+v+"/san/:ref/plan/create/other-people-add", function (req, res) {
    let ref = matchref(req);
    /* Store data in temp object for other people consulted */
    let tempOtherPerson = {
      otherPersonName: req.session.data["san-"+v+"-"+ref+"-create-otherpeople-name"],
      otherPersonJob: req.session.data["san-"+v+"-"+ref+"-create-otherpeople-job"]
    };
    //let otherPeople = req.session.data[v+'prisoners'].find(p => p.prisonerNumber === ref);
    if (!Array.isArray(req.session.data["san-"+v+"-"+ref+"-create-otherpeople"])) {
      req.session.data["san-"+v+"-"+ref+"-create-otherpeople"] = [];
    }
    req.session.data["san-"+v+"-"+ref+"-create-otherpeople"].push(tempOtherPerson);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/other-people-list");
  });

  router.post("/"+v+"/san/:ref/plan/create/other-people-list", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/review-needs");
  });

  router.post("/"+v+"/san/:ref/plan/create/review-needs", function (req, res) {
    let ref = matchref(req);
    if (req.session.data["san-"+v+"-"+ref+"-create-reviewneeds"] == "Yes") {
      res.redirect("/"+v+"/san/"+ref+"/plan/create/review-needs-strengths");
    } else {
      res.redirect("/"+v+"/san/"+ref+"/plan/create/prisoner-view");
    }
  });

  router.post("/"+v+"/san/:ref/plan/create/review-needs-strengths", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/review-needs-challenges");
  });

  router.post("/"+v+"/san/:ref/plan/create/review-needs-challenges", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/review-needs-support");
  });

  router.post("/"+v+"/san/:ref/plan/create/review-needs-support", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/prisoner-view");
  });

  router.post("/"+v+"/san/:ref/plan/create/prisoner-view", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/teaching-adjustments");
  });

  router.post("/"+v+"/san/:ref/plan/create/teaching-adjustments", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/knowledge-skills");
  });
/*
  router.post("/"+v+"/san/:ref/plan/create/environment-adjustments", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/knowledge-skills");
  });
*/
  router.post("/"+v+"/san/:ref/plan/create/knowledge-skills", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/exams-assessments");
  });

  router.post("/"+v+"/san/:ref/plan/create/exams-assessments", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/ehcp");
  });

  router.post("/"+v+"/san/:ref/plan/create/ehcp", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/lnsp-support");
  });

  router.post("/"+v+"/san/:ref/plan/create/lnsp-support", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/other-details");
  });

  router.post("/"+v+"/san/:ref/plan/create/other-details", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/review-date");
  });

  router.post("/"+v+"/san/:ref/plan/create/review-date", function (req, res) {
    let ref = matchref(req);
    res.redirect("/"+v+"/san/"+ref+"/plan/create/check-answers");
  });

  router.post("/"+v+"/san/:ref/plan/create/check-answers", function (req, res) {
    let ref = matchref(req);

    /* SESSION DATA EXAMPLE    
      "san-v4-G2911GD-create-personwhomet": "No",
      "san-v4-G2911GD-create-personwhomet-name": "Mark Jacobs",
      "san-v4-G2911GD-create-personwhomet-jobrole": "Tutor",
      "san-v4-G2911GD-create-otherpeopleconsulted": "Yes",
      "san-v4-G2911GD-create-otherpeople-name": "Peter Davidson",
      "san-v4-G2911GD-create-otherpeople-job": "Healthcare Assitant",
      "san-v4-G2911GD-create-otherpeople": [
        {
          "otherPersonName": "David Jones",
          "otherPersonJob": "Mental Health"
        },
        {
          "otherPersonName": "Peter Davidson",
          "otherPersonJob": "Healthcare Assitant"
        }
      ],
      "san-v4-G2911GD-create-reviewneeds": "Yes",
      "san-v4-G2911GD-create-prisonerview": "settling into a classroom environment. Help dealing with loud environments",
      "san-v4-G2911GD-create-teachingadjust": "Yes",
      "san-v4-G2911GD-create-teachingadjust-details": " breaking down tasks and giving additional processing time",
      "san-v4-G2911GD-create-knowledgeskills": "Yes",
      "san-v4-G2911GD-create-knowledgeskills-details": "British sign language",
      "san-v4-G2911GD-create-examsassessments": "Yes",
      "san-v4-G2911GD-create-examsassessments-details": "Will need additional time in written exams",
      "san-v4-G2911GD-create-ehcp": "Do not know",
      "san-v4-G2911GD-create-lnspsupport": "Yes",
      "san-v4-G2911GD-create-lnspsupport-details": "will need someone to break down tasks into smaller chunkc",
      "san-v4-G2911GD-create-lnspsupport-hours": "6",
      "san-v4-G2911GD-create-otherdetails": "no additional details",
      "san-v4-G2911GD-create-reviewdate": "26/9/2025" 
    */

    // convert line breaks to html
    let planPrisonerviewHTML = req.session.data["san-"+v+"-"+ref+"-create-prisonerview"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    let planTeachingadjustHTML = req.session.data["san-"+v+"-"+ref+"-create-teachingadjust-details"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    let planKnowledgeskillsHTML = req.session.data["san-"+v+"-"+ref+"-create-knowledgeskills-details"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    let planExamsAssessmentsHTML = req.session.data["san-"+v+"-"+ref+"-create-examsassessments-details"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    let planLNSPSupportHTML = req.session.data["san-"+v+"-"+ref+"-create-lnspsupport-details"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    let planOtherDetailsHTML = req.session.data["san-"+v+"-"+ref+"-create-otherdetails"].replace(/(?:\r\n|\r|\n)/g, '<br>');
    
    /* Store data in prisoner object */
    let newPlanEntry = {
      personWhoMet: req.session.data["san-"+v+"-"+ref+"-create-personwhomet"],
      personWhoMetName: req.session.data["san-"+v+"-"+ref+"-create-personwhomet-name"],
      personWhoMetJobRole: req.session.data["san-"+v+"-"+ref+"-create-personwhomet-jobrole"],
      otherPeople: req.session.data["san-"+v+"-"+ref+"-create-otherpeopleconsulted"],
      otherPeopleDetails: req.session.data["san-"+v+"-"+ref+"-create-otherpeople"],
      prisonerView: planPrisonerviewHTML,
      teachingAdjust: req.session.data["san-"+v+"-"+ref+"-create-teachingadjust"],
      teachingAdjustDetails: planTeachingadjustHTML,
      //environmentAdjust: req.session.data["san-"+v+"-"+ref+"-create-environmentadjust"],
      knowledgeSkills: req.session.data["san-"+v+"-"+ref+"-create-knowledgeskills"],
      knowledgeSkillsDetails: planKnowledgeskillsHTML,
      examsAssessments: req.session.data["san-"+v+"-"+ref+"-create-examsassessments"],
      examsAssessmentsDetails: planExamsAssessmentsHTML,
      ehcp: req.session.data["san-"+v+"-"+ref+"-create-ehcp"],
      lnspSupport: req.session.data["san-"+v+"-"+ref+"-create-lnspsupport"],
      lnspSupportDetails: planLNSPSupportHTML,
      lnspSupportHours: req.session.data["san-"+v+"-"+ref+"-create-lnspsupport-hours"],
      otherDetails: planOtherDetailsHTML,
      reviewDate: req.session.data["san-"+v+"-"+ref+"-create-reviewdate"],
      dateCreated: getFormattedDate(),
      author: "W. Knight"
    };

    let thisprisoner = req.session.data[v+'prisoners'].find(p => p.prisonerNumber === ref);
    if (!Array.isArray(thisprisoner.plan)) {
      thisprisoner.educationPlan = [];
    }
    thisprisoner.educationPlan.push(newPlanEntry);

    delete req.session.data["san-"+v+"-"+ref+"-create-personwhomet"];
    delete req.session.data["san-"+v+"-"+ref+"-create-personwhomet-name"];
    delete req.session.data["san-"+v+"-"+ref+"-create-personwhomet-jobrole"];
    delete req.session.data["san-"+v+"-"+ref+"-create-otherpeopleconsulted"];
    delete req.session.data["san-"+v+"-"+ref+"-create-otherpeople-name"];
    delete req.session.data["san-"+v+"-"+ref+"-create-otherpeople-job"];
    delete req.session.data["san-"+v+"-"+ref+"-create-otherpeople"];
    delete req.session.data["san-"+v+"-"+ref+"-create-reviewneeds"];
    delete req.session.data["san-"+v+"-"+ref+"-create-prisonerview"];
    delete req.session.data["san-"+v+"-"+ref+"-create-teachingadjust"];
    delete req.session.data["san-"+v+"-"+ref+"-create-teachingadjust-details"];
    delete req.session.data["san-"+v+"-"+ref+"-create-knowledgeskills"];
    delete req.session.data["san-"+v+"-"+ref+"-create-knowledgeskills-details"];
    delete req.session.data["san-"+v+"-"+ref+"-create-examsassessments"];
    delete req.session.data["san-"+v+"-"+ref+"-create-examsassessments-details"];
    delete req.session.data["san-"+v+"-"+ref+"-create-ehcp"];
    delete req.session.data["san-"+v+"-"+ref+"-create-lnspsupport"];
    delete req.session.data["san-"+v+"-"+ref+"-create-lnspsupport-details"];
    delete req.session.data["san-"+v+"-"+ref+"-create-lnspsupport-hours"];
    delete req.session.data["san-"+v+"-"+ref+"-create-otherdetails"];
    delete req.session.data["san-"+v+"-"+ref+"-create-reviewdate"];

    res.redirect("/"+v+"/san/"+ref+"/profile/plan");
  });


  module.exports = router;

}
