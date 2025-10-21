var v = "v5";

function matchref(req) {
  objIndex = req.session.data[v + "prisoners"].findIndex(
    (obj) => obj.prisonerNumber === req.params.ref
  );
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
    res.render("/" + v + "/san/profile/overview", { ref });
  });

  router.get("/" + v + "/san/:ref/profile/support-strategies", function (req, res) {
    let ref = matchref(req);
    res.render("/" + v + "/san/support/overview", { ref });
  });

  /************************
   * ✅ Challenges Overview (with success banners)
   ************************/
  router.get("/" + v + "/san/:ref/profile/challenges", function (req, res) {
    const ref = matchref(req);

    // ✅ Read banner flags set by edit/archive routes
    const challengeUpdated = req.session.data.challengeUpdated;
    const challengeArchived = req.session.data.challengeArchived;

    // ✅ Clear them so they only show once
    req.session.data.challengeUpdated = false;
    req.session.data.challengeArchived = false;

    res.render("/" + v + "/san/challenges/overview", {
      ref,
      challengeUpdated,
      challengeArchived
    });
  });

  router.get("/" + v + "/san/:ref/profile/strengths", function (req, res) {
    let ref = matchref(req);
    res.render("/" + v + "/san/strengths/overview", { ref });
  });

  router.get("/" + v + "/san/:ref/profile/conditions", function (req, res) {
    let ref = matchref(req);
    res.render("/" + v + "/san/conditions/overview", { ref });
  });

  router.get("/" + v + "/san/:ref/profile/plan", function (req, res) {
    let ref = matchref(req);
    res.render("/" + v + "/san/plan/overview", { ref });
  });

  /************************
 * Add condition
 ************************/


router.post("/" + v + "/san/:ref/conditions/add", function (req, res) {
  const ref = matchref(req);
  const thisprisoner = req.session.data[v + "prisoners"].find(
    (p) => p.prisonerNumber === ref
  );

  if (!Array.isArray(thisprisoner.conditions)) thisprisoner.conditions = [];
  if (!Array.isArray(thisprisoner.otherConditions)) thisprisoner.otherConditions = [];

  // Gather selected conditions from the form
  const selected = req.session.data["san-" + v + "-" + ref + "-conditions"] || [];
  const otherSelected = req.session.data["san-" + v + "-" + ref + "-otherconditions"] || [];

  // Clear existing ones
  thisprisoner.conditions = [];
  thisprisoner.otherConditions = [];

  // Add selected conditions
  selected.forEach((cond) => {
    const detailKey = "san-" + v + "-" + ref + "-conditions-" + cond.replace(/\s+/g, "-");
    const detail = req.session.data[detailKey] || "";
    thisprisoner.conditions.push({
      conditionName: cond,
      conditionDetail: detail,
      conditionDate: getFormattedDate(),
      conditionAuthor: "W. Knight"
    });
  });

  // Add "other" selected conditions
  otherSelected.forEach((cond) => {
    const detailKey = "san-" + v + "-" + ref + "-otherconditions-" + cond.replace(/\s+/g, "-");
    const detail = req.session.data[detailKey] || "";
    thisprisoner.otherConditions.push({
      conditionName: cond,
      conditionDetail: detail,
      conditionDate: getFormattedDate(),
      conditionAuthor: "W. Knight"
    });
  });

  // Set success flag for banner
  req.session.data.conditionAdded = true;

  // Clean up form data
  delete req.session.data["san-" + v + "-" + ref + "-conditions"];
  delete req.session.data["san-" + v + "-" + ref + "-otherconditions"];

  res.redirect("/" + v + "/san/" + ref + "/profile/conditions");
});

/************************
 * Edit condition
 ************************/
