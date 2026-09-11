//_routes.js (v1 folder etc) //
//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes

const govukPrototypeKit = require("govuk-prototype-kit");

const router = govukPrototypeKit.requests.setupRouter();

// Add your routes here

//Number plate format
function formatNumberPlate(input) {
  if (!input) return ''

  // Keep letters/numbers only, uppercase
  const cleaned = String(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim()

  if (cleaned.length === 7) {
    return cleaned.slice(0, 4) + ' ' + cleaned.slice(4)
  }

  if (cleaned.length === 6) {
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3)
  }

  return cleaned
}

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

/*
// Legacy mileage routes retained for reference only.

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
    return res.redirect('/v1/b-eVED-screens/do-you-know-exact-mileage-error')
  }

  return res.redirect('/v1/b-eVED-screens/mileage-balance')
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

*/

// Do you have a V5c?
router.get("/a-starting-screens/start-page", function (request, response) {
  if (request.query.reset === "true") {
    request.session.data.exactMileage = '';
    request.session.data.exactMileageMiles = '';
    request.session.data.exactMileageKm = '';
    request.session.data.enteredMileageValue = '';
    request.session.data.enteredMileageUnit = '';
    request.session.data.convertedMileageMiles = '';
    request.session.data.estimatedMileage = 0;
    request.session.data.estimatedMileageMiles = 0;
    request.session.data.addedMileageEntries = [];
    request.session.data.showAddedMileageInset = false;
    delete request.session.data.creditValue;
    delete request.session.data.costValue;
  }

  return response.render("v1/a-starting-screens/start-page", { data: request.session.data });
});

router.get("/a-starting-screens/do-you-have-a-V5c", function (request, response) {
  if (request.query.reset === "true") {
    request.session.data.exactMileage = '';
    request.session.data.exactMileageMiles = '';
    request.session.data.exactMileageKm = '';
    request.session.data.enteredMileageValue = '';
    request.session.data.enteredMileageUnit = '';
    request.session.data.convertedMileageMiles = '';
    request.session.data.estimatedMileage = 0;
    request.session.data.estimatedMileageMiles = 0;
    request.session.data.addedMileageEntries = [];
    request.session.data.showAddedMileageInset = false;
    delete request.session.data.creditValue;
    delete request.session.data.costValue;
  }

  return response.render("v1/a-starting-screens/do-you-have-a-V5c", { data: request.session.data });
});

router.post("/a-starting-screens/do-you-have-a-V5c-answer", function (request, response) {
  if (request.session.data["v5c-radios"] === "yes") {
    return response.redirect("/v1/a-starting-screens/V5c-number");
  }

  return response.redirect("/v1/a-starting-screens/which-document-do-you-have");
});

//Doesn't have V11 reminder letter:
router.post('/a-starting-screens/which-document-do-you-have-answer', function (req, res) {
  const documentType = req.session.data['documentType']

  if (documentType === 'v5c-2') {
    return res.redirect('/v1/a-starting-screens/v5c-2')
  }

  if (documentType === 'no-docs') {
    return res.redirect('/v1/a-starting-screens/no-docs')
  }

  // If nothing selected, send them back
  return res.redirect('/v1/a-starting-screens/no-docs')
})

router.post('/a-starting-screens/v5c-2-answer', function (req, res) {
  const registration = req.body['vehicle-reg-2']

  req.session.data['vehicle-reg-2'] = registration
  req.session.data['vehicle-reg'] = registration
  req.session.data.registrationEntryPath = 'v5c-2'

  return res.redirect('/v1/a-starting-screens/check-vehicle-details?vehicle-reg=' +
    encodeURIComponent(registration || '') + '&source=v5c-2')
})

// Vehichle details
router.post("/b-eVED-screens/vehicle-details", function (request, response) {
  if (request.body["vehicle-reg"]) {
    request.session.data["vehicle-reg"] = request.body["vehicle-reg"];
  }
  if (request.body["registration-entry-path"] === "v5c-2") {
    request.session.data.registrationEntryPath = "v5c-2";
  } else {
    request.session.data.registrationEntryPath = "v5c-number";
  }

  return response.redirect("/v1/b-eVED-screens/do-you-know-exact-mileage");
});

