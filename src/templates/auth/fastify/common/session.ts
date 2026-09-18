/**
 * session
 * sessionTest
 * testHelperAuth
 */


export const session = `import sessionAdapter from './session/connect-db.js'
import DbSessionStore from './session/connect-session-app.js'
import envConfig from '../../configs/envConfig.js'

export const sessionStore = new DbSessionStore({
  adapter: sessionAdapter
})

export const sessionConfig = {
  secret: envConfig.SessionSecret,
  store: sessionStore as any,
  cookieName: 'app.sid',
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: envConfig.Status === 'production',
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 30
  }
}`

export const sessionTest = `import { describe, it, beforeAll, expect } from 'vitest'
import { createTestApp } from './testHelpers/serverTest.help.js'
import { UserRole } from './authMiddlewares.js'
import type { FastifyInstance } from 'fastify'

describe('Session & CSRF Auth tests', () => {
  let app: FastifyInstance
  let cookiesDict: Record<string, string> = {}

  function updateCookies(resCookies?: Array<{ name: string; value: string }>) {
    if (resCookies) {
      for (const c of resCookies) {
        cookiesDict[c.name] = c.value
      }
    }
  }

  beforeAll(async () => {
    app = await createTestApp()
    const response = await app.inject({
      method: 'GET',
      url: '/csrf'
    })
    updateCookies(response.cookies)
  })

  it('should deny access if not authenticated', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/protected'
    })
    expect(res.statusCode).toBe(401)
  })

  it('should login successfully and set session', async () => {
    const user = { id: '123', email: 'test@test.com', role: UserRole.USER }
    const csrfToken = cookiesDict['XSRF-TOKEN'] ? decodeURIComponent(cookiesDict['XSRF-TOKEN']) : ''

    const res = await app.inject({
      method: 'POST',
      url: '/login',
      cookies: cookiesDict,
      headers: {
        'x-csrf-token': csrfToken
      },
      payload: { user }
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.payload)
    expect(body.success).toBe(true)

    updateCookies(res.cookies)
  })

  it('should allow access to protected route after login', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: cookiesDict
    })
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.payload)
    expect(body.success).toBe(true)
    expect(body.user.email).toBe('test@test.com')
  })

  it('should deny access to admin route for normal user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/admin',
      cookies: cookiesDict
    })
    expect(res.statusCode).toBe(403)
  })

  it('should allow access to admin route after admin login', async () => {
    const admin = { id: '456', email: 'admin@test.com', role: UserRole.ADMIN }
    const adminCookies: Record<string, string> = {}

    const init = await app.inject({
      method: 'GET',
      url: '/csrf'
    })
    if (init.cookies) {
      for (const c of init.cookies) adminCookies[c.name] = c.value
    }
    const adminCsrf = adminCookies['XSRF-TOKEN'] ? decodeURIComponent(adminCookies['XSRF-TOKEN']) : ''

    const loginRes = await app.inject({
      method: 'POST',
      url: '/login',
      cookies: adminCookies,
      headers: {
        'x-csrf-token': adminCsrf
      },
      payload: { user: admin }
    })
    if (loginRes.cookies) {
      for (const c of loginRes.cookies) adminCookies[c.name] = c.value
    }

    const res = await app.inject({
      method: 'GET',
      url: '/admin',
      cookies: adminCookies
    })
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.payload)
    expect(body.success).toBe(true)
  })

  it('should logout successfully', async () => {
    const csrfToken = cookiesDict['XSRF-TOKEN'] ? decodeURIComponent(cookiesDict['XSRF-TOKEN']) : ''

    const logoutRes = await app.inject({
      method: 'POST',
      url: '/logout',
      cookies: cookiesDict,
      headers: {
        'x-csrf-token': csrfToken
      }
    })

    expect(logoutRes.statusCode).toBe(200)
    const body = JSON.parse(logoutRes.payload)
    expect(body.success).toBe(true)

    updateCookies(logoutRes.cookies)

    const protectedRes = await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: cookiesDict
    })
    expect(protectedRes.statusCode).toBe(401)
  })
})`
export const testHelperAuth = `import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import { sessionConfig } from '../session.js'
import { csrfProtection, setCsrfToken, verifyCsrfToken, isAuthenticated, authorize, UserRole, Auth, SessionUser } from '../authMiddlewares.js'
import { errorHandler } from '../../../configs/errors.js'

export async function createTestApp() {
  const app = Fastify({ logger: false })
  app.setErrorHandler(errorHandler)

  await app.register(fastifyCookie)
  await app.register(fastifySession, sessionConfig)

  app.addHook('preHandler', csrfProtection)
  app.addHook('preHandler', setCsrfToken)
  app.addHook('preHandler', verifyCsrfToken)

  app.post('/login', async (req, reply) => {
    const { user } = req.body as { user: SessionUser }
    await Auth.login(req, user)
    return reply.status(200).send({ success: true, message: 'Logged in' })
  })

  app.post('/logout', async (req, reply) => {
    await Auth.logout(req)
    return reply.status(200).send({ success: true, message: 'Logged out' })
  })

  app.get('/csrf', async (req, reply) => {
    return reply.status(200).send({ success: true, message: 'CSRF token set' })
  })

  app.get('/protected', { preHandler: [isAuthenticated] }, async (req, reply) => {
    return reply.status(200).send({ success: true, message: 'Passed middleware', user: req.session.user })
  })

  app.get('/admin', { preHandler: [authorize(UserRole.ADMIN)] }, async (req, reply) => {
    return reply.status(200).send({ success: true, message: 'Passed middleware' })
  })

  await app.ready()
  return app
}`