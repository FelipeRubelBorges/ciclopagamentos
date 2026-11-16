const connect = require('./config/database')
const server = require('./config/server')

async function start() {
    await connect()
    const port = process.env.PORT || 3003
    const host = process.env.HOST || '127.0.0.1'
    server.listen(port, host, () => {
        console.log(`BACKEND is running on ${host}:${port}.`)
    })
}

start().catch(error => {
    console.error('Não foi possível iniciar o backend:', error.message)
    process.exitCode = 1
})
