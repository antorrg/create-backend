
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import envConfig from './envConfig.js'
import * as db from './database.js'


describe('EnvDb test', () => { 
  beforeAll(async() => {
  await db.startUp(true, true)
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
    it('should query tables and return an empty array', async() => { 
      const models = [ 
        db.Log,
        db.User,
        
        ]
      for (const model of models) {
        const records = await model.findAll()
        expect(Array.isArray(records)).toBe(true)
        expect(records.length).toBe(0)
      }
    })
  })
    
})

function nameOfDb(url:string): string {
  if (!url) return 'unknown'
  const parts = url.split('/')
  return parts[parts.length - 1] || 'unknown'
}
 