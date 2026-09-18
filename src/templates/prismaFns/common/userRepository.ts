
export const userRepository = `import { prisma } from '../../configs/database.js'
import type { IUserRepository, IUser } from './User.interfaces.js'
import { BaseRepository } from '../../shared/repositories/BaseRepository.js'
import { User, type UserProps } from './User.js'
import type { UserModel } from '../../../generated/prisma/models/User.js'
import { processError, throwError, ERROR_CODE } from '../../configs/errors.js'

const userModel = prisma.user
export class UserRepository implements IUserRepository {
  private base: BaseRepository<UserModel, UserProps, Partial<UserProps>, typeof userModel>

  constructor(){
    this.base = new BaseRepository(userModel, this.mapToRecord, 'User', 'email')
  }

  // ==========================================
  // HELPER: Map from db to user
  // ==========================================
  private mapToRecord(record: UserModel): UserModel {
    return record
  }

  private mapToDomain(record: UserModel): User {
    return new User({
      id: record.id,
      email: record.email,
      password: record.password,
      role: record.role,
      name: record.name,
      nickname: record.nickname,
      picture: record.picture,
      enabled: record.enabled
    })
  }
  private mapToPublic(record: UserModel): IUser {
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
      const record = await this.base.getById(id)
      return record ? this.mapToDomain(record) : null
    } catch (error) {
      return processError(error, \`Error searching user id: \${id}\`)
    }
  }
    async getPublicById(id: string): Promise<IUser | null> {
    try {
      const record = await this.base.getById(id)
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
  async update(id:string, userDomain: User):Promise<IUser>{
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
      processError(error, \`Error deleting user \${id}\`)
    }
  }

  // ==========================================
  // ESPECIFIC MÉTHODS
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