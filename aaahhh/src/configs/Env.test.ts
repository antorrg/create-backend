import { describe, it, expect } from 'vitest'
import envConfig from './envConfig.js'


describe('EnvDb test', () => { 

  describe('Environment variables', () => {
    it('should return the correct environment status and database variable', () => { 
      const formatEnvInfo = `App running in: ${envConfig.Status}`+
      `User url image: ${envConfig.UserImg}`
      expect(formatEnvInfo).toBe(
        'App running in: test'+
        'User url image: image.png'
      )
    })
  })
})