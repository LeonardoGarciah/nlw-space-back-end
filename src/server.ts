import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()
const port = 3600

app.register(cors, {
  origin: true,
})

app.register(memoriesRoutes)

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`👀 Server running on http://localhost:${port}`)
  })
