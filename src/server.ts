import fastify from 'fastify'

const app = fastify()

const port = 3000

app.get('/', (req, res) => {
  return 'Hello world'
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`👀 Servidor online http://localhost:${port}`)
  })
