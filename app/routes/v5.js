var v = "v5";

function matchref(req) {
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

function getNowISO() {
  return new Date().toISOString();
}

module.exports = function (router) {
  // Shared middleware
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

  router.get("/" + v + "/san/:ref/profile/challenges", function (req, res) {
    const ref = matchref(req);
    const challengeUpdated = req.session.data.challengeUpdated;
    const challengeArchived = req.session.data.challengeArchived;
    const challengeAdded = req.session.data.challengeAdded;
    const screenerRecorded = req.session.data.screenerRecorded;

    req.session.data.challengeUpdated = false;
    req.session.data.challengeArchived = false;
    req.session.data.challengeAdded = false;
    req.session.data.screenerRecorded = false;

    res.render(v + "/san/challenges/overview", {
      ref,
      challengeUpdated,
      challengeArchived,
      challengeAdded,
      screenerRecorded
    });
  });

  /************************
   * Add Challenge Journey
   ************************/
  router.get("/" + v + "/san/:ref/challenges/add/category", function (req, res) {
    let ref = matchref(req);
    let backLink = req.get('Referrer') || "";
    if (backLink.includes('/profile')) { req.session.data.returnUrl = backLink; }
    let finalBackLink = req.session.data.returnUrl || "/" + v + "/san/" + ref + "/profile/challenges";
    res.render(v + "/san/challenges/add/category", { ref, backLink: finalBackLink });
  });

  router.post("/" + v + "/san/:ref/challenges/add/category", function (req, res) {
    let ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/challenges/add/support");
  });

  router.get("/" + v + "/san/:ref/challenges/add/support", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/challenges/add/support", { ref });
  });

  router.post("/" + v + "/san/:ref/challenges/add/support", function (req, res) {
    let ref = matchref(req);
    const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);

    const category = req.session.data["san-" + v + "-" + ref + "-challenge-category"];
    const description = req.body["san-" + v + "-" + ref + "-challenge-description"];
    const support = req.body["san-" + v + "-" + ref + "-support-description"];
    
    let identified = req.body["san-" + v + "-" + ref + "-challenge-identified"];
    if (Array.isArray(identified)) {
      identified = identified.filter(item => item !== '_unchecked').join(', ');
    }

    if (!Array.isArray(prisoner.needsChallenges)) prisoner.needsChallenges = [];
    
    prisoner.needsChallenges.push({
      needsChallengeCategory: category,
      needsChallengeDescription: description,
      needsSupportDescription: support, 
      needsChallengeIdentified: identified,
      needsChallengeDate: getFormattedDate(),
      needsChallengeAuthor: "J. Smith"
    });

    req.session.data.challengeAdded = true;
    res.redirect("/" + v + "/san/" + ref + "/profile/challenges");
  });

  /************************
   * Custom Clear Session Redirect
   ************************/
  router.get("/" + v + "/clear-session-to-overview", function (req, res) {
    req.session.data = {}
    res.redirect("/" + v + "/san/G2911GD/profile/");
  });
  

  /************************
   * Record Screener Journey
   ************************/

  router.get("/" + v + "/san/:ref/screener/date", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/screener/date", { ref });
  });

  router.post("/" + v + "/san/:ref/screener/date", function (req, res) {
    let ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/screener/select-challenges");
  });

  router.get("/" + v + "/san/:ref/screener/select-challenges", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/screener/select-challenges", { ref });
  });

  router.post("/" + v + "/san/:ref/screener/select-challenges", function (req, res) {
    let ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/screener/select-strengths");
  });

  router.get("/" + v + "/san/:ref/screener/select-strengths", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/screener/select-strengths", { ref });
  });

  router.post("/" + v + "/san/:ref/screener/select-strengths", function (req, res) {
    let ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/screener/check-answers");
  });

  router.get("/" + v + "/san/:ref/screener/check-answers", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/screener/check-answers", { ref });
  });

  // STEP 8: FINAL SCREENER SUBMISSION LOGIC (Updated for Strengths)
  router.post("/" + v + "/san/:ref/screener/check-answers", function (req, res) {
    let ref = matchref(req);
    const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);
    const screenerDate = req.session.data['screener-date'] || getFormattedDate();

    // Challenge Mapping
    const challengeMap = [
      { key: 'screener-literacy', label: 'Literacy skills' },
      { key: 'screener-numeracy', label: 'Numeracy skills' },
      { key: 'screener-attention', label: 'Attention, organising and time management' },
      { key: 'screener-memory', label: 'Memory' },
      { key: 'screener-language', label: 'Language and communication skills' },
      { key: 'screener-emotions', label: 'Emotions and feelings' },
      { key: 'screener-physical', label: 'Physical skills and coordination' },
      { key: 'screener-sensory', label: 'Sensory' }
    ];

    // Strength Mapping (Matches checkbox names in select-strengths.html)
    const strengthMap = [
      { key: 'screener-strength-literacy', label: 'Literacy skills' },
      { key: 'screener-strength-numeracy', label: 'Numeracy skills' },
      { key: 'screener-strength-attention', label: 'Attention, organising and time management' },
      { key: 'screener-strength-memory', label: 'Memory' },
      { key: 'screener-strength-language', label: 'Language and communication skills' },
      { key: 'screener-strength-emotions', label: 'Emotions and feelings' },
      { key: 'screener-strength-physical', label: 'Physical skills and coordination' },
      { key: 'screener-strength-sensory', label: 'Sensory' }
    ];

    const genericSupport = {
      'Literacy skills': 'Provide handouts on colored paper to reduce glare. Read instructions aloud. Use clear, large fonts. Allow use of a digital reading pen.',
      'Numeracy skills': 'Provide a calculator for all tasks. Use visual aids and diagrams. Break down financial tasks into step-by-step checklists.',
      'Attention, organising and time management': 'Keep instructions short. Provide a quiet workspace. Use a daily planner. Break large tasks into small segments.',
      'Memory': 'Use repetition to reinforce instructions. Provide written summaries of conversations. Use mnemonics or visual cues.',
      'Language and communication skills': 'Give extra time to process info. Use simple, direct language. Use non-verbal cues or pictures.',
      'Emotions and feelings': 'Provide a "time-out" strategy if overwhelmed. Maintain a consistent routine. Offer regular check-ins.',
      'Physical skills and coordination': 'Ensure workstation is ergonomic. Allow extra time for handwriting. Provide rubber grips for pens.',
      'Sensory': 'Allow use of noise-canceling headphones. Ensure lighting is not flickering. Provide a quiet workspace.'
    };

    // SAVE CHALLENGES
    challengeMap.forEach(cat => {
      let items = req.session.data[cat.key];
      if (items && Array.isArray(items)) {
        items = items.filter(i => i !== '_unchecked');
        items.forEach(itemText => {
          if (!Array.isArray(prisoner.needsChallenges)) prisoner.needsChallenges = [];
          prisoner.needsChallenges.push({
            needsChallengeCategory: cat.label,
            needsChallengeDescription: itemText,
            needsSupportDescription: genericSupport[cat.label],
            needsChallengeDate: screenerDate,
            needsChallengeAuthor: "Screener Results",
            needsChallengeIdentified: "Identified via Additional Learning Needs Screener"
          });
        });
      }
    });

    // SAVE STRENGTHS
    strengthMap.forEach(cat => {
      let items = req.session.data[cat.key];
      if (items && Array.isArray(items)) {
        items = items.filter(i => i !== '_unchecked');
        items.forEach(itemText => {
          if (!Array.isArray(prisoner.needsStrengths)) prisoner.needsStrengths = [];
          prisoner.needsStrengths.push({
            needsStrengthCategory: cat.label,
            needsStrengthDescription: itemText,
            needsStrengthDate: screenerDate,
            needsStrengthAuthor: "Screener Results"
          });
        });
      }
    });

    req.session.data.screenerRecorded = true;
    
    // Clear temporary screener inputs
    [...challengeMap, ...strengthMap].forEach(cat => { delete req.session.data[cat.key]; });
    delete req.session.data['screener-date'];

    res.redirect("/" + v + "/san/" + ref + "/profile/challenges");
  });

  /************************
   * Edit/Archive/Sidebar Routes
   ************************/
  router.get("/" + v + "/san/:ref/challenges/edit/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscount = parseInt(req.params.thiscount, 10);
    const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);
    const item = prisoner.needsChallenges[thiscount - 1];
    res.render(v + "/san/challenges/edit", { ref, item, thiscount });
  });

  router.post("/" + v + "/san/:ref/challenges/edit/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscount = parseInt(req.params.thiscount, 10);
    const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);
    const item = prisoner.needsChallenges[thiscount - 1];
    item.needsChallengeDescription = req.body["edit-challenge-description"];
    item.needsSupportDescription = req.body["edit-support-description"];
    item.needsChallengeUpdated = getFormattedDate();
    req.session.data.challengeUpdated = true;
    res.redirect("/" + v + "/san/" + ref + "/profile/challenges");
  });

  router.get("/" + v + "/san/:ref/challenges/archive/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscat = req.params.thiscat;
    const thiscount = req.params.thiscount;
    res.render(v + "/san/challenges/archive", { ref, thiscat, thiscount });
  });

  router.post("/" + v + "/san/:ref/challenges/archive/:thiscat/:thiscount", function (req, res) {
    const ref = matchref(req);
    const thiscount = parseInt(req.params.thiscount, 10);
    const prisoner = req.session.data[v + "prisoners"].find(p => p.prisonerNumber === ref);
    const item = prisoner.needsChallenges[thiscount - 1];
    item.needsChallengeArchiveReason = req.body["archive-reason"];
    item.needsChallengeArchiveDate = getFormattedDate();
    req.session.data.challengeArchived = true;
    res.redirect("/" + v + "/san/" + ref + "/profile/challenges");
  });

  router.get("/" + v + "/san/:ref/profile/add-triggers-signs", function (req, res) {
    let ref = matchref(req);
    res.render(v + "/san/profile/add-triggers-signs", { ref });
  });

  router.post("/" + v + "/san/:ref/profile/save-triggers-signs", function (req, res) {
    let ref = matchref(req);
    res.redirect("/" + v + "/san/" + ref + "/profile/");
  });

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

  router.get("/" + v + "/san/:ref/conditions/add", function (req, res) {
    const ref = matchref(req);
    res.render(v + "/san/conditions/add", { ref });
  });

};