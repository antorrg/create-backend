import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { startUp, closeDatabase, User as UserModel } from '../../configs/database.js'
import { BaseRepository } from './BaseRepository.js'
import * as help from './testHelpers/testHelp.help.js'

describe('BaseRepository unit test', () => {
  beforeAll(async () => {
    await startUp(true, true)
  })
  afterAll(async () => {
    await closeDatabase()
  })

  const test = new BaseRepository<help.IUserTest, help.CreateUserInput>(UserModel as any, help.parser, 'User', 'email')

  describe('Create method', () => {
    it('should create an element', async () => {
      const response = await test.create(help.dataCreate)
      expect(response).toEqual({
        id: expect.any(String),
        email: 'user@email.com',
        password: '123456',
        nickname: 'userTest',
        name: 'user',
        picture: 'https://picsum.photos/200?random=16',
        enabled: true
      })
      help.setStringId(response.id)
    })
  })

  describe('Get methods', () => {
    describe('"getAll" method', () => {
      it('should retrieve an array of elements', async () => {
        await help.createSeedRandomElements(UserModel as any, help.usersSeed)
        const response = await test.getAll()
        expect(response.length).toBe(16)
      })
      it('Should retrieve an array of elements filtered by query', async () => {
        const response = await test.getAll(false, 'enabled')
        expect(response.length).toBe(3)
      })
    })

    describe('"getById" method', () => {
      it('Should retrieve an element by Id', async () => {
        const response = await test.getById(help.getStringId())
        expect(response).toEqual({
          id: expect.any(String),
          email: 'user@email.com',
          password: '123456',
          nickname: 'userTest',
          name: 'user',
          picture: 'https://picsum.photos/200?random=16',
          enabled: true
        })
      })
    })

    describe('"findByField" method', () => {
      it('Should retrieve an element by field', async () => {
        const response = await test.findByField('user15@email.com', 'email')
        expect(response).toEqual({
          id: expect.any(String),
          email: 'user15@email.com',
          password: '123456',
          nickname: 'userTest15',
          name: 'Fifteen',
          picture: 'https://picsum.photos/200?random=15',
          enabled: expect.any(Boolean)
        })
      })
    })

    describe('"getWithPages" method', () => {
      it('Should retrieve an array of paginated elements', async () => {
        const queryObject = { page: 1, limit: 10 } as const
        const response = await test.getWithPages(queryObject)
        expect(response.info).toEqual({ total: 16, page: 1, limit: 10, totalPages: 2 })
        expect(response.data.length).toBe(10)
      })
      it('Should retrieve filtered elements', async () => {
        const queryObject = { page: 1, limit: 10, query: { enabled: false } } as const
        const response = await test.getWithPages(queryObject)
        expect(response.info).toEqual({ total: 3, page: 1, limit: 10, totalPages: 1 })
        expect(response.data.length).toBe(3)
      })
    })
  })

  describe('Update method', () => {
    it('should update an element', async () => {
      const data = { name: 'Name of user' }
      const response = await test.update(help.getStringId(), data)
      expect(response).toEqual({
        id: expect.any(String),
        ...help.dataUpdate
      })
    })
  })

  describe('Delete method', () => {
    it('should delete an element', async () => {
      const response = await test.delete(help.getStringId())
      expect(response).toBe('user@email.com deleted successfully')
    })
  })
})