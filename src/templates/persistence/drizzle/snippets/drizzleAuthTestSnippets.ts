
export const drizzleAuthTestSnippet =`import * as db from '../../configs/database.js'
import { user as userSchema } from '../../schemas/user.schema.js'

describe('Auth Integration Tests', () => {
  let server: FastifyInstance

  beforeAll(async() => {
    await db.startUp()
    await db.db.delete(userSchema)
    await testUsersSeed()
    server = await createAuthTestServer()
  })

  afterAll(async() => {
    if (server) await server.close()
    await db.closeDatabase()
  })`