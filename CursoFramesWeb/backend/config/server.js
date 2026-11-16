const express = require('express')
const server = express()

server.disable('x-powered-by')
server.set('query parser', 'simple')
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
require('./routes')(server)

server.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    if (error.name === 'ValidationError') {
        return res.status(400).json({ errors: Object.values(error.errors).map(item => item.message) })
    }
    if (error.name === 'CastError') {
        return res.status(400).json({ errors: ['Valor inválido.'] })
    }
    if (error.code === 11000) {
        return res.status(409).json({ errors: ['Ciclo de pagamento já existe.'] })
    }
    if (error.status >= 400 && error.status < 500) {
        return res.status(error.status).json({ errors: ['Requisição inválida.'] })
    }
    console.error(error)
    res.status(500).json({ errors: ['Erro interno do servidor.'] })
})

module.exports = server
