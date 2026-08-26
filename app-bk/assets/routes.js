/
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//
const util = require('util')
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

router.use("/v1", require("./views/v1/_routes"));
