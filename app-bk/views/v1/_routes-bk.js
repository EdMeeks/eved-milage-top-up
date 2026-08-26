//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes

const govukPrototypeKit = require("govuk-prototype-kit");

const router = govukPrototypeKit.requests.setupRouter();

// Add your routes here

//Do you have a V11 route:
router.post('/a-starting-screens/do-you-have-a-V11-reminder-answer', function (req, res) {
  const hasV11 = req.session.data['hasV11']

  if (hasV11 === 'yes') {
    return res.redirect('../v1/a-starting-screens/V11-letter.html')
  }

  return res.redirect('../v1/a-starting-screens/which-document-do-you-have.html')
})


router.post("/conditional/children", function (request, response) {
    if (request.session.data["young-persons-name"] == "Billy Marshall Linn") {
        response.redirect("../child-registration-date");
    } else if (request.session.data["young-persons-name"] == "Emily Marshall Linn") {
        response.redirect("../start-date-entry")
    } else {
        response.redirect("../not-listed");
    }
});

router.post("/conditional/child-registration-date", function (request, response) {
    if (request.session.data["reg-date-radio"] == "Yes") {
        response.redirect("../child-registration-date");
    } else {
        response.redirect("../cannot-continue");
    }
});

/* ABOUT YOUNG PERSON */
router.post("/conditional/start-date-entry", function (request, response) {
    if (request.session.data["start-date-radio"] == "Yes") {
        response.redirect("../start-date-entry");
    } else {
        response.redirect("../cannot-continue");
    }
});

/* START DATE */
router.post("/conditional/end-date-entry", function (request, response) {
    if (request.session.data["end-date-radio"] == "Yes") {
        response.redirect("../end-date-entry");
    } else {
        response.redirect("../cannot-continue");
    }
});

/* REG DATE (if 18-19) */
router.post("/conditional/reg-date", function (request, response) {
    if (request.session.data["reg-date"] == "Yes") {
        response.redirect("../start-date-entry");
    } else {
        response.redirect("../cannot-continue-child-registration-date");
    }
});


/* END DATE */
router.post("/conditional/location-course-select", function (request, response) {
    if (request.session.data["young-persons-name"] == "Billy Marshall Linn") {
        response.redirect("../country-location-course");
    } else {
        response.redirect("../country-location-course");
    }
});

// Education Course BK
router.post("/conditional/live-with-you", function (request, response) {
    const study = request.session.data["how-will-study"];
    if (study == "Yes, full-time study" || study == "Reduced hours due to illness or disability") {
        response.redirect("../education-course-young-persons-employer");
    } else {
        response.redirect("../cannot-continue");
    }
});

router.post("/conditional/select-course", function (request, response) {
    const location = request.session.data["select-location"];
    if (location == "England" || location == "Scotland" || location == "Wales" || location == "Northern Ireland") {
        response.redirect("../select-course");
    } else if (location == "The EU, Switzerland, Norway, Iceland or Liechtenstein" || location == "Another country") {
        response.redirect("../hm-forces");
    }
    else {
        response.redirect("../select-location");
    }
});

router.post("/conditional/select-course-option", function (request, response) {
    const location = request.session.data["input-autocomplete"];
    if (location == "Employability fund programme" || location == "No One Left Behind" || location == "Foundation Apprenticeships" || location == "Traineeships" || location == "Jobs growth+ scheme" || location == "Training for success" || location == "PEACEPLUS Youth programme 3.2" || location == "Skills for life and work") {
        response.redirect("../live-with-you");
    } else if (location == "Course not listed") {
        response.redirect("../what-college-or-sixth-form");
    } else {
        response.redirect("../education-course");
    }
});

// Education Course BK
router.post("/conditional/live-with-you", function (request, response) {
    const study = request.session.data["how-will-study"];
    if (study == "Yes, full-time study" || study == "Reduced hours due to illness or disability") {
        response.redirect("../live-with-you");
    } else {
        response.redirect("../cannot-continue");
    }
});