// Mileage choice routing
function handleMileageChoice(request, response, noDestination, fromPaymentSummary) {
  const currentMileage = request.body.currentMileage || request.session.data["exactMileageMiles"];
  const addMoreMiles = request.body["add-more-miles"] || request.session.data["add-more-miles"];

  request.session.data["add-more-miles"] = addMoreMiles;
  request.session.data["showAddedMileageInset"] = fromPaymentSummary && addMoreMiles === "yes";

  if (currentMileage) {
    request.session.data["exactMileageMiles"] = currentMileage;
    request.session.data["exactMileage"] = currentMileage;
  }
  if (addMoreMiles === "yes") {
    return response.redirect("/v1/b-eVED-screens/estimate-your-miles?mileage=" + encodeURIComponent(currentMileage || ""));
  }

  return response.redirect(noDestination);
}

router.post("/b-eVED-screens/mileage-balance-answer", function (request, response) {
  const destination = "/v1/a-starting-screens/start-page";
  const currentMileage = request.body.currentMileage || request.session.data["exactMileageMiles"];
  const isInDebit = Number(currentMileage) > 36825 + 8000;

  if (request.body["add-more-miles"] === "no") {
    if (isInDebit) {
      return response.redirect("/v1/b-eVED-screens/your-payment-summary?currentMileage=" + encodeURIComponent(currentMileage || ""));
    }

    request.session.data.exactMileage = '';
    request.session.data.exactMileageMiles = '';
    request.session.data.exactMileageKm = '';
    request.session.data.enteredMileageValue = '';
    request.session.data.enteredMileageUnit = '';
    request.session.data.convertedMileageMiles = '';
    request.session.data.estimatedMileage = 0;
    request.session.data.estimatedMileageMiles = 0;
    request.session.data.addedMileageEntries = [];
    request.session.data.showAddedMileageInset = false;
    delete request.session.data.creditValue;
    delete request.session.data.costValue;

    return response.redirect(destination);
  }

  return handleMileageChoice(request, response, destination, false);
});

router.post("/b-eVED-screens/your-payment-summary-answer", function (request, response) {
  if (!request.body["add-more-miles"] && Number(request.session.data.estimatedMileage) > 0) {
    return response.redirect("/v1/c-payment-screens/confirmation-of-your-payment");
  }

  return handleMileageChoice(request, response, "/v1/c-payment-screens/confirmation-of-your-payment", true);
});

//Estitmate your mileage

router.get('/b-eVED-screens/estimate-your-miles', function (req, res) {
  if (req.query.reset === 'true') {
    req.session.data.estimatedMileage = ''
    req.session.data.estimatedMileageMiles = ''
    req.session.data.addedMileageEntries = []
    req.session.data.showAddedMileageInset = false
  }

  return res.render('v1/b-eVED-screens/estimate-your-miles', { data: req.session.data })
})

