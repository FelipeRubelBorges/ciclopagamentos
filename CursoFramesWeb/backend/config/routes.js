const express = require('express')
const billingCycles = require('../api/billingCycle/billingCycleService')
const { getSummary } = require('../api/billingSummary/billingSummaryService')

module.exports = function (server) {
    const router = express.Router()
    router.use('/billingCycles', billingCycles)
    router.get('/billingSummary', getSummary)
    server.use('/api', router)
}