router.get("/" + v + "/san/:ref/conditions/edit/:thiscond/:thiscount", function (req, res) {
  const ref = matchref(req);
  const thiscount = parseInt(req.params.thiscount, 10);
  const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);

  if (!Array.isArray(prisoner.conditions)) prisoner.conditions = [];
  const condition = prisoner.conditions[thiscount - 1];
  if (!condition) return res.redirect("/" + v + "/san/" + ref + "/profile/conditions");

  res.render("/" + v + "/san/conditions/edit", { ref, condition });
});

router.post("/" + v + "/san/:ref/conditions/edit/:thiscond/:thiscount", function (req, res) {
  const ref = matchref(req);
  const thiscount = parseInt(req.params.thiscount, 10);
  const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);

  if (!Array.isArray(prisoner.conditions)) prisoner.conditions = [];
  const condition = prisoner.conditions[thiscount - 1];
  if (!condition) return res.redirect("/" + v + "/san/" + ref + "/profile/conditions");

  // ✅ Get form data
  const conditionType = req.body["condition-type"];
  const conditionDetail = req.body["condition-detail"];

  // ✅ Update the condition
  condition.conditionType = conditionType;
  condition.conditionDetail = conditionDetail;
  condition.conditionDate = getFormattedDate();
  condition.conditionAuthor = "W. Knight";

  // ✅ Set success banner
  req.session.data.conditionUpdated = true;

  // ✅ Redirect back to conditions overview
  res.redirect("/" + v + "/san/" + ref + "/profile/conditions");
});

/************************
 * Archive condition
 ************************/
router.get("/" + v + "/san/:ref/conditions/archive/:thiscond/:thiscount", function (req, res) {
  const ref = matchref(req);
  const thiscond = decodeURIComponent(req.params.thiscond);
  const thiscount = parseInt(req.params.thiscount, 10);
  res.render("/" + v + "/san/conditions/archive", { ref, thiscond, thiscount });
});