// Edcation Course
router.post("/conditional/education-course-reduced-hours-illness-or-disability", function (request, response) {
    if (request.session.data["how-will-study"] == "Yes, more than 12 hours per week") {
        response.redirect("../live-with-you");
    } else if (request.session.data["how-will-study"] == "No, 12 hours or less on average per week") {
        response.redirect("../education-course-reduced-hours-illness-or-disability");
    } else {
        response.redirect("../cannot-continue");
    }
});

// Is the young person studying reduced hours due to illness or disability?
router.post("/conditional/illness-or-disability", function (request, response) {
    if (request.session.data["illness-or-disability"] == "Yes") {
        response.redirect("../live-with-you");
    } else {
        response.redirect("../cannot-continue-education-course-reduced-hours-illness-or-disability");
    }
});

// Is the course provided by the young person's employer?
router.post("/conditional/young-persons-employer", function (request, response) {
    if (request.session.data["young-persons-employer"] == "No") {
        response.redirect("../education-course");
    } else {
        response.redirect("../cannot-continue-education-course-young-persons-employer");
    }
});

/* YOUNG PERSON LIVE WITH YOU */
router.post("/conditional/living-arrangements", function (request, response) {
    if (request.session.data["live-with-you"] == "No") {
        response.redirect("../where-is-the-young-person-living");
    } else {
        response.redirect("../notifcations");
    }
});

/* WHO DOES YOUNG PERSON LIVE WITH */
router.post("/conditional/who-does-the-young-person-live-with", function (request, response) {
    if (request.session.data["live-with-friend"] == "Other") {
        response.redirect("../who-does-the-young-person-live-with");
    } else {
        response.redirect("../notifcations");
    }
});

/* TELEPHONE OPT-IN */
router.post("/conditional/telephone-number-opt-in", function (request, response) {
    if (request.session.data["receive-text-messages"] == "Yes") {
        response.redirect("../telephone-number-input");

    } else {
        response.redirect("../check-your-answers");
    }
});

 
 router.post("/conditional/partner-claim", function (request, response) {
  if (request.session.data["partner-with-you"] == "Yes") {
    response.redirect("../partner-claim");
   } else {
      response.redirect("../type-of-study");
   }
 });

router.post("/conditional/telephone-number-input", function (request, response) {
    if (request.session.data["receive-text-messages"] == "Yes") {
        response.redirect("../telephone-number-input");
    } else {
        response.redirect("../partner-lives");
    }
});

router.post("/conditional/receive-text-messages", function (request, response) {
    if (request.session.data["young-persons-name"] == "Young person not listed") {
        response.redirect("../not-listed");
    } else {
        response.redirect("../receive-text-messages");
    }
});


router.post("/conditional/type-of-study", function (request, response) {
  if (request.session.data["young-persons-name"] == "Young person not listed") {
    response.redirect("../not-listed");
  } else {
    response.redirect("../type-of-study");
  }
});

router.post("/conditional/education-course", function (request, response) {
  if (request.session.data["young-persons-education"] == "Full-time non-advanced education course") {
    response.redirect("../education-course");
  } else {
    response.redirect("../location-training");
  }
});

router.post("/conditional/location-course", function (request, response) {
  if (request.session.data["how-will-study"] == "Full-time study") {
    response.redirect("../location-course");
  } else {
    response.redirect("../cannot-continue");
  }
});

router.post("/conditional/non-advanced-courses", function (request, response) {
  const location = request.session.data["select-location"];

  if (location == "England" || location == "Wales" || location == "Northern Ireland") {
    response.redirect("../non-advanced-courses");
  } else if (location == "Scotland") {
    response.redirect("../scotland-course")
  } else if (location == "The EU, Switzerland, Norway, Iceland or Liechtenstein") {
    response.redirect("../hm-forces")
  } else {
    response.redirect("../eu-other-hm-forces");
  }
});

router.post("/conditional/scotland-training", function (request, response) {
  if (request.session.data["select-location"] == "Scotland") {
    response.redirect("../scotland-training");
  } else if (request.session.data["select-location"] == "Wales") {
    response.redirect("../wales-training")
  } else if (request.session.data["select-location"] == "Northern Ireland") {
    response.redirect("../northern-ireland-training")    
  } else {
    response.redirect("../cannot-continue");
  }
});