router.post('/b-eVED-screens/estimate-your-miles-answer', function (req, res) {

  const mileageInput = req.body.estimatedMileageMiles
  const currentMileage = req.body.currentMileage || req.session.data['exactMileageMiles']
  const estimatedMileage = Number(mileageInput)

  const minimumMileage = 100

  if (estimatedMileage < minimumMileage) {

    return res.render('v1/b-eVED-screens/estimate-your-miles', {
      error: true,
      errorMessage: `Estimated mileage must be at least ${minimumMileage} miles`,
      data: req.session.data
    })
  }

  req.session.data['estimatedMileageMiles'] = estimatedMileage
  if (currentMileage) {
    req.session.data['exactMileageMiles'] = currentMileage
    req.session.data['exactMileage'] = currentMileage
  }

  const existingEstimatedMileage = Number(req.session.data['estimatedMileage']) || 0
  const addedMileageEntries = Array.isArray(req.session.data['addedMileageEntries'])
    ? req.session.data['addedMileageEntries']
    : (existingEstimatedMileage > 0 ? [existingEstimatedMileage] : [])

  addedMileageEntries.push(estimatedMileage)
  req.session.data['addedMileageEntries'] = addedMileageEntries
  req.session.data['estimatedMileage'] = addedMileageEntries.reduce((total, miles) => total + Number(miles), 0)
  req.session.data['estimatedMileageFormatted'] = req.session.data['estimatedMileage'].toLocaleString('en-GB')
  req.session.data.addedMilesRemoved = false

  return res.redirect('/v1/b-eVED-screens/your-payment-summary?currentMileage=' + encodeURIComponent(currentMileage || ''))
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

  if (req.query.remove === 'true') {
    data.estimatedMileage = 0
    data.estimatedMileageMiles = 0
    data.estimatedMileageFormatted = ''
    data.addedMileageEntries = []
    data.addedMilesRemoved = true
  }

  const currentMileage = req.query.currentMileage || data.exactMileageMiles || data.exactMileage
  const purchasedMileage = 36825 + 8000
  const paidForMileage = 44825
  const debitMiles = Number(currentMileage) - purchasedMileage
  const addedMiles = Number(data.estimatedMileage) || 0

  if (currentMileage) {
    data.exactMileageMiles = currentMileage
    data.exactMileage = currentMileage
    data.exactMileageMilesFormatted = Number(currentMileage).toLocaleString('en-GB')
  }

  data.totalDebitMiles = debitMiles > 0 ? debitMiles + addedMiles : 0
  data.totalDebitCostFormatted = formatCurrencyGBP(data.totalDebitMiles * 0.03)

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
  const newEstimatedMileage = paidForMileage + estimatedMiles
  const debitMilesForCost = Math.max((Number(currentMileage) || 0) - purchasedMileage, 0)
  const totalMileage = debitMilesForCost + estimatedMiles
  const evedCost = totalMileage * 0.03
  data.totalMileage = totalMileage
  data.newEstimatedMileageFormatted = newEstimatedMileage.toLocaleString('en-GB')
  data.totalDebitCostFormatted = formatCurrencyGBP(evedCost)

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
  return res.render('v1/b-eVED-screens/your-payment-summary', {
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
router.get('/c-payment-screens/confirmation-of-your-payment', function (req, res) {
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

  return res.render('v1/c-payment-screens/confirmation-of-your-payment', { data })
})

// POST: Handle selection and redirect to correct next page
router.post('/c-payment-screens/confirmation-of-your-payment', function (req, res) {
  const data = req.session.data
  const emailConfirmation = req.body['email-confirmation'] || data['email-confirmation']

  if (emailConfirmation === 'yes') {
    data['email-confirmation'] = emailConfirmation
    return res.redirect('/v1/c-payment-screens/email-confirmation')
  }

  if (emailConfirmation === 'no') {
    data['email-confirmation'] = emailConfirmation
    return res.redirect('/v1/c-payment-screens/card-payment-details')
  }

  // Nothing selected -> show error
  data.emailConfirmationError = true
  return res.redirect('/v1/c-payment-screens/confirmation-of-your-payment')
})

router.get('/c-payment-screens/email-confirmation', function (req, res) {
  return res.render('v1/c-payment-screens/email-confirmation', { data: req.session.data })
})

router.post('/c-payment-screens/email-confirmation', function (req, res) {
  req.session.data.emailAddress = req.body.emailAddress
  return res.redirect('/v1/c-payment-screens/card-payment-details')
})

// GET – show card payment details
router.get('/c-payment-screens/card-payment-details', function (req, res) {
  return res.render('v1/c-payment-screens/card-payment-details', { data: req.session.data })
})

// POST – no validation required, always continue
router.post('/c-payment-screens/card-payment-details', function (req, res) {
  return res.redirect('/v1/d-confirmation-screens/card-confirmation-page')
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

  return res.redirect('/c-payment-screens/confirmation-of-your-payment')
})


module.exports = router;