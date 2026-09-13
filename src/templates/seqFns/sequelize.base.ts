import type { FilePattern } from "../../types.js"
import { seqAuthIndex } from "./sequelize.auth.index.js"
import { sequelizeBaseModels } from './sequelizeAuth/sequelize.base.models.js'


export const sequelizeBase = (options:FilePattern)=>{
  const authIndex = seqAuthIndex(options)
  const models = sequelizeBaseModels(options)
  return[
    {
        path: `/${options.sourceFolderName}/models/index.model.ts`,
        file: `import User from './user.model.js'
import Log from './log.model.js'
${authIndex.import}

export default {
    User,
    Log,${authIndex.line}
}`
    },
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//************** Commons files **************//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     {
        path:`/${options.sourceFolderName}/configs/database.ts`,
        file: `import envConfig from './envConfig.js'
import logger from './logger.js'
import { Sequelize } from '@sequelize/core'
import { PostgresDialect } from '@sequelize/postgres';
import modelsDefinition from '../models/index.model.js'

const uri = splitName(envConfig.DatabaseUrl)
const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: uri.database,
  user: uri.username,
  password: uri.password,
  host: uri.host,
  port: Number(uri.port),
  ssl: false,
  clientMinMessages: 'notice',
})


const [
  User, 
  Log,${authIndex.line}
] = Object.values(modelsDefinition).map(model => model(sequelize))

function getNameDb(dbUri:string):string {
 return dbUri.split('/').slice(-1).join()
}

async function startUp (syncDb: boolean = false, rewrite: boolean = false) {
  try {
    await sequelize.authenticate()
    const successMessage =\`🟢​ Database postgreSQL "\${getNameDb(envConfig.DatabaseUrl)}" initialized successfully!!\`
    console.log(successMessage)
    if (envConfig.Status !== 'production' && syncDb) {
      try {
        await sequelize.sync({ force: rewrite })
        let message = \`🧪 Synced database \${getNameDb(envConfig.DatabaseUrl)}: "force \${rewrite}"\`
        logger.info(message)
      } catch (error) {
        logger.error(error)
        //console.error(\`❗Error syncing database \${getNameDb(envConfig.DatabaseUrl)}\`, error)
      }
    }
    logger.info(successMessage)
  } catch (error) {
    //console.error('❌ Error conecting database!', error)
    logger.error(error)
  }
}
const closeDatabase = async () => {
  await sequelize.close()
  logger.info('🛑 Database disconnect')
}
function splitName(value:string){
  const normalized = value.replace('postgres://', 'http://')
  const url = new URL(normalized)

  return {
    protocol: url.protocol.replace(':', ''),
    username: url.username,
    password: url.password,
    host: url.hostname,
    port: url.port,
    database: url.pathname.replace('/', ''),
    logging:false
  }
}

export {
    User,
    Log,${authIndex.line}
    sequelize,
    startUp,
    closeDatabase
}`
    },    
    {
        path:`/${options.sourceFolderName}/shared/repositories/BaseRepository.ts`,
        file: `import type { IBaseRepository, IPaginatedOptions, IPaginatedResults } from '../interfaces/base.interface.js'
import { Model, ModelStatic } from '@sequelize/core'
import { throwError, ERROR_CODE } from '../../configs/errors.js'

export class BaseRepository<
  TDTO,
  TCreate extends Record<string, any>,
  TUpdate = Partial<TCreate>,
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  constructor(
    private readonly Model: ModelStatic<Model>,
    private readonly parserFn: (model: any) => TDTO,
    private readonly modelName: string = Model.name ?? 'Model',
    private readonly whereField: keyof TDTO & string = 'id' as keyof TDTO & string,
  ) {}

  async getAll(
    field?: unknown,
    whereField?: keyof TDTO | string
  ): Promise<TDTO[]> {
    const whereClause = whereField != null && field != null
      ? { [whereField]: field }
      : {}
    const models = await this.Model.findAll({ where: whereClause as any })
    return models.map(this.parserFn)
  }

  async getWithPages(
    options?: IPaginatedOptions<TDTO>
  ): Promise<IPaginatedResults<TDTO>> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10
    const offset = (page - 1) * limit
    const whereClause = options?.query ?? {}
    const orderClause = options?.order
      ? Object.entries(options.order).map(([field, direction]) => [field, direction])
      : undefined

    const { rows: data, count: total } = await this.Model.findAndCountAll({
      limit,
      offset,
      where: whereClause as any,
      distinct: true,
      order: orderClause as any
    })

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
    const model = await this.Model.findByPk(id)
    if (!model) throwError(ERROR_CODE.NOT_FOUND, \`\${this.modelName} not found\`)
    return this.parserFn(model)
  }

  async findByField(
    field: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<TDTO | null> {
    if (field == null) throwError(ERROR_CODE.REQUIRED_FIELD_MISSING, \`No value provided for \${(whereField as string)}\`)
    const model = await this.Model.findOne({
      where: { [whereField]: field } as any
    })
    return model ? this.parserFn(model) : null
  }

  async create(data: TCreate): Promise<TDTO> {
    const model = await this.Model.create(data as any)
    return this.parserFn(model)
  }

  async update(
    id: string | number,
    data: TUpdate
  ): Promise<TDTO> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(ERROR_CODE.NOT_FOUND, \`\${this.modelName} not found\`)
    const updated = await model.update(data as any)
    return this.parserFn(updated)
  }

  async delete(id: string | number): Promise<string> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(ERROR_CODE.NOT_FOUND, \`\${this.modelName} not found\`)
    const value = (model as any)[this.whereField] ?? id
    await model.destroy()
    return \`\${value} deleted successfully\`
  }
}`
    },    
    {
        path:`/${options.sourceFolderName}/shared/repositories/testHelpers/testHelp.help.ts`,
        file: `import { User as UserDb } from '../../../models/user.model.js'
import { UuidHandler } from '../../utils/UuidHandler.js'

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

export const parser = (raw: any): IUserTest => {
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
  picture: 'https://picsum.photos/200?random=16',
  enabled: true
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
//* --------------------------------------------------
// ?          UserSeed
//* --------------------------------------------------
export const createSeedRandomElements = async (model: typeof UserDb, seed: unknown[]) => {
  try {
    if (!seed || seed.length === 0) throw new Error('No data')
    await model.bulkCreate(seed as any[])
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
    },
    {
        path:`/${options.sourceFolderName}/shared/repositories/BaseRepository.test.ts`,
        file: `import { beforeAll, afterAll, describe, it, expect } from 'vitest'
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
})`
    },
        {
        path:`/${options.sourceFolderName}/features/user/UserRepository.ts`,
        file: `import { User as UserDb } from '../../models/user.model.js'
