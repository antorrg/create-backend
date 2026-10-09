
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import envConfig from './envConfig.js'
import * as db from './database.js'


describe('EnvDb test', () => { 
  beforeAll(async() => {
  await db.startUp()
  })
  afterAll(async() => {
    await db.closeDatabase()
  })
  describe('Environment variables', () => {
    it('should return the correct environment status and database variable', () => { 
      const formatEnvInfo = `App running in: ${envConfig.Status}`+
      `Testing database: ${nameOfDb(envConfig.DatabaseUrl)}`
      expect(formatEnvInfo).toBe(
        'App running in: test'+
        'Testing database: vgametest'
      )
    })
  })
  describe('Database existence', () => {
    it('should query tables and return an empty array', async () => {
      const results = await Promise.all([
        db.db.select().from(user),
        db.db.select().from(log),
        
      ])
      results.forEach((result) => {
        expect(Array.isArray(result)).toBe(true)
      })
    })
  })
})
    
})

function nameOfDb(url:string): string {
  if (!url) return 'unknown'
  const parts = url.split('/')
  return parts[parts.length - 1] || 'unknown'
}
 