router.post("/conditional/live-with-you-in-uk", function (request, response) {
  if (request.session.data["training-course"] == "Other") {
      response.redirect("../what-college-or-sixth-form");
  } else  {
    response.redirect("../live-with-you-in-uk")
  }
});

router.post("/conditional/non-advanced-select-course", function (request, response) {
  if (request.session.data["studying-non-advanced-courses"] == "Yes") {
    response.redirect("../non-advanced-select-course");
  } else {
    response.redirect("../what-course");
  }
});

router.post("/conditional/scotland-select-course", function (request, response) {
  if (request.session.data["scotland-non-advanced-courses"] == "Yes") {
    response.redirect("../scotland-select-course");
  } else {
    response.redirect("../what-course");
  }
});

router.post("/conditional/hm-non-advanced-courses", function (request, response) {
  if (request.session.data["member-hm-forces"] == "Yes") {
    response.redirect("../non-advanced-courses");
  } else {
    response.redirect("../all-non-advanced-courses");
  }
});

router.post("/conditional/all-non-advanced-select-course", function (request, response) {
  if (request.session.data["studying-non-advanced-courses"] == "Yes, an English, Welsh or Northern Irish course") {
    response.redirect("../eu-non-advanced-select-course");
   } else if (request.session.data["studying-non-advanced-courses"] == "Yes, a Scottish course") {
      response.redirect("../eu-scotland-select-course")    
    } else {
      response.redirect("../eu-what-course");
    }
});


router.post("/conditional/live-expected-dates", function (request, response) {
  if (request.session.data["live-with-you"] == "Yes") {
    response.redirect("../expected-dates");
  } else {
    response.redirect("../live-away");
  }
});


router.post("/conditional/expected-dates", function (request, response) {
  if (request.session.data["live-away"] == "Yes") {
    response.redirect("../expected-dates");
  } else {
    response.redirect("../cannot-continue");
  }
});

router.post("/conditional/hm-yes-select-location", function (request, response) {
  if (request.session.data["member-hm-forces"] == "No") {
   response.redirect("../live-away")
  } else {
    response.redirect("../home-educated")
  }
 })

 router.post("/conditional/educated-before-16", function (request, response) {
  if (request.session.data["person-home-educated"] == "Yes") {
    response.redirect("../educated-before-16");
  } else {
  response.redirect("../live-with-you-in-uk");
 }
});

router.post("/conditional/before-16-expected-dates", function (request, response) {
  if (request.session.data["live-with-you"] == "Yes") {
    response.redirect("../expected-dates");
  } else {
  response.redirect("../live-away");
 }
});

router.post("/conditional/living-with-friend", function (request, response) {
  if (request.session.data["eu-live-away"] == "Yes") {
    response.redirect("../living-with-friend");
  } else {
  response.redirect("../cannot-continue");
 }
});

router.post("/conditional/educational-exchange", function (request, response) {
  if (request.session.data["eu-other-live-away"] == "Yes") {
    response.redirect("../educational-exchange");
  } else {
  response.redirect("../cannot-continue");
 }
});

router.post("/conditional/other-expected-dates", function (request, response) {
  if (request.session.data["educational-exchange"] == "Yes") {
    response.redirect("../expected-dates");
  } else {
  response.redirect("../cannot-continue");
 }
});


router.post("/conditional/eu-other-all-non-advanced-courses", function (request, response) {
  if (request.session.data["other-hm-forces"] == "Yes") {
    response.redirect("../non-advanced-courses");
  } else {
    response.redirect("../eu-other-all-non-advanced-courses");
  }
});


router.post("/conditional/eu-other-non-advanced-select-courses", function (request, response) {
  if (request.session.data["non-advanced-courses"] == "Yes, an English, Welsh or Northern Irish course") {
    response.redirect("../eu-other-non-advanced-select-courses");
  } else if (request.session.data["non-advanced-courses"] == "Yes, a Scottish course") {
    response.redirect("../eu-other-scotland-select-course")    
  } else {
    response.redirect("../eu-other-what-course");
  }
});


module.exports = router;