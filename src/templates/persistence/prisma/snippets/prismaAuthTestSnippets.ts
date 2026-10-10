
export const prismaAuthTestSnippet =`import * as db from '../../configs/database.js'

describe('Auth Integration Tests', () => {
  let server: FastifyInstance

  beforeAll(async() => {
    await db.startUp(true)
    await testUsersSeed()
    server = await createAuthTestServer()
  })

  afterAll(async() => {
    if (server) await server.close()
    await db.closeDatabase()
  })`