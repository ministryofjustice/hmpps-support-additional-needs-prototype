//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


// ✅ SESSION SAFETY INITIALISATION
router.use((req, res, next) => {
  if (!req.session.data.challenges) {
    req.session.data.challenges = []
  }
  if (!req.session.data.strengths) {
    req.session.data.strengths = []
  }
  next()
})


// ---------- BASIC ROUTES ----------

router.get('/overview', (req, res) => {
  res.render('overview')
})

router.get('/add-challenge-describe', (req, res) => {
  res.render('add-challenge-describe')
})

router.get('/add-challenge-category', (req, res) => {
  res.render('add-challenge-category')
})

router.get('/add-challenge-identified', (req, res) => {
  res.render('add-challenge-identified')
})

router.get('/challenges-and-support-tab', (req, res) => {
  res.render('challenges-and-support-tab')
})

router.get('/add-strength-category', (req, res) => {
  res.render('add-strength-category')
})

router.get('/add-strength-describe', (req, res) => {
  res.render('add-strength-describe')
})

router.get('/strengths-tab', (req, res) => {
  res.render('strengths-tab')
})


// ---------- CHALLENGE FLOW ----------

router.post('/add-challenge-category', (req, res) => {
  res.redirect('/add-challenge-category')
})

router.post('/add-challenge-identified', (req, res) => {
  res.redirect('/add-challenge-identified')
})


// ---------- ✅ SAVE CHALLENGE ----------

router.post('/save-challenge', (req, res) => {

  const challenges = req.session.data.challenges || []

  let identified = req.body['identified-by']

  if (!identified) {
    identified = []
  } else if (!Array.isArray(identified)) {
    identified = [identified]
  }

  // ✅ CLEAN BAD VALUES
  identified = identified.filter(item =>
    item !== '_unchecked' && item !== 'on'
  )

  const otherDetails = req.body['other-details']
  if (identified.includes("Other") && otherDetails) {
    identified = identified.map(item =>
      item === "Other" ? `Other: ${otherDetails}` : item
    )
  }

  let areas = req.session.data['affected-areas']
  if (!areas) areas = []
  if (!Array.isArray(areas)) areas = [areas]

  const isPriority = !!req.session.data['priority-need']

  if (!identified.length) {
    identified = ["Not specified"]
  }

  const newChallenge = {
    category: req.session.data['challengeCategory'],
    description: req.session.data['challenge-description'],
    support: req.session.data['support-needed'],
    priority: isPriority,
    areas: areas,
    identifiedBy: identified,

    formattedDate: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  challenges.unshift(newChallenge)
  challenges.sort((a, b) => b.priority - a.priority)

  req.session.data.challenges = challenges

  // ✅ OPTIONAL CLEANUP (prevents weird cloud reuse)
  req.session.data['identified-by'] = ''
  req.session.data['other-details'] = ''

  res.redirect('/challenges-and-support-tab')
})


// ---------- ✅ SAVE STRENGTH ----------

router.post('/add-strength', (req, res) => {

  const strengths = req.session.data.strengths || []

  const categoryMap = {
    "cognition-learning": "Cognition and learning",
    "semh": "Social, emotional and mental health",
    "communication-language": "Communication and language",
    "sensory-physical": "Sensory and physical",
    "general": "General"
  }

  let identified = req.body['identified_by']

  if (!identified) identified = []
  if (!Array.isArray(identified)) identified = [identified]

  // ✅ CLEAN BAD VALUES
  identified = identified.filter(item =>
    item !== '_unchecked' && item !== 'on'
  )

  const otherDetails = req.body['other_details']

  if (identified.includes("Other") && otherDetails) {
    identified = identified.map(item =>
      item === "Other" ? `Other: ${otherDetails}` : item
    )
  }

  const newStrength = {
    category: categoryMap[req.session.data['strengthCategory']] || 'General',
    description: req.body['strength_description'],
    identifiedBy: identified,

    // ✅ FIXED (CRITICAL FOR CLOUD PARITY)
    formattedDate: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  strengths.unshift(newStrength)

  req.session.data.strengths = strengths

  // ✅ OPTIONAL CLEANUP
  req.session.data['strength_description'] = ''
  req.session.data['identified_by'] = ''
  req.session.data['other_details'] = ''

  res.redirect('/strengths-tab')
})

// ✅ DO NOT ADD module.exports