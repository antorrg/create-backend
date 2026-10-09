/**
 * baseRepository
 * baseRepositoryTest
 * baseRepositoryTestHelp
 */

export const baseRepository = `import { eq, and, asc, desc, count, type Table } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { db as defaultDb } from '../../configs/database.js'
import type { IBaseRepository, IPaginatedOptions, IPaginatedResults } from '../interfaces/base.interface.js'
import { throwError, ERROR_CODE } from '../../configs/errors.js'

export class BaseRepository<
  TDTO,
  TCreate extends Record<string, any>,
  TUpdate = Partial<TCreate>,
  TTable extends Table = any
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  constructor(
    private readonly table: TTable,
    private readonly parserFn: (model: any) => TDTO,
    private readonly modelName: string = 'Model',
    private readonly whereField: keyof TDTO & string = 'id' as any,
    private readonly database: NodePgDatabase<any> = defaultDb
  ) {}

  async getAll(
    field?: unknown,
    whereField?: keyof TDTO | string
  ): Promise<TDTO[]> {
    const targetField = (whereField ?? this.whereField) as string
    const column = (this.table as any)[targetField]

    if (field !== undefined && field !== null && column) {
      const records = await this.database
        .select()
        .from(this.table as any)
        .where(eq(column, field))
      return records.map(this.parserFn)
    }

    const records = await this.database
      .select()
      .from(this.table as any)
    return records.map(this.parserFn)
  }

  async getWithPages(
    options?: IPaginatedOptions<TDTO>
  ): Promise<IPaginatedResults<TDTO>> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const skip = (page - 1) * limit

    const conditions: any[] = []
    if (options?.query) {
      for (const [key, val] of Object.entries(options.query)) {
        if (val !== undefined && val !== null) {
          const col = (this.table as any)[key]
          if (col) {
            conditions.push(eq(col, val))
          }
        }
      }
    }

    const whereCondition = conditions.length > 0
      ? conditions.reduce((acc, cond) => and(acc, cond))
      : undefined

    const orderClauses: any[] = []
    if (options?.order && Object.keys(options.order).length > 0) {
      for (const [key, dir] of Object.entries(options.order)) {
        const col = (this.table as any)[key]
        if (col) {
          const isAsc = String(dir).toUpperCase() === 'ASC' || dir === 1
          orderClauses.push(isAsc ? asc(col) : desc(col))
        }
      }
    } else {
      const defaultCol = (this.table as any)[this.whereField] ?? (this.table as any)['id']
      if (defaultCol) {
        orderClauses.push(asc(defaultCol))
      }
    }

    let dataQuery = this.database.select().from(this.table as any)
    if (whereCondition) {
      dataQuery = dataQuery.where(whereCondition) as any
    }
    if (orderClauses.length > 0) {
      dataQuery = dataQuery.orderBy(...orderClauses) as any
    }
    dataQuery = dataQuery.limit(limit).offset(skip) as any

    const data = await dataQuery

    let countQuery = this.database.select({ count: count() }).from(this.table as any)
    if (whereCondition) {
      countQuery = countQuery.where(whereCondition) as any
    }
    const countResult = await countQuery
    const total = Number(countResult[0]?.count ?? 0)

    return {
      info: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: data.map(this.parserFn)
    }
  }

  async getById(id: string | number): Promise<TDTO> {
    const idCol = (this.table as any)['id']
    if (!idCol) throwError(ERROR_CODE.NOT_FOUND, \`\${this.modelName} not found\`)
    const [record] = await this.database
      .select()
      .from(this.table as any)
      .where(eq(idCol, id))
    if (!record) throwError(ERROR_CODE.NOT_FOUND, \`\${this.modelName} not found\`)
    return this.parserFn(record)
  }

  async findByField(
    field: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<TDTO | null> {
    if (field == null) {
      throwError(ERROR_CODE.REQUIRED_FIELD_MISSING, \`No value provided for \${whereField as string}\`)
    }
    const column = (this.table as any)[whereField as string]
    if (!column) return null
    const [record] = await this.database
      .select()
      .from(this.table as any)
      .where(eq(column, field))
    return record ? this.parserFn(record) : null
  }

  async getByField(
    field: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<TDTO | null> {
    return this.findByField(field, whereField)
  }

  async create(data: TCreate): Promise<TDTO> {
    const [created] = (await this.database
      .insert(this.table as any)
      .values(data as any)
      .returning()) as any[]
    return this.parserFn(created)
  }

  async update(
    id: string | number,
    data: TUpdate
  ): Promise<TDTO> {
    const idCol = (this.table as any)['id']
    if (!idCol) throwError(ERROR_CODE.NOT_FOUND, \`\${this.modelName} not found\`)
    await this.getById(id)
    const [updated] = (await this.database
      .update(this.table as any)
      .set(data as any)
      .where(eq(idCol, id))
      .returning()) as any[]
    return this.parserFn(updated)
  }

  async delete(id: string | number): Promise<string> {
    const idCol = (this.table as any)['id']
    if (!idCol) throwError(ERROR_CODE.NOT_FOUND, \`\${this.modelName} not found\`)
    const existing = await this.getById(id)
    const value = (existing as any)[this.whereField] ?? id
    await this.database
      .delete(this.table as any)
      .where(eq(idCol, id))
    return \`\${value} deleted successfully\`
  }
}`
export const baseRepositoryTest = `import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { startUp, closeDatabase, db } from '../../configs/database.ts'
import { user } from '../../schemas/user.schema.ts'
import { BaseRepository } from './BaseRepository.ts'
import * as help from './testHelpers/testHelp.help.ts'

describe('BaseRepository unit test', () => {
  beforeAll(async () => {
    await startUp()
    await db.delete(user)
  })
  afterAll(async () => {
    await closeDatabase()
  })

  const test = new BaseRepository(user, help.parser, 'User', 'email')

  describe('Create method', () => {
    it('should create a element', async () => {
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
        await help.createSeedRandomElements(user, help.usersSeed)
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
    describe('"getByField" method', () => {
      it('Should retrieve an element by field', async () => {
        const response = await test.getByField('user15@email.com', 'email')
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
        expect(response.data.map(a => a.name)).toEqual(['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']) // Order
      })
      it('Should retrieve filtered and sorted elements', async () => {
        const queryObject = { page: 1, limit: 10, query: { enabled: false }, order: { name: 'ASC' } } as const
        const response = await test.getWithPages(queryObject)
        expect(response.info).toEqual({ total: 3, page: 1, limit: 10, totalPages: 1 })
        expect(response.data.length).toBe(3)
        expect(response.data.map(a => a.name)).toEqual(['Fifteen', 'Seven', 'Six']) // Order
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
    it('should deleted an element', async () => {
      const response = await test.delete(help.getStringId())
      expect(response).toBe('user@email.com deleted successfully')
    })
  })
})`

