
//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

//New routes here:

//Number plate format
function formatNumberPlate(input) {
  if (!input) return ''

  // Keep letters/numbers only, uppercase
  const cleaned = String(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim()

  // Common formats (display only)
  if (cleaned.length === 7) {
    return cleaned.slice(0, 4) + ' ' + cleaned.slice(4)
  }

  if (cleaned.length === 6) {
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3)
  }

  return cleaned
}

router.all('/a-starting-screens/check-vehicle-details', function (req, res, next) {
  const vrm = req.session.data['vehicleRegistration']
  req.session.data['vehicleRegistrationFormatted'] = formatNumberPlate(vrm)
  next()
})

//Do you have a V11 route:
router.post('/a-starting-screens/do-you-have-a-V11-reminder-answer', function (req, res) {
  const hasV11 = req.session.data['hasV11']

  if (hasV11 === 'yes') {
    return res.redirect('/a-starting-screens/V11-letter.html')
  }

  return res.redirect('/a-starting-screens/which-document-do-you-have.html')
})

//Doesn't have V11 reminder letter:
router.post('/a-starting-screens/which-document-do-you-have-answer', function (req, res) {
  const documentType = req.session.data['documentType']

  if (documentType === 'v5c') {
    return res.redirect('/a-starting-screens/V5C')
  }

  if (documentType === 'last-chance') {
    return res.redirect('/a-starting-screens/last-chance-letter')
  }

  if (documentType === 'v5c-2') {
    return res.redirect('/a-starting-screens/v5c-2')
  }

  if (documentType === 'email') {
    return res.redirect('/a-starting-screens/email')
  }

  // If nothing selected, send them back 
  return res.redirect('/a-starting-screens/which-document-do-you-have')
})

//Choose 6 months or 12 months tax

