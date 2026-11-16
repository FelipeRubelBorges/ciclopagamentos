const express = require('express')
const { isObjectIdOrHexString } = require('mongoose')
const BillingCycle = require('./billingCycle')

const router = express.Router()
const writableFields = ['name', 'month', 'year', 'credits', 'debts']
const projectedFields = [...writableFields, '_id', '__v']
const filterFields = ['_id', 'name', 'month', 'year', '__v']
const notFound = { errors: ['Ciclo de pagamento não encontrado.'] }
const operators = new Map([
    ['equals', '$eq'], ['gte', '$gte'], ['gt', '$gt'], ['lte', '$lte'],
    ['lt', '$lt'], ['ne', '$ne'], ['in', '$in'], ['nin', '$nin']
])

function handle(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    }
}

function cycleData(body, fields = writableFields) {
    return Object.fromEntries(fields.filter(field => Object.hasOwn(body, field))
        .map(field => [field, body[field]]))
}

function describeFields(schema) {
    return Object.fromEntries(Object.entries(schema.paths).map(([key, type]) => [key, {
        path: type.path,
        instance: type.instance,
        isRequired: type.isRequired,
        ...(type.schema && { schema: describeFields(type.schema) })
    }]))
}

router.get('/schema', (req, res) => {
    res.json({
        resource: BillingCycle.modelName,
        allowed_methods: ['0', '1', '2', '3', '4'],
        list_uri: req.baseUrl.slice('/api'.length),
        detail_uri: req.baseUrl.slice('/api'.length) + '/:id',
        fields: describeFields(BillingCycle.schema)
    })
})

router.get('/count', handle(async (req, res) => {
    res.json({ value: await BillingCycle.countDocuments() })
}))

router.get('/', handle(async (req, res) => {
    const query = BillingCycle.find()
    for (const field of filterFields) {
        const conditions = {}
        for (const [operator, mongoOperator] of operators) {
            const param = operator === 'equals' ? req.query[field] : req.query[field + '__' + operator]
            if (typeof param === 'string') {
                conditions[mongoOperator] = operator === 'in' || operator === 'nin' ? param.split(',') : param
            }
        }
        if (Object.keys(conditions).length) query.where(field, conditions)
    }

    for (const [option, value] of [['skip', req.query.skip], ['limit', req.query.limit]]) {
        if (typeof value === 'string' && /^\d+$/.test(value) && Number.isSafeInteger(Number(value))) {
            query[option](Number(value))
        }
    }
    for (const option of ['sort', 'select']) {
        if (typeof req.query[option] !== 'string') continue
        const fields = req.query[option].split(/[ ,]+/)
            .filter(field => projectedFields.includes(field.replace(/^[+-]/, '')))
        if (fields.length) query[option](fields.join(' '))
    }

    res.json(await query)
}))

router.param('id', (req, res, next, id) => {
    if (!isObjectIdOrHexString(id)) return res.status(404).json(notFound)
    next()
})

router.get('/:id', handle(async (req, res) => {
    const cycle = await BillingCycle.findById(req.params.id)
    if (!cycle) return res.status(404).json(notFound)
    res.json(cycle)
}))

router.post('/', handle(async (req, res) => {
    const cycle = await BillingCycle.create(cycleData(req.body || {}, [...writableFields, '_id']))
    res.status(201).json(cycle)
}))

router.put('/:id', handle(async (req, res) => {
    const data = cycleData(req.body || {})
    if (!Object.keys(data).length) return res.status(400).json({ errors: ['Informe os campos para atualizar.'] })
    const cycle = await BillingCycle.findByIdAndUpdate(req.params.id, { $set: data }, {
        new: true,
        runValidators: true
    })
    if (!cycle) return res.status(404).json(notFound)
    res.json(cycle)
}))

router.delete('/:id', handle(async (req, res) => {
    const cycle = await BillingCycle.findByIdAndDelete(req.params.id)
    if (!cycle) return res.status(404).json(notFound)
    res.status(204).end()
}))

module.exports = router
