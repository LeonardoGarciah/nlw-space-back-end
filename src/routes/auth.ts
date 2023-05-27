import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import axios from 'axios'
import 'dotenv/config'
import prisma from '../lib/prisma'
import UserAgent from 'useragent'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (req, res) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const deviceType = req.headers['x-device-type']

    let GITHUB_CLIENT_ID
    let GITHUB_CLIENT_SECRET

    if (deviceType === 'mobile') {
      GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID_MOBILE
      GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET_MOBILE
    } else if (deviceType === 'web') {
      GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID_WEB
      GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET_WEB
    }

    const { code } = bodySchema.parse(req.body)
    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const { access_token } = accessTokenResponse.data
    console.log('access_token', access_token)
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