function formatDateGB(date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

router.post('/b-eVED-screens/how-long-answer', function (req, res) {
  const taxLength = req.session.data['taxLength'] || '12' // default for UR
  const monthsToAdd = (taxLength === '6') ? 6 : 12

  const today = new Date()

  // Start date = first day of next month
  const start = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  // End date = start date + monthsToAdd months - 1 day
  // JS trick: day 0 = last day of previous month
  const end = new Date(start.getFullYear(), start.getMonth() + monthsToAdd, 0)

  req.session.data['taxStartDate'] = formatDateGB(start)
  req.session.data['taxEndDate'] = formatDateGB(end)
  req.session.data['taxLengthLabel'] = (taxLength === '6') ? '6 months' : '12 months'
  req.session.data['taxCost'] = (taxLength === '6') ? 165.38 : 330.75

  return res.redirect('/b-eVED-screens/do-you-know-exact-mileage')
})

// //Do you know exact mileage

// router.post('/b-eVED-screens/mileage-answer', function (req, res) {
//   const mileageKnown = req.session.data['mileageKnown']
//   const milesInput = req.session.data['exactMileageMiles']
//   const kmInput = req.session.data['exactMileageKm']

//   // If "no", clear any previously-entered mileage so it doesn't leak into summaries
//   if (mileageKnown === 'no') {
//     req.session.data['exactMileageMiles'] = ''
//     req.session.data['exactMileageKm'] = ''
//     req.session.data['exactMileage'] = ''
//     return res.redirect('/b-eVED-screens/dropout-does-not-know-exact-mileage')
//   }

//   // If "yes", store a single canonical value for later screens
//   // Priority: miles field; if empty but km provided, convert to miles
//   let exactMileage = ''

//   if (milesInput && String(milesInput).trim() !== '') {
//     exactMileage = String(milesInput).replace(/[^0-9]/g, '') // keep digits only (prototype-friendly)
//   } else if (kmInput && String(kmInput).trim() !== '') {
//     const cleanedKm = Number(String(kmInput).replace(/[^0-9.]/g, ''))
//     if (!Number.isNaN(cleanedKm)) {
//       exactMileage = String(Math.round(cleanedKm * 0.621371)) // round to whole miles
//     }
//   }

//   req.session.data['exactMileage'] = exactMileage

//   return res.redirect('/b-eVED-screens/mileage-balance')
// })


// // Mileage answer
// router.post('/b-eVED-screens/mileage-answer', function (req, res) {
//   const mileageUnit = req.session.data['mileageUnit']
//   const milesInput = req.session.data['exactMileageMiles']
//   const kmInput = req.session.data['exactMileageKm']

//   // Clean helper
//   function cleanNumber(value) {
//     return String(value || '').replace(/[^0-9]/g, '')
//   }

//   const cleanedMiles = cleanNumber(milesInput)
//   const cleanedKm = cleanNumber(kmInput)

//   // Clear previous stored values first
//   req.session.data['exactMileage'] = ''
//   req.session.data['exactMileageMiles'] = ''
//   req.session.data['exactMileageKm'] = ''
//   req.session.data['enteredMileageValue'] = ''
//   req.session.data['enteredMileageUnit'] = ''
//   req.session.data['convertedMileageMiles'] = ''

//   if (mileageUnit === 'miles' && cleanedMiles !== '') {
//     // What the user entered
//     req.session.data['enteredMileageUnit'] = 'miles'
//     req.session.data['enteredMileageValue'] = cleanedMiles

//     // Canonical values
//     req.session.data['exactMileageMiles'] = cleanedMiles
//     req.session.data['exactMileage'] = cleanedMiles
//     req.session.data['convertedMileageMiles'] = cleanedMiles

//     return res.redirect('/b-eVED-screens/mileage-balance')
//   }

//   if (mileageUnit === 'kilometres' && cleanedKm !== '') {
//     const convertedMiles = String(Math.round(Number(cleanedKm) * 0.621371))

//     // What the user entered
//     req.session.data['enteredMileageUnit'] = 'kilometres'
//     req.session.data['enteredMileageValue'] = cleanedKm

//     // Keep original km as entered
//     req.session.data['exactMileageKm'] = cleanedKm

//     // Canonical miles value for calculations / next screens
//     req.session.data['exactMileageMiles'] = convertedMiles
//     req.session.data['exactMileage'] = convertedMiles
//     req.session.data['convertedMileageMiles'] = convertedMiles

//     return res.redirect('/b-eVED-screens/mileage-balance')
//   }

//   // Fallback if nothing valid entered
//   return res.redirect('/b-eVED-screens/do-you-know-exact-mileage')
// })

//Exact mileage

function formatNumber(n) {
  return Number(n).toLocaleString('en-GB')
}

router.post('/b-eVED-screens/mileage-answer', function (req, res) {
  const mileageUnit = req.session.data['mileageUnit']
  const milesInput = req.session.data['exactMileageMiles']
  const kmInput = req.session.data['exactMileageKm']

  const PREVIOUS_RECORDED = 38657

  function cleanNumber(value) {
    return String(value || '').replace(/[^0-9]/g, '')
  }

  const cleanedMiles = cleanNumber(milesInput)
  const cleanedKm = cleanNumber(kmInput)

  // Reset stored values
  req.session.data['exactMileage'] = ''
  req.session.data['exactMileageMiles'] = ''
  req.session.data['exactMileageKm'] = ''
  req.session.data['enteredMileageValue'] = ''
  req.session.data['enteredMileageUnit'] = ''
  req.session.data['convertedMileageMiles'] = ''

  // --- MILES PATH ---
  

if (mileageUnit === 'miles' && cleanedMiles !== '') {

  const numericMiles = Number(cleanedMiles)

  // STORE
  req.session.data['enteredMileageUnit'] = 'miles'
  req.session.data['enteredMileageValue'] = cleanedMiles

  req.session.data['exactMileageMiles'] = String(cleanedMiles)
  req.session.data['exactMileageMilesFormatted'] = formatNumber(cleanedMiles)

  // VALIDATE
  if (numericMiles < PREVIOUS_RECORDED) {
    return res.redirect('/b-eVED-screens/do-you-know-exact-mileage-error')
  }

  return res.redirect('/b-eVED-screens/mileage-balance')
}



  // --- KM PATH ---
  

if (mileageUnit === 'kilometres' && cleanedKm !== '') {

  const numericKm = Number(cleanedKm)
  const convertedMiles = Math.round(numericKm * 0.621371)

  // STORE
  req.session.data['enteredMileageUnit'] = 'kilometres'
  req.session.data['enteredMileageValue'] = cleanedKm

  req.session.data['enteredMileageValueFormatted'] = formatNumber(cleanedKm)

  req.session.data['exactMileageMiles'] = String(convertedMiles)
  req.session.data['exactMileageMilesFormatted'] = formatNumber(convertedMiles)

  // VALIDATE
  if (convertedMiles < PREVIOUS_RECORDED) {
    return res.redirect('/b-eVED-screens/do-you-know-exact-mileage-error')
  }

  return res.redirect('/b-eVED-screens/mileage-balance')
}



  // fallback
  return res.redirect('/b-eVED-screens/do-you-know-exact-mileage')
})



//Mileage balance


router.get('/b-eVED-screens/mileage-balance', function (req, res) {

  // Fixed values (hard coded as per requirements)
  const PREVIOUS_RECORDED = 38657
  const PREVIOUS_ESTIMATED = 7000
  const RATE_PER_MILE = 0.03

  // Pull current mileage from session (from your earlier screen)
  const currentMileage = Number(req.session.data['exactMileageMiles'])

  // If current mileage is missing or not a number, send them back
  if (!currentMileage || Number.isNaN(currentMileage)) {
    return res.redirect('/b-eVED-screens/do-you-know-exact-mileage')
  }

  // Calculations
  const mileageDriven = currentMileage - PREVIOUS_RECORDED
  const differenceFromEstimate = mileageDriven - PREVIOUS_ESTIMATED

  const isLess = differenceFromEstimate < 0
  const milesDifference = Math.abs(differenceFromEstimate)

  // Money calculation (to 2dp)
  const moneyValue = Number((milesDifference * RATE_PER_MILE).toFixed(2))

  // Store ONLY what you need later
  if (isLess) {
    req.session.data['creditValue'] = moneyValue
    delete req.session.data['costValue']
  } else {
    req.session.data['costValue'] = moneyValue
    delete req.session.data['creditValue']
  }

  // Format numbers for display (commas)
  const fmtNumber = (n) => Number(n).toLocaleString('en-GB')
  const fmtMoney = (n) => Number(n).toFixed(2)

  res.render('b-eVED-screens/mileage-balance', {
    isLess,

    // formatted display strings
    previousRecordedFmt: fmtNumber(PREVIOUS_RECORDED),
    previousEstimatedFmt: fmtNumber(PREVIOUS_ESTIMATED),
    currentMileageFmt: fmtNumber(currentMileage),
    mileageDrivenFmt: fmtNumber(mileageDriven),
    milesDifferenceFmt: fmtNumber(milesDifference),
    moneyValueFmt: fmtMoney(moneyValue)
  })
})

//Estitmate your mileage

router.post('/b-eVED-screens/estimate-your-miles-answer', function (req, res) {

  const mileageUnit = req.session.data['mileageUnit']
  const estimatedMileage = Number(req.session.data['estimatedMileageMiles'])

  const minimumMileage = mileageUnit === 'kilometres'
    ? 161
    : 100

  if (estimatedMileage < minimumMileage) {

    return res.render('b-eVED-screens/estimate-your-miles', {
      error: true,
      errorMessage: `Estimated mileage must be at least ${minimumMileage} ${mileageUnit}`
    })
  }

  req.session.data['estimatedMileage'] = estimatedMileage

  return res.redirect('/b-eVED-screens/your-payment-summary-Y2')
})

// router.post('/b-eVED-screens/estimate-your-miles-answer', function (req, res) {
//   const milesInput = req.session.data['estimatedMileageMiles']
//   const kmInput = req.session.data['estimatedMileageKm']

//   // Build one canonical value for later screens (in miles)
//   let estimatedMileage = ''

//   if (milesInput && String(milesInput).trim() !== '') {
//     // Keep digits only (prototype-friendly)
//     estimatedMileage = String(milesInput).replace(/[^0-9]/g, '')
//   } else if (kmInput && String(kmInput).trim() !== '') {
//     const cleanedKm = Number(String(kmInput).replace(/[^0-9.]/g, ''))
//     if (!Number.isNaN(cleanedKm)) {
//       estimatedMileage = String(Math.round(cleanedKm * 0.621371))
//     }
//   }

//   req.session.data['estimatedMileage'] = estimatedMileage

//   return res.redirect('/b-eVED-screens/your-payment-summary-Y2')
// })

// //Estitmate error

// router.post('/b-eVED-screens/estimate-your-miles-answer', function (req, res) {

//   const mileage = Number(req.body.estimatedMileageMiles)
//   const unit = req.session.data.mileageUnit

//   const minimumMileage = unit === 'kilometres' ? 161 : 100

//   if (!mileage || mileage < minimumMileage) {

//     return res.render('b-eVED-screens/estimate-your-miles', {
//       error: {
//         text: `Estimated mileage must be at least ${minimumMileage} ${unit}`
//       }
//     })
//   }

//   res.redirect('/b-eVED-screens/next-page')

// })

//Payment summary 

function toNumber(input) {
  if (input === undefined || input === null) return 0
  const cleaned = String(input).replace(/[^0-9.]/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : 0
}

function formatCurrencyGBP(amount) {
  return '£' + amount.toFixed(2)
}

router.get('/b-eVED-screens/your-payment-summary', function (req, res) {
  const data = req.session.data

  // Registration number
  data.vehicleRegistrationFormatted =
    formatNumberPlate(data.vehicleRegistration) ||
    data.vehicleRegistrationFormatted ||
    ''

  // Tax
  const taxLength = data.taxLength || '12'
  const taxCost = (taxLength === '6') ? 165.38 : 330.75
  const taxLengthLabel = (taxLength === '6') ? '6 months' : '12 months'

  // eVED
  const estimatedMiles = toNumber(data.estimatedMileage)
  const evedCost = estimatedMiles * 0.03

  // Total
  const totalCost = taxCost + evedCost
  data.totalCost = totalCost
  data.totalCostFormatted = formatCurrencyGBP(totalCost)

  // Store formatted values for the template
  data.taxCostFormatted = formatCurrencyGBP(taxCost)
  data.evedCostFormatted = formatCurrencyGBP(evedCost)
  data.totalCostFormatted = formatCurrencyGBP(totalCost)
  data.taxLengthLabel = taxLengthLabel

  // Render the page
  return res.render('b-eVED-screens/your-payment-summary', {
    data
  })
})

//Payment summary Y1

// Reuse your helpers
function toNumber(input) {
  if (input === undefined || input === null) return 0
  const cleaned = String(input).replace(/[^0-9.]/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : 0
}

function formatCurrencyGBP(amount) {
  return '£' + amount.toFixed(2)
}

router.get('/b-eVED-screens/your-payment-summary-Y2', function (req, res) {
  const data = req.session.data

  // Registration number
  data.vehicleRegistrationFormatted =
    formatNumberPlate(data.vehicleRegistration) ||
    data.vehicleRegistrationFormatted ||
    ''

  // Tax
  const taxLength = data.taxLength || '12'
  const taxCost = (taxLength === '6') ? 165.38 : 330.75
  const taxLengthLabel = (taxLength === '6') ? '6 months' : '12 months'

  // eVED base: mileage estimate cost
  const estimatedMiles = toNumber(data.estimatedMileage)
  const estimateCost = estimatedMiles * 0.03

  // Mileage adjustment from mileage-balance screen
  // (You stored ONE of these: creditValue OR costValue)
  const creditValue = toNumber(data.creditValue) // money amount
  const costValue = toNumber(data.costValue)     // money amount

  let evedCost = estimateCost

  if (creditValue > 0) {
    evedCost = estimateCost - creditValue
  } else if (costValue > 0) {
    evedCost = estimateCost + costValue
  }

  // Total
  const totalCost = taxCost + evedCost

  // Store values for template
  data.taxLengthLabel = taxLengthLabel
  data.taxCostFormatted = formatCurrencyGBP(taxCost)

  data.estimateCostFormatted = formatCurrencyGBP(estimateCost)

  // Only set the formatted label that applies
  if (creditValue > 0) {
    data.creditValueFormatted = formatCurrencyGBP(creditValue)
    delete data.costValueFormatted
  } else if (costValue > 0) {
    data.costValueFormatted = formatCurrencyGBP(costValue)
    delete data.creditValueFormatted
  } else {
    // If neither exists, clear both to avoid showing stale values
    delete data.creditValueFormatted
    delete data.costValueFormatted
  }

  data.evedCostFormatted = formatCurrencyGBP(evedCost)
  data.totalCostFormatted = formatCurrencyGBP(totalCost)

  return res.render('b-eVED-screens/your-payment-summary-Y2', { data })
})



// -------------------- Helpers --------------------
function toNumber(input) {
  if (input === undefined || input === null) return 0
  const cleaned = String(input).replace(/[^0-9.]/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : 0
}

function formatCurrencyGBP(amount) {
  return '£' + amount.toFixed(2)
}

// -------------------- Choose how to pay --------------------

// GET: Calculate amounts (pulling from session) and render the page
router.get('/c-payment-screens/choose-how-to-pay', function (req, res) {
  const data = req.session.data

  // Pull the total from payment summary (prefer numeric, fall back to formatted string)
  const total =
    toNumber(data.totalCost) ||
    toNumber(data.totalCostFormatted) ||
    0

  // // Apply 5% surcharge and round the TOTAL first (2dp) — as requested
  // const totalWithSurchargeRounded = Number((total * 1.05).toFixed(2))

  // // Split the rounded total
  // const ddMonthly12 = totalWithSurchargeRounded / 12
  // const ddTwiceYearly = totalWithSurchargeRounded / 2 // ✅ paid twice a year (2 payments)

 // Get selected tax length
const taxLength = Number(data.taxLength) || 12

// Monthly DD should match tax duration
const ddMonthlyAmount = total / taxLength

// 6-monthly DD remains two payments per year
const ddTwiceYearly = total / 2

  // Store display-ready values for the template
  data.paymentTotalFormatted = formatCurrencyGBP(total)

  // data.ddTotalWithSurchargeFormatted = formatCurrencyGBP(totalWithSurchargeRounded)
  data.ddTotalFormatted = formatCurrencyGBP(total)
  data.ddMonthlyAmountFormatted = formatCurrencyGBP(ddMonthlyAmount)
  data.ddTwiceYearlyAmountFormatted = formatCurrencyGBP(ddTwiceYearly)

  // Per your requirement: once every 12 months = same as total (no surcharge)
  data.ddEvery12AmountFormatted = formatCurrencyGBP(total)

  return res.render('c-payment-screens/choose-how-to-pay', { data })
})

// POST: Handle selection and redirect to correct next page
router.post('/c-payment-screens/choose-how-to-pay', function (req, res) {
  const data = req.session.data
  const method = data.paymentMethod

  if (method === 'card') {
    return res.redirect('/c-payment-screens/card-payment-details')
  }

  // Any Direct Debit option -> filler for now
  if (method === 'dd-monthly' || method === 'dd-6' || method === 'dd-12') {
    return res.redirect('/c-payment-screens/dd-payment-screens/pay-by-dd-redesign')
  }

  // Nothing selected -> show error
  data.paymentMethodError = true
  return res.redirect('/c-payment-screens/choose-how-to-pay')
})

// GET – show card payment details
router.get('/c-payment-screens/card-payment-details', function (req, res) {
  return res.render('c-payment-screens/card-payment-details')
})

// POST – no validation required, always continue
router.post('/c-payment-screens/card-payment-details', function (req, res) {
  return res.redirect('/d-confirmation-screens/card-confirmation-page')
})





//------------------------Contact details----------------------------

router.post('/c-payment-screens/contact-details', function (req, res) {
  const method = req.session.data.paymentMethod

  if (method === 'card') {
    return res.redirect('/d-confirmation-screens/card-confirmation-page')
  }

  if (
    method === 'dd-monthly' ||
    method === 'dd-6' ||
    method === 'dd-12'
  ) {
    return res.redirect('/d-confirmation-screens/DD-confirmation-page')
  }

  return res.redirect('/c-payment-screens/choose-how-to-pay')
})

