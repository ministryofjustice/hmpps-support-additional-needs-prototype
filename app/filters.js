//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// -------------------------------
// Helper: robust UK date parser
// Supports: dd/MM/yyyy, d MMM yyyy, yyyy-MM-dd
// Returns a JS Date (local) or null if unparseable
// -------------------------------
function parseDmy (input) {
  if (!input) return null
  const s = String(input).trim()

  // dd/MM/yyyy (1–2 digit day/month)
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) {
    const d = parseInt(m[1], 10)
    const mo = parseInt(m[2], 10) - 1
    const y = parseInt(m[3], 10)
    const dt = new Date(y, mo, d)
    return isNaN(dt) ? null : dt
  }

  // d MMM yyyy (e.g. 7 Jul 2025 or 07 Jul 2025)
  m = s.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/)
  if (m) {
    const d = parseInt(m[1], 10)
    const y = parseInt(m[3], 10)
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const mo = months.indexOf(m[2].slice(0, 3).toLowerCase())
    if (mo >= 0) {
      const dt = new Date(y, mo, d)
      return isNaN(dt) ? null : dt
    }
  }

  // ISO yyyy-mm-dd
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (m) {
    const y = parseInt(m[1], 10)
    const mo = parseInt(m[2], 10) - 1
    const d = parseInt(m[3], 10)
    const dt = new Date(y, mo, d)
    return isNaN(dt) ? null : dt
  }

  return null
}

// -------------------------------
// nl2br — keep existing behaviour
// -------------------------------
addFilter('nl2br', function (str) {
  if (str === undefined || str === null) return ''
  return String(str).replace(/\r|\n|\r\n/g, '<br />')
})

// -------------------------------
// govukDate — RECOMMENDED formatter
// Outputs: "7 July 2025"
// Works with dd/MM/yyyy, d MMM yyyy, yyyy-MM-dd
// -------------------------------
addFilter('govukDate', function (str) {
  const dt = parseDmy(str)
  if (!dt) return str || ''
  const day = dt.getDate()
  const monthNamesFull = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]
  const month = monthNamesFull[dt.getMonth()]
  const year = dt.getFullYear()
  return `${day} ${month} ${year}`
})

// -------------------------------
// toGovDate — short-month variant
// Outputs: "7 Jul 2025"
// (Uses robust parser instead of new Date(str))
// -------------------------------
addFilter('toGovDate', function (str) {
  const dt = parseDmy(str)
  if (!dt) return str || ''
  const day = dt.getDate()
  const monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const month = monthNamesShort[dt.getMonth()]
  const year = dt.getFullYear()
  return `${day} ${month} ${year}`
})

// -------------------------------
// dateReplaceSlash — legacy, hardened
// If string looks like dd/MM/yyyy, convert to "d Mon yyyy"
// Else return as-is (prevents "undefined undefined")
// -------------------------------
addFilter('dateReplaceSlash', function (str) {
  if (!str) return ''
  const s = String(str).trim()

  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return s

  const day = parseInt(m[1], 10)
  const monthIdx = parseInt(m[2], 10) - 1
  const year = m[3]

  const monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (monthIdx < 0 || monthIdx > 11) return s

  return `${day} ${monthNamesShort[monthIdx]} ${year}`
})

// -------------------------------
// isPastDate — Boolean: true if date is before today
// Normalises to date-only (no time) for comparison
// -------------------------------
addFilter('isPastDate', function (str) {
  const dt = parseDmy(str)
  if (!dt) return false
  const today = new Date()
  today.setHours(0,0,0,0)
  dt.setHours(0,0,0,0)
  return dt < today
})