import type { IUserRepository, IUser } from './User.interfaces.js'
import { BaseRepository } from '../../shared/repositories/BaseRepository.js'
import { User, type UserProps } from './User.js'
import { processError, throwError, ERROR_CODE } from '../../configs/errors.js'

export class UserRepository implements IUserRepository {
  private base: BaseRepository<UserProps, UserProps, Partial<UserProps>>

  constructor(model: typeof UserDb = UserDb) {
    this.base = new BaseRepository(model as any, this.mapToRecord, 'User', 'email')
  }

  // ==========================================
  // HELPER: Map from db to user props
  // ==========================================
  private mapToRecord(record: any): UserProps {
    return {
      id: record.id,
      email: record.email,
      password: record.password,
      role: record.role ?? 'USER',
      name: record.name ?? '',
      nickname: record.nickname ?? '',
      picture: record.picture ?? '',
      enabled: record.enabled ?? true
    }
  }

  private mapToDomain(record: UserProps): User {
    return new User(record)
  }

  private mapToPublic(record: UserProps): IUser {
    return {
      id: record.id,
      email: record.email,
      role: record.role,
      name: record.name,
      nickname: record.nickname,
      picture: record.picture,
      enabled: record.enabled
    }
  }

  // ==========================================
  // BASIC CRUD
  // ==========================================

  async save(userDomain: User): Promise<void> {
    try {
      const data = userDomain.toPersistence()
      const existingUser = await this.base.findByField(data.email, 'email')
      if (existingUser) {
        throwError(ERROR_CODE.DUPLICATE_VALUE, 'This email already exists')
      }
      await this.base.create(data)
    } catch (error) {
      return processError(error, 'Error saving user')
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      const record = await this.base.findByField(id, 'id')
      return record ? this.mapToDomain(record) : null
    } catch (error) {
      return processError(error, \`Error searching user id: \${id}\`)
    }
  }

  async getPublicById(id: string): Promise<IUser | null> {
    try {
      const record = await this.base.findByField(id, 'id')
      return record ? this.mapToPublic(record) : null
    } catch (error) {
      return processError(error, \`Error searching user id: \${id}\`)
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      const records = await this.base.getAll()
      return records.map(record => this.mapToPublic(record))
    } catch (error) {
      return processError(error, 'Error searching users')
    }
  }

  async update(id: string, userDomain: User): Promise<IUser> {
    try {
      const data = userDomain.toPersistence()
      const updated = await this.base.update(id, data)
      return this.mapToPublic(updated)
    } catch (error) {
      return processError(error, 'Error updating user')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.base.delete(id)
    } catch (error) {
      return processError(error, \`Error deleting user \${id}\`)
    }
  }

  // ==========================================
  // SPECIFIC METHODS
  // ==========================================

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.base.findByField(email, 'email')
      return result ? this.mapToDomain(result) : null
    } catch (error) {
      return processError(error, \`Error searching user for email \${email}\`)
    }
  }
}`
   },
...models
      /*  {
        path:`/${options.sourceFolderName}`,
        file: ``
    },
        {
        path:`/${options.sourceFolderName}`,
        file: ``
    }*/
  ]}