const BillingCycle = require('../billingCycle/billingCycle')

async function getSummary(req, res, next) {
    try {
        const [summary] = await BillingCycle.aggregate([
            { $project: { credit: { $sum: '$credits.value' }, debt: { $sum: '$debts.value' } } },
            { $group: { _id: null, credit: { $sum: '$credit' }, debt: { $sum: '$debt' } } },
            { $project: { _id: 0, credit: 1, debt: 1 } }
        ])
        res.json(summary ?? { credit: 0, debt: 0 })
    } catch (error) {
        next(error)
    }
}

module.exports = { getSummary }
