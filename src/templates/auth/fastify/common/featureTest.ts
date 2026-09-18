/**
 * integrationTest1 
 * integrationTest2 
 * featureTestHelper 
 */
export const integrationTest1 = `import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import session from 'supertest'
import serverAuth, {
  testUsersSeed,
  mockUser,
  mockAdmin,
  mockDisabled,
  getUserid
} from './testHelpers/serverAuth.help.js'
import { startUp, closeDatabase } from '../../configs/database.js'

function getCsrfToken(res: any): string {
  const setCookie = res.get('Set-Cookie')
  if (!setCookie) return ''
  const csrfCookie = setCookie.find((c: string) => c.includes('XSRF-TOKEN'))
  if (!csrfCookie) return ''
  const rawToken = csrfCookie.split('=')[1].split(';')[0]
  return decodeURIComponent(rawToken)
}`

export const integrationTest2 = `afterAll(async () => {
    await db.closeDatabase()
  })

  describe('1. CSRF Protection Integration', () => {
    it('should generate an XSRF-TOKEN cookie on initial GET request', async () => {
      const agent = new TestAgent(server)
      const res = await agent.get('/test/csrf')
      expect(res.status).toBe(200)
      expect(res.body.ok).toBe(true)

      const token = agent.csrfToken
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
    })

    it('should reject POST /test/login if x-csrf-token header is missing', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')

      const res = await agent.post('/test/login', mockUser)
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('CSRF_DETECTED')
    })

    it('should reject POST /test/login if x-csrf-token header is invalid', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')

      const res = await agent.post('/test/login', mockUser, { 'x-csrf-token': 'invalid-token-12345' })
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('CSRF_DETECTED')
    })

    it('should accept POST /test/login when valid x-csrf-token is provided', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      const res = await agent.post('/test/login', mockUser, { 'x-csrf-token': token })
      expect(res.status).toBe(200)
      expect(res.body.email).toBe(mockUser.email)
    })

    it('should reject POST /test/login if x-csrf-token is passed via query string', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      const res = await agent.post(\`/test/login?_csrf=\${token}\`, mockUser)
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('CSRF_DETECTED')
    })
  })

  describe('2. Authentication Flow (/login, /me, /logout)', () => {
    it('should login successfully with valid credentials and set session cookies', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      const res = await agent.post('/test/login', mockUser, { 'x-csrf-token': token })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        id: getUserid(),
        email: mockUser.email,
        role: 'USER'
      })

      expect(agent.cookies['logged_in']).toBe('true')
      expect(agent.cookies['app.sid']).toBeDefined()
    })

    it('should return session user info on GET /test/me when authenticated', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      await agent.post('/test/login', mockUser, { 'x-csrf-token': token })

      const meRes = await agent.get('/test/me')
      expect(meRes.status).toBe(200)
      expect(meRes.body).toEqual({
        id: getUserid(),
        email: mockUser.email,
        role: 'USER'
      })
    })

    it('should deny GET /test/me when not authenticated', async () => {
      const agent = new TestAgent(server)
      const res = await agent.get('/test/me')
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('ACCESS_DENIED')
    })

    it('should logout successfully, clear cookies and destroy session', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      await agent.post('/test/login', mockUser, { 'x-csrf-token': token })

      const checkBefore = await agent.get('/test/me')
      expect(checkBefore.status).toBe(200)

      const logoutRes = await agent.post('/test/logout', undefined, { 'x-csrf-token': token })
      expect(logoutRes.status).toBe(200)
      expect(logoutRes.body).toBe('Sesión cerrada')

      const checkAfter = await agent.get('/test/me')
      expect(checkAfter.status).toBe(403)
      expect(checkAfter.body.ok).toBe(false)
      expect(checkAfter.body.code).toBe('ACCESS_DENIED')
    })
  })

  describe('3. Permissions & RBAC Authorization', () => {
    it('should allow normal USER to access isAuthenticated protected route', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      await agent.post('/test/login', mockUser, { 'x-csrf-token': token })

      const res = await agent.get('/test/protected')
      expect(res.status).toBe(200)
      expect(res.body.ok).toBe(true)
      expect(res.body.user.role).toBe('USER')
    })

    it('should deny USER access to admin-only route (/test/admin-only)', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      await agent.post('/test/login', mockUser, { 'x-csrf-token': token })

      const res = await agent.get('/test/admin-only')
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('FORBIDDEN')
    })

    it('should deny USER access to min-admin route (/test/min-admin)', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      await agent.post('/test/login', mockUser, { 'x-csrf-token': token })

      const res = await agent.get('/test/min-admin')
      expect(res.status).toBe(403)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('ROLE_NOT_ALLOWED')
    })

    it('should allow ADMIN user to access admin-only and min-admin routes', async () => {
      const adminAgent = new TestAgent(server)
      await adminAgent.get('/test/csrf')
      const token = adminAgent.csrfToken

      const loginRes = await adminAgent.post('/test/login', mockAdmin, { 'x-csrf-token': token })
      expect(loginRes.status).toBe(200)
      expect(loginRes.body.role).toBe('ADMIN')

      const adminOnlyRes = await adminAgent.get('/test/admin-only')
      expect(adminOnlyRes.status).toBe(200)
      expect(adminOnlyRes.body.ok).toBe(true)

      const minAdminRes = await adminAgent.get('/test/min-admin')
      expect(minAdminRes.status).toBe(200)
      expect(minAdminRes.body.ok).toBe(true)
    })

    it('should deny unauthenticated user access to protected and admin routes', async () => {
      const unauthAgent = new TestAgent(server)

      const resProtected = await unauthAgent.get('/test/protected')
      expect(resProtected.status).toBe(401)
      expect(resProtected.body.code).toBe('UNAUTHORIZED')

      const resAdmin = await unauthAgent.get('/test/admin-only')
      expect(resAdmin.status).toBe(401)
      expect(resAdmin.body.code).toBe('UNAUTHORIZED')
    })
  })

  describe('4. Corner Cases & Edge Cases', () => {
    it('should fail login when password is incorrect with error code INVALID_CREDENTIALS', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      const res = await agent.post('/test/login', { email: mockUser.email, password: 'WrongPassword123' }, { 'x-csrf-token': token })
      expect(res.status).toBe(400)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('INVALID_CREDENTIALS')
    })

    it('should fail login when user email does not exist with identical INVALID_CREDENTIALS code', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      const res = await agent.post('/test/login', { email: 'nonexistent@domain.com', password: 'L1234567' }, { 'x-csrf-token': token })
      expect(res.status).toBe(400)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('INVALID_CREDENTIALS')
    })

    it('should fail login when user account is disabled with identical INVALID_CREDENTIALS code', async () => {
      const agent = new TestAgent(server)
      await agent.get('/test/csrf')
      const token = agent.csrfToken

      const res = await agent.post('/test/login', mockDisabled, { 'x-csrf-token': token })
      expect(res.status).toBe(400)
      expect(res.body.ok).toBe(false)
      expect(res.body.code).toBe('INVALID_CREDENTIALS')
    })

    it('should handle session isolation between different agents', async () => {
      const agent1 = new TestAgent(server)
      const agent2 = new TestAgent(server)

      await agent1.get('/test/csrf')
      await agent2.get('/test/csrf')

      await agent1.post('/test/login', mockUser, { 'x-csrf-token': agent1.csrfToken })
      await agent2.post('/test/login', mockAdmin, { 'x-csrf-token': agent2.csrfToken })

      const res1 = await agent1.get('/test/admin-only')
      expect(res1.status).toBe(403)

      const res2 = await agent2.get('/test/admin-only')
      expect(res2.status).toBe(200)
    })
  })
})
`
export const featureTestHelper = `import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import { errorHandler } from '../../../configs/errors.js'
import { sessionConfig } from '../../../shared/auth/session.js'
import {
  csrfProtection,
  setCsrfToken,
  verifyCsrfToken,
  isAuthenticated,
  authorize,
  authorizeMinRole,
  UserRole,
  Auth
} from '../../../shared/auth/authMiddlewares.js'
import { userService } from '../../../shared/dependencies.js'
import authRouter from '../auth.routes.js'

export async function createAuthTestServer() {
  const server = Fastify({ logger: false })
  server.setErrorHandler(errorHandler)

  await server.register(fastifyCookie)
  await server.register(fastifySession, sessionConfig)

  server.addHook('preHandler', csrfProtection)
  server.addHook('preHandler', setCsrfToken)
  server.addHook('preHandler', verifyCsrfToken)

  server.get('/test/csrf', async (request, reply) => {
    return reply.status(200).send({ ok: true, message: 'CSRF token initialized' })
  })

  await server.register(authRouter, { prefix: '/test' })

  server.get('/test/protected', { preHandler: [isAuthenticated] }, async (request, reply) => {
    return reply.status(200).send({ ok: true, message: 'Passed isAuthenticated', user: Auth.getSessionUser(request) })
  })

  server.get('/test/admin-only', { preHandler: [authorize(UserRole.ADMIN)] }, async (request, reply) => {
    return reply.status(200).send({ ok: true, message: 'Passed authorize ADMIN' })
  })

  server.get('/test/min-admin', { preHandler: [authorizeMinRole(UserRole.ADMIN)] }, async (request, reply) => {
    return reply.status(200).send({ ok: true, message: 'Passed authorizeMinRole ADMIN' })
  })

  await server.ready()
  return server
}

export const mockUser = { email: 'usertest@gmail.com', password: 'L1234567' }
export const mockAdmin = { email: 'admintest@gmail.com', password: 'L1234567' }
export const mockDisabled = { email: 'disabledtest@gmail.com', password: 'L1234567' }

let userId: string
let adminId: string
let disabledId: string

export async function testUsersSeed() {
  const userCreated = await userService.registerUser(mockUser)
  userId = userCreated.id

  const adminCreated = await userService.registerUser(mockAdmin)
  adminId = adminCreated.id
  await userService.upgradeUser(adminId, { role: 'ADMIN', enabled: true })

  const disabledCreated = await userService.registerUser(mockDisabled)
  disabledId = disabledCreated.id
  await userService.upgradeUser(disabledId, { role: 'USER', enabled: false })
}

export const getUserid = (): string => userId
export const getAdminid = (): string => adminId
export const getDisabledid = (): string => disabledId`