export const baseRepositoryTestHelp = `import { db } from '../../../configs/database.js'
import { user } from '../../../schemas/user.schema.js'
import { UuidHandler } from '../../utils/UuidHandler.js'

export type UserModel = typeof user.$inferSelect

export interface IUserTest {
  id: string
  email: string
  password: string
  nickname?: string | null
  name: string
  picture?: string | null
  enabled: boolean
}
export interface CreateUserInput {
  id: string
  email: string
  password: string
  nickname?: string | null
  name?: string | null
  picture?: string | null
  enabled: boolean
}
export type UpdateUserInput = Partial<CreateUserInput>

export const parser = (raw: UserModel): IUserTest => {
  return {
    id: raw.id,
    email: raw.email,
    password: raw.password,
    nickname: raw.nickname,
    name: raw.name ?? '',
    picture: raw.picture,
    enabled: raw.enabled
  }
}
export const dataCreate = {
  id: UuidHandler.createUuid(),
  email: 'user@email.com',
  password: '123456',
  nickname: 'userTest',
  name: 'user',
  picture: 'https://picsum.photos/200?random=16'
}
export const dataUpdate: UpdateUserInput = {
  email: 'user@email.com',
  password: '123456',
  nickname: 'userTest',
  name: 'Name of user',
  picture: 'https://picsum.photos/200?random=16',
  enabled: true
}
let stringId: string = ''
export const setStringId = (id: string): void => {
  stringId = id
}
export const getStringId = (): string => {
  return stringId
}

export const createSeedRandomElements = async (table: any, seed: any[]) => {
  try {
    if (!seed || seed.length === 0) throw new Error('No data')
    await db.insert(table).values(seed)
  } catch (error) {
    console.error('Error createSeedRandomElements: ', error)
  }
}

export const usersSeed = [
  {
    id: UuidHandler.createUuid(),
    email: 'user01@email.com',
    password: '123456',
    nickname: 'userTest01',
    name: 'One',
    picture: 'https://picsum.photos/200?random=1',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user02@email.com',
    password: '123456',
    nickname: 'userTest02',
    name: 'Two',
    picture: 'https://picsum.photos/200?random=2',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user03@email.com',
    password: '123456',
    nickname: 'userTest03',
    name: 'Three',
    picture: 'https://picsum.photos/200?random=3',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user04@email.com',
    password: '123456',
    nickname: 'userTest04',
    name: 'Four',
    picture: 'https://picsum.photos/200?random=4',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user05@email.com',
    password: '123456',
    nickname: 'userTest05',
    name: 'Five',
    picture: 'https://picsum.photos/200?random=5',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user06@email.com',
    password: '123456',
    nickname: 'userTest06',
    name: 'Six',
    picture: 'https://picsum.photos/200?random=6',
    enabled: false
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user07@email.com',
    password: '123456',
    nickname: 'userTest07',
    name: 'Seven',
    picture: 'https://picsum.photos/200?random=7',
    enabled: false
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user08@email.com',
    password: '123456',
    nickname: 'userTest08',
    name: 'Eight',
    picture: 'https://picsum.photos/200?random=8',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user09@email.com',
    password: '123456',
    nickname: 'userTest09',
    name: 'Nine',
    picture: 'https://picsum.photos/200?random=9',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user10@email.com',
    password: '123456',
    nickname: 'userTest10',
    name: 'Ten',
    picture: 'https://picsum.photos/200?random=10',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user11@email.com',
    password: '123456',
    nickname: 'userTest11',
    name: 'Eleven',
    picture: 'https://picsum.photos/200?random=11',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user12@email.com',
    password: '123456',
    nickname: 'userTest12',
    name: 'Twelve',
    picture: 'https://picsum.photos/200?random=12',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user13@email.com',
    password: '123456',
    nickname: 'userTest13',
    name: 'Thirteen',
    picture: 'https://picsum.photos/200?random=13',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user14@email.com',
    password: '123456',
    nickname: 'userTest14',
    name: 'Fourteen',
    picture: 'https://picsum.photos/200?random=14',
    enabled: true
  },
  {
    id: UuidHandler.createUuid(),
    email: 'user15@email.com',
    password: '123456',
    nickname: 'userTest15',
    name: 'Fifteen',
    picture: 'https://picsum.photos/200?random=15',
    enabled: false
  }
]`