router.post("/" + v + "/san/:ref/conditions/archive/:thiscond/:thiscount", function (req, res) {
  const ref = matchref(req);
  const thiscount = parseInt(req.params.thiscount, 10);
  const thisprisoner = req.session.data[v + "prisoners"].find(
    (p) => p.prisonerNumber === ref
  );

  if (!Array.isArray(thisprisoner.conditions)) thisprisoner.conditions = [];
  if (!Array.isArray(thisprisoner.conditionsHistory)) thisprisoner.conditionsHistory = [];

  const idx = thiscount - 1;
  const condition = thisprisoner.conditions[idx];
  if (!condition)
    return res.redirect("/" + v + "/san/" + ref + "/profile/conditions");

  const archiveReason = (
    req.session.data["condition-archive-reason"] || ""
  ).replace(/(?:\r\n|\r|\n)/g, "<br>");

  // Move condition to History
  condition.conditionArchiveReason = archiveReason;
  condition.conditionDate = getFormattedDate();
  condition.conditionAuthor = "W. Knight"; // adjust as needed
  thisprisoner.conditionsHistory.push(condition);
  thisprisoner.conditions.splice(idx, 1);

  req.session.data.conditionArchived = true;
  delete req.session.data["condition-archive-reason"];

  res.redirect("/" + v + "/san/" + ref + "/profile/conditions");
});
router.get("/" + v + "/san/:ref/profile/conditions", function (req, res) {
  const ref = matchref(req);

  // ✅ Read temporary flags
  const conditionAdded = req.session.data.conditionAdded;
  const conditionUpdated = req.session.data.conditionUpdated;
  const conditionArchived = req.session.data.conditionArchived;

  // ✅ Clear them so they only show once
  req.session.data.conditionAdded = false;
  req.session.data.conditionUpdated = false;
  req.session.data.conditionArchived = false;

  res.render("/" + v + "/san/conditions/overview", {
    ref,
    conditionAdded,
    conditionUpdated,
    conditionArchived
  });
});



  /************************
   * Add support strategy *
   ************************/
  router.get("/" + v + "/san/:ref/support/add/category", function (req, res) {
    const ref = matchref(req);
    res.render("/" + v + "/san/support/add/category", { ref });
  });

  router.post("/" + v + "/san/:ref/support/add/category", function (req, res) {
    const ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/support/add/description");
  });

  router.get("/" + v + "/san/:ref/support/add/description", function (req, res) {
    const ref = matchref(req);
    res.render("/" + v + "/san/support/add/description", { ref });
  });

  router.post("/" + v + "/san/:ref/support/add/description", function (req, res) {
    const ref = matchref(req);

    const needsSupportDescHTML = (
      req.session.data["san-" + v + "-" + ref + "-support-desc"] || ""
    ).replace(/(?:\r\n|\r|\n)/g, "<br>");

    const newSupportEntry = {
      needsSupportCategory:
        req.session.data["san-" + v + "-" + ref + "-support-category"],
      needsSupportDescription: needsSupportDescHTML,
      needsSupportDate: getFormattedDate(),
      needsSupportDateISO: getNowISO(),
      needsSupportAuthor: "W. Knight",
    };

    const prisoner = req.session.data[v + "prisoners"].find(
      (p) => p.prisonerNumber === ref
    );
    if (!Array.isArray(prisoner.needsSupport)) prisoner.needsSupport = [];
    prisoner.needsSupport.push(newSupportEntry);

    delete req.session.data["san-" + v + "-" + ref + "-support-category"];
    delete req.session.data["san-" + v + "-" + ref + "-support-desc"];

    res.redirect("/" + v + "/san/" + ref + "/profile/support-strategies");
  });

  /************************
   * Edit support strategy *
   ************************/
  router.get("/" + v + "/san/:ref/support/edit/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscat = req.params.thiscat;
    const thiscount = req.params.thiscount;

    res.render("/" + v + "/san/support/edit", { ref, thiscat, thiscount });
  });

  router.post("/" + v + "/san/:ref/support/edit/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscount = parseInt(req.params.thiscount, 10);
    const thisprisoner = req.session.data[v + "prisoners"].find(
      (p) => p.prisonerNumber === ref
    );

    if (!Array.isArray(thisprisoner.needsSupport)) thisprisoner.needsSupport = [];
    const idx = thiscount - 1;
    const item = thisprisoner.needsSupport[idx];
    if (!item)
      return res.redirect("/" + v + "/san/" + ref + "/profile/support-strategies");

    const editNeedHTML = (
      req.session.data[`san-${v}-${ref}-support-desc`] || ""
    ).replace(/(?:\r\n|\r|\n)/g, "<br>");

    item.needsSupportDescription = editNeedHTML;
    item.needsSupportUpdated = getFormattedDate();
    item.needsSupportUpdatedISO = getNowISO();
    item.needsSupportLastAction = "Updated";

    req.session.data.supportUpdated = true;
    delete req.session.data[`san-${v}-${ref}-support-desc`];

    res.redirect("/" + v + "/san/" + ref + "/profile/support-strategies");
  });

  /************************
   * Archive support strategy *
   ************************/
  router.get("/" + v + "/san/:ref/support/archive/:thiscat/:thiscount", function (req, res) {
    let ref = matchref(req);
    let thiscat = req.params.thiscat;
    let thiscount = req.params.thiscount;
    res.render("/" + v + "/san/support/archive", { ref, thiscat, thiscount });
  });

  router.post("/" + v + "/san/:ref/support/archive/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscount = parseInt(req.params.thiscount, 10);
    const thisprisoner = req.session.data[v + "prisoners"].find(
      (p) => p.prisonerNumber === ref
    );

    if (!Array.isArray(thisprisoner.needsSupport)) thisprisoner.needsSupport = [];
    const idx = thiscount - 1;
    const item = thisprisoner.needsSupport[idx];
    if (!item)
      return res.redirect("/" + v + "/san/" + ref + "/profile/support-strategies");

    const archiveReason = (
      req.session.data["san-" + v + "-" + ref + "-support-archive"] || ""
    ).replace(/(?:\r\n|\r|\n)/g, "<br>");

    item.needsSupportArchiveReason = archiveReason;
    item.needsSupportArchiveISO = getNowISO();
    item.needsSupportDate = getFormattedDate();
    item.needsSupportDateISO = getNowISO();
    item.needsSupportLastAction = "Moved to History";

    req.session.data.supportArchived = true;

    delete req.session.data["san-" + v + "-" + ref + "-support-archive"];
    delete req.session.data["san-" + v + "-" + ref + "-support-desc"];

    res.redirect("/" + v + "/san/" + ref + "/profile/support-strategies");
  });

  /************************
   * Edit Challenge
   ************************/
  router.get("/" + v + "/san/:ref/challenges/edit/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscat = req.params.thiscat;
    const thiscount = req.params.thiscount;
    res.render("/" + v + "/san/challenges/edit", { ref, thiscat, thiscount });
  });

  router.post("/" + v + "/san/:ref/challenges/edit/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscount = parseInt(req.params.thiscount, 10);
    const thisprisoner = req.session.data[v + "prisoners"].find(
      (p) => p.prisonerNumber === ref
    );

    if (!Array.isArray(thisprisoner.needsChallenges))
      thisprisoner.needsChallenges = [];

    const idx = thiscount - 1;
    const item = thisprisoner.needsChallenges[idx];
    if (!item)
      return res.redirect("/" + v + "/san/" + ref + "/profile/challenges");

    const descHTML = (
      req.session.data[`san-${v}-${ref}-challenge-desc`] || ""
    ).replace(/(?:\r\n|\r|\n)/g, "<br>");
    const identHTML = (
      req.session.data[`san-${v}-${ref}-challenge-identified`] || ""
    ).replace(/(?:\r\n|\r|\n)/g, "<br>");

    item.needsChallengeDescription = descHTML;
    item.needsChallengeIdentified = identHTML;
    item.needsChallengeUpdated = getFormattedDate();
    item.needsChallengeUpdatedISO = getNowISO();
    item.needsChallengeAuthor = "W. Knight";

    req.session.data.challengeUpdated = true;

    delete req.session.data[`san-${v}-${ref}-challenge-desc`];
    delete req.session.data[`san-${v}-${ref}-challenge-identified`];

    res.redirect("/" + v + "/san/" + ref + "/profile/challenges");
  });

  /************************
   * Archive Challenge
   ************************/
  router.get("/" + v + "/san/:ref/challenges/archive/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscat = req.params.thiscat;
    const thiscount = req.params.thiscount;
    res.render("/" + v + "/san/challenges/archive", { ref, thiscat, thiscount });
  });

  router.post("/" + v + "/san/:ref/challenges/archive/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscount = parseInt(req.params.thiscount, 10);
    const thisprisoner = req.session.data[v + "prisoners"].find(
      (p) => p.prisonerNumber === ref
    );

    if (!Array.isArray(thisprisoner.needsChallenges))
      thisprisoner.needsChallenges = [];

    const idx = thiscount - 1;
    const item = thisprisoner.needsChallenges[idx];
    if (!item)
      return res.redirect("/" + v + "/san/" + ref + "/profile/challenges");

    const archiveReason = (
      req.session.data[`san-${v}-${ref}-challenge-archive-reason`] || ""
    ).replace(/(?:\r\n|\r|\n)/g, "<br>");
    item.needsChallengeArchiveReason = archiveReason;
    item.needsChallengeArchiveDate = getFormattedDate();
    item.needsChallengeArchiveISO = getNowISO();
    item.needsChallengeLastAction = "Moved to History";

    req.session.data.challengeArchived = true;
    delete req.session.data[`san-${v}-${ref}-challenge-archive-reason`];

    res.redirect("/" + v + "/san/" + ref + "/profile/challenges");
  });
}; // ✅ end module.exports
