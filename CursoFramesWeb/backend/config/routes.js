const express = require('express')

module.exports = function (server) {

    //API Routes
    const router = express.Router()
    server.use('/api', router)

       //rotas da API
    const billinCycleService = require('../api/billingCycle/billingCycleService')
    billinCycleService.register(router, '/billingCycles')

    const billinCycleSummaryService = require('../api/billingSummary/billingSummaryService')
    router.route('/billingSummary').get(billinCycleSummaryService.getSummary)
}