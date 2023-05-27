import fastify from 'fastify'
import 'dotenv/config'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'

const app = fastify()
const port = 3600

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: process.env.JWT_SECRET,
})

app.register(memoriesRoutes)
app.register(authRoutes)

app
  .listen({
    host: '0.0.0.0',
    port,
  })
  .then(() => {
    console.log(`👀 Server running on http://localhost:${port}`)
  })
