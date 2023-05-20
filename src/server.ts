import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const prisma = new PrismaClient()

const port = 3600

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  return users
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`👀 Servidor online http://localhost:${port}`)
  })
