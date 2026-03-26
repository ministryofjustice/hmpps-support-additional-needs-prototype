var v = "v5";

function matchref(req) {
  // Finds the prisoner in the session data based on the ID in the URL
  let ref = req.params.ref;
  return ref;
}

function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// NEW: ISO timestamp for sorting
function getNowISO() {
  return new Date().toISOString();
}

module.exports = function (router) {
  // -----------------------
  // Shared middleware
  // -----------------------
  router.use("/", (req, res, next) => {
    res.locals.currentURL = req.originalUrl;
    res.locals.prevURL = req.get("Referrer");
    if (res.locals.prevURL) {
      req.session.data["prevurl"] = res.locals.prevURL.substring(
        res.locals.prevURL.lastIndexOf("/") + 1
      );
    }
    next();
  });

  /********************
   * Prisoner profile *
   ********************/
  router.get("/" + v + "/san/:ref/profile/", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/profile/overview", { ref });
  });

  router.get("/" + v + "/san/:ref/profile/support-strategies", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/support/overview", { ref });
  });

  /************************
   * Challenges Overview
   ************************/
  router.get("/" + v + "/san/:ref/profile/challenges", function (req, res) {
    const ref = matchref(req);
    const challengeUpdated = req.session.data.challengeUpdated;
    const challengeArchived = req.session.data.challengeArchived;
    const challengeAdded = req.session.data.challengeAdded;

    // Clear flags after viewing
    req.session.data.challengeUpdated = false;
    req.session.data.challengeArchived = false;
    req.session.data.challengeAdded = false;

    res.render(v + "/san/challenges/overview", {
      ref,
      challengeUpdated,
      challengeArchived,
      challengeAdded
    });
  });

/************************
   * Add Challenge Journey
   ************************/

  // 1. Select Category (GET)
  router.get("/" + v + "/san/:ref/challenges/add/category", function (req, res) {
    let ref = matchref(req);
    let backLink = req.get('Referrer') || "";
    if (backLink.includes('/profile')) { req.session.data.returnUrl = backLink; }
    let finalBackLink = req.session.data.returnUrl || "/" + v + "/san/" + ref + "/profile/challenges";

    res.render(v + "/san/challenges/add/category", { ref, backLink: finalBackLink });
  });

  // 2. Handle Category Selection (POST) -> Goes to support.html
  router.post("/" + v + "/san/:ref/challenges/add/category", function (req, res) {
    let ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/challenges/add/support");
  });

  // 3. Support Details Page (GET)
  router.get("/" + v + "/san/:ref/challenges/add/support", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/challenges/add/support", { ref });
  });

  // 4. Final Save (POST)
  router.post("/" + v + "/san/:ref/challenges/add/support", function (req, res) {
    let ref = matchref(req);
    const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);

    const category = req.session.data["san-" + v + "-" + ref + "-challenge-category"];
    const description = req.body["san-" + v + "-" + ref + "-challenge-description"];
    const support = req.body["san-" + v + "-" + ref + "-support-description"];
    const identified = req.body["san-" + v + "-" + ref + "-challenge-identified"];

    // Add to Challenges array
    if (!Array.isArray(prisoner.needsChallenges)) prisoner.needsChallenges = [];
    prisoner.needsChallenges.push({
      needsChallengeCategory: category,
      needsChallengeDescription: description,
      needsChallengeIdentified: Array.isArray(identified) ? identified.join(', ') : identified,
      needsChallengeDate: getFormattedDate(),
      needsChallengeAuthor: "J. Smith"
    });

    // If support field was filled, add to Support Strategies array
    if (support && support.trim().length > 0) {
      if (!Array.isArray(prisoner.needsSupport)) prisoner.needsSupport = [];
      prisoner.needsSupport.push({
        needsSupportCategory: category,
        needsSupportDescription: support,
        needsSupportDate: getFormattedDate(),
        needsSupportAuthor: "J. Smith"
      });
    }

    req.session.data.challengeAdded = true;
    res.redirect("/" + v + "/san/" + ref + "/profile/challenges");
  });

  /************************
   * Triggers and signs
   ************************/
  router.get("/" + v + "/san/:ref/profile/add-triggers-signs", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/profile/add-triggers-signs", { ref });
  });

  router.post("/" + v + "/san/:ref/profile/save-triggers-signs", function (req, res) {
    let ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/profile/");
  });

  /************************
   * Strengths, Conditions, etc.
   ************************/
  router.get("/" + v + "/san/:ref/profile/strengths", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/strengths/overview", { ref });
  });

  router.get("/" + v + "/san/:ref/profile/conditions", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/conditions/overview", { ref });
  });

  router.get("/" + v + "/san/:ref/profile/plan", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/plan/overview", { ref });
  });

  // (Keeping your existing Conditions routes below...)
  router.get("/" + v + "/san/:ref/conditions/add", function (req, res) {
    const ref = matchref(req);
    res.render(v + "/san/conditions/add", { ref });
  });

  // ... (Add the rest of your conditions routes here)
};
