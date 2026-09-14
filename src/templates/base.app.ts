import type { FilePattern } from "../types.js"
import { selectOrmForInitDb, testOrms } from "./helpers/selectOrmForInitDb.js"


export const baseApp = (options:FilePattern)=>{

    return[

{
path:`/${options.sourceFolderName}/shared/interfaces/base.interface.ts`,
file: `
export type Direction = 1 | -1 | 'ASC' | 'DESC'
export interface Order<TDTO> {
  field: keyof TDTO
  direction: Direction
}

export interface IPaginatedOptions<TDTO> {
  query?: Partial<Record<keyof TDTO, unknown>>
  page?: number
  limit?: number
  order?: Partial<Record<keyof TDTO, Direction>>
}

export interface PaginateInfo { total: number, page: number, limit: number, totalPages: number }

export interface IPaginatedResults<TDTO> {
  info: PaginateInfo
  data: TDTO[]
}

export type TUpdate<T> = Partial<Omit<T, 'id'>>
export interface IBaseRepository<TDTO, TCreate, TUpdate> {
  getAll: (field?: unknown, whereField?: keyof TDTO | string) => Promise<TDTO[]>
  getById: (id: string | number) => Promise<TDTO>
  findByField: (field: unknown, whereField?: keyof TDTO | string) => Promise<TDTO | null>
  getWithPages: (options?: IPaginatedOptions<TDTO>) => Promise<IPaginatedResults<TDTO>>
  create: (data: TCreate) => Promise<TDTO>
  update: (id: string | number, data: TUpdate) => Promise<TDTO>
  delete: (id: string | number) => Promise<string>
}
export interface IExternalImageDeleteService<T> {
  deleteImage: (imageInfo: T) => Promise<string|undefined>
}
`},
{
  path:`/${options.sourceFolderName}/shared/dependencies.ts`,
  file: `import type { IExternalImageDeleteService } from './interfaces/base.interface.js'
import { UserRepository } from '../features/user/UserRepository.js'
import { UserService } from '../features/user/UserService.js'


export const mockImageDeleteService: IExternalImageDeleteService<any> = {
  deleteImage: async (_imageInfo: any) => await Promise.resolve('true')
}

export const userRepository = new UserRepository()
export const userService = new UserService(userRepository, mockImageDeleteService.deleteImage)`
},
{
  path:`/${options.sourceFolderName}/shared/utils/UuidHandler.ts`,
  file:`import {v7 as uuid } from 'uuid'

export class UuidHandler{
    static createUuid = ():string => {
        return uuid()
    }
    static uuidRegex :RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    static uuidValidator = (value: string) => {
    // Acepta UUIDs desde versión 1 hasta versión 7 (incluyendo v4 y v7)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    if (!UUID_REGEX) throw new Error('Domain Validation: UUID invalid format');
    return value;
  }
}`
},
{
  path:`/${options.sourceFolderName}/shared/utils/Hasher.ts`,
  file: `import bcrypt from 'bcrypt'


export class Hasher{
    static hash = async(value:string):Promise<string> => {
        return await bcrypt.hash(value, 12)
    }
    static compare = async(value:string, hash:string):Promise<boolean>=>{
        return await bcrypt.compare(value, hash)
    }
}
`
},
{
  path: `/${options.sourceFolderName}/features/user/applications/UserApplications.ts`,
  file: `import { UuidHandler } from '../../../shared/utils/UuidHandler.js'

export class UserApplications{
  static Id(prop:string){
    if(!prop || typeof(prop) !== 'string'|| !UuidHandler.uuidValidator(prop)){
      throw new Error('[UserDomain] Invalid id format')
    }
    return prop
  }

  static Email(prop:string){
    const regexEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/  
    if(!prop || typeof(prop) !== 'string'|| !regexEmail.test(prop)){
      throw new Error('[UserDomain] Invalid email format')
    }
    return prop.toLowerCase()
  }
  static Role(prop:string){
    if(!prop || typeof(prop) !== 'string') throw new Error('[UserDomain] Invalid or missing role')
    const role = prop.trim().toUpperCase()
    const allowed = ['OWNER', 'ADMIN', 'USER']
    if(!allowed.includes(role)){
      throw new Error('[UserDomain] Invalid role')
    }
    return role
  }
    static validatePasswordHash(prop:string):string{
    if(typeof prop !== 'string' || prop.length < 20) throw new Error('[UserDomain] Invalid password hash')
    return prop
  }
  static validateName(prop:string):string{
    if(typeof prop !== 'string') throw new Error('[UserDomain] Invalid name')
    return prop
  }
  static validatePicture(prop:string):string{
    if(typeof prop !== 'string') throw new Error('[UserDomain] Invalid name')
    return prop
  }
  static validateNickname(prop:string):string{
    if(typeof prop !== 'string') throw new Error('[UserDomain] Invalid nickname')
    return prop
  }
  static validateEnabled(prop:boolean):boolean{
    if(typeof prop !== 'boolean') throw new Error('[UserDomain] Invalid enabled')
    return prop
  }

}`
},
{ 
  path:`/${options.sourceFolderName}/features/user/User.interfaces.ts`,
  file:`import type { User } from './User.js'

export type IUser = ReturnType<User['toDTO']>;
export interface IUserRepository {
  // CRUD Básico (Hablando siempre en Entidades de Dominio 'User')
  save(user: User): Promise<void>;
  update(id: string, user: User): Promise<IUser>;
  getById(id: string): Promise<User | null>;
  getAll(): Promise<IUser[]>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  getPublicById(id:string): Promise<IUser | null>
}`,
},
{ 
  path:`/${options.sourceFolderName}/features/user/User.test.ts`,
  file:`import { describe, it, expect, beforeEach } from 'vitest'
import { User } from './User.js'
import envConfig from '../../configs/envConfig.js'
import { UuidHandler } from '../../shared/utils/UuidHandler.js'

describe('User Domain Entity', () => {
  const validEmail = 'test@example.com'
  const validPasswordHash = '$2b$12$unHashValidoDePrueba1234567890' // >= 20 chars
  const validUuid = UuidHandler.createUuid()

  describe('1. Instantiation and Factory', () => {
    it('should register a user correctly using User.register', () => {
      const user = User.register({
        email: validEmail,
        hashedPassword: validPasswordHash
      })

      const dto = user.toDTO()

      expect(dto.id).toBeDefined()
      expect(UuidHandler.uuidValidator(dto.id)).toBe(dto.id)
      expect(dto.email).toBe(validEmail)
      expect(dto.role).toBe('USER')
      expect(dto.name).toBe('Falta completar')
      expect(dto.nickname).toBe('test')
      expect(dto.picture).toBe(envConfig.UserImg)
      expect(dto.enabled).toBe(true)
    })

    it('should normalize email to lowercase in User.register', () => {
      const user = User.register({
        email: 'TEST.USER@EXAMPLE.COM',
        hashedPassword: validPasswordHash
      })

      expect(user.toDTO().email).toBe('test.user@example.com')
      expect(user.toDTO().nickname).toBe('TEST.USER')
    })

    it('should throw an error if required parameters are missing in User.register', () => {
      expect(() => {
        User.register({ email: '', hashedPassword: validPasswordHash })
      }).toThrow('Missing parameters')

      expect(() => {
        User.register({ email: validEmail, hashedPassword: '' })
      }).toThrow('Missing parameters')
    })
  })

  describe('2. State Change Methods (Domain Behaviors)', () => {
    let user: User

    beforeEach(() => {
      user = User.register({
        email: validEmail,
        hashedPassword: validPasswordHash
      })
    })

    it('should change user scope (role and enabled) using changeUserScope', () => {
      expect(user.toDTO().role).toBe('USER')
      expect(user.toDTO().enabled).toBe(true)

      user.changeUserScope('ADMIN', false)
      expect(user.toDTO().role).toBe('ADMIN')
      expect(user.toDTO().enabled).toBe(false)

      user.changeUserScope('OWNER', true)
      expect(user.toDTO().role).toBe('OWNER')
      expect(user.toDTO().enabled).toBe(true)
    })

    it('should throw an error if an invalid role is passed to changeUserScope', () => {
      expect(() => {
        user.changeUserScope('SUPERADMIN', true)
      }).toThrow('[UserDomain] Invalid role')
    })

    it('should change password when the hash is valid', () => {
      const newHash = '$2b$12$OtroHashValidoDePrueba20Caracteres'
      user.changePassword(newHash)

      const persistence = user.toPersistence()
      expect(persistence.password).toBe(newHash)
    })

    it('should throw an error if the new password hash is invalid in changePassword', () => {
      expect(() => {
        user.changePassword('short_hash')
      }).toThrow('[UserDomain] Invalid password hash')
    })

    it('should update profile correctly using updateProfile', () => {
      user.updateProfile({
        email: 'new@example.com',
        name: 'John Doe',
        nickname: 'johnd',
        picture: 'https://example.com/avatar.jpg'
      })

      const dto = user.toDTO()
      expect(dto.email).toBe('new@example.com')
      expect(dto.name).toBe('John Doe')
      expect(dto.nickname).toBe('johnd')
      expect(dto.picture).toBe('https://example.com/avatar.jpg')
    })

    it('should throw an error when attempting to update profile with an invalid email', () => {
      expect(() => {
        user.updateProfile({
          email: 'invalid-email',
          name: 'John Doe',
          nickname: 'johnd',
          picture: 'https://example.com/avatar.jpg'
        })
      }).toThrow('[UserDomain] Invalid email format')
    })
  })

  describe('3. Domain Validation Corner Cases (Direct constructor)', () => {
    it('should throw an error if ID is not a valid UUID', () => {
      expect(() => {
        new User({
          id: 'invalid-id-123',
          email: validEmail,
          password: validPasswordHash,
          role: 'USER',
          name: 'Test',
          nickname: 'test',
          picture: 'pic.jpg',
          enabled: true
        })
      }).toThrow('Domain Validation: UUID invalid format')
    })

    it('should throw an error if email does not match regex format', () => {
      expect(() => {
        new User({
          id: validUuid,
          email: 'user.without.at.domain.com',
          password: validPasswordHash,
          role: 'USER',
          name: 'Test',
          nickname: 'test',
          picture: 'pic.jpg',
          enabled: true
        })
      }).toThrow('[UserDomain] Invalid email format')
    })

    it('should throw an error if role is not in [OWNER, ADMIN, USER]', () => {
      expect(() => {
        new User({
          id: validUuid,
          email: validEmail,
          password: validPasswordHash,
          role: 'GUEST',
          name: 'Test',
          nickname: 'test',
          picture: 'pic.jpg',
          enabled: true
        })
      }).toThrow('[UserDomain] Invalid role')
    })

    it('should throw an error if password hash is less than 20 characters', () => {
      expect(() => {
        new User({
          id: validUuid,
          email: validEmail,
          password: 'short',
          role: 'USER',
          name: 'Test',
          nickname: 'test',
          picture: 'pic.jpg',
          enabled: true
        })
      }).toThrow('[UserDomain] Invalid password hash')
    })
  })

  describe('4. Mappings (toDTO and toPersistence)', () => {
    it('should not expose password in toDTO', () => {
      const user = User.register({
        email: validEmail,
        hashedPassword: validPasswordHash
      })

      const dto = user.toDTO() as Record<string, unknown>
      expect(dto.password).toBeUndefined()
      expect(dto.id).toBeDefined()
      expect(dto.email).toBe(validEmail)
      expect(dto.role).toBe('USER')
      expect(dto.name).toBe('Falta completar')
      expect(dto.nickname).toBe('test')
      expect(dto.picture).toBe(envConfig.UserImg)
      expect(dto.enabled).toBe(true)
    })

    it('should return all required fields for database persistence in toPersistence', () => {
      const user = User.register({
        email: validEmail,
        hashedPassword: validPasswordHash
      })

      const dbRecord = user.toPersistence()
      expect(dbRecord.id).toBeDefined()
      expect(dbRecord.password).toBe(validPasswordHash)
      expect(dbRecord.email).toBe(validEmail)
      expect(dbRecord.role).toBe('USER')
      expect(dbRecord.name).toBe('Falta completar')
      expect(dbRecord.nickname).toBe('test')
      expect(dbRecord.picture).toBe(envConfig.UserImg)
      expect(dbRecord.enabled).toBe(true)
    })
  })
})`
},
{ 
  path:`/${options.sourceFolderName}/features/user/User.ts`,
  file:`import envConfig from '../../configs/envConfig.js'
import { UuidHandler } from '../../shared/utils/UuidHandler.js'
import { UserApplications } from './applications/UserApplications.js'

export interface UserProps {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  nickname: string;
  picture:string;
  enabled: boolean;
}
export type UserCreate = {email:string, hashedPassword:string}
export type UserUpdate = Omit<UserProps, 'id'|'password'| 'role'| 'enabled'>

export class User {
  protected readonly id: string
  protected email: string
  protected password: string
  protected role: string
  protected name: string
  protected nickname: string
  protected picture: string
  protected enabled: boolean
  

  constructor({ id, email, password, role, name, nickname, picture, enabled }: UserProps) {
    this.id = UserApplications.Id(id)
    this.email = UserApplications.Email(email)
    this.password = UserApplications.validatePasswordHash(password)
    this.role = UserApplications.Role(role)
    this.name = UserApplications.validateName(name)
    this.nickname = UserApplications.validateNickname(nickname)
    this.picture = UserApplications.validatePicture(picture)
    this.enabled = UserApplications.validateEnabled(enabled)
  }

  static register({ email, hashedPassword }:UserCreate){
    if(!email || !hashedPassword) throw new Error('Missing parameters')
    return new User({
      id: UuidHandler.createUuid(),
      email: UserApplications.Email(email),
      password: UserApplications.validatePasswordHash(hashedPassword),
      name: 'Falta completar',
      nickname: UserApplications.validateNickname(email?.split('@')[0] ?? 'Usuario'),
      picture: envConfig.UserImg,
      role: 'USER',
      enabled: true
    })
  }

  changePassword(hashedPassword: string) {
    this.password = UserApplications.validatePasswordHash(hashedPassword)
  }

  changeUserScope(role:string, enabled:boolean) {
    this.role = UserApplications.Role(role)
    this.enabled = UserApplications.validateEnabled(enabled)
  }

  updateProfile(user: UserUpdate){ 
    this.email = UserApplications.Email(user.email)
    this.name = UserApplications.validateName(user.name)
    this.nickname = UserApplications.validateNickname(user.nickname)
    this.picture = UserApplications.validatePicture(user.picture)
  }


  // Mapeos para Infraestructura (DB) y Cliente (DTO)
  toPersistence() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role, 
      name: this.name,
      nickname: this.nickname,
      picture: this.picture,
      enabled: this.enabled
    }
  }

  toDTO() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      name: this.name,
      nickname: this.nickname,
      picture: this.picture,
      enabled: this.enabled
    }
  }

}`},
{ 
  path:`/${options.sourceFolderName}/features/user/UserService.test.ts`,
  file:`import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from './UserService.js'
import type { UserProps } from './User.js'
import { User } from './User.js'
import { ERROR_CODE } from '../../configs/errors.js'
import { UuidHandler } from '../../shared/utils/UuidHandler.js'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../shared/utils/Hasher.js', () => ({
  Hasher: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}))

import { Hasher } from '../../shared/utils/Hasher.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_HASH = '$2b$12$unHashValidoDePrueba1234567890' // >= 20 chars
const TEST_ID = UuidHandler.createUuid()

function makeUser(overrides: Partial<UserProps> = {}): User {
  return new User({
    id: TEST_ID,
    email: 'user@test.com',
    password: VALID_HASH,
    role: 'USER',
    name: 'Test User',
    nickname: 'testuser',
    picture: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    enabled: true,
    ...overrides
  })
}

// ─── Setup ────────────────────────────────────────────────────────────────────

const mockRepo = {
  save: vi.fn(),
  update: vi.fn(),
  getById: vi.fn(),
  getAll: vi.fn(),
  delete: vi.fn(),
  findByEmail: vi.fn(),
  getPublicById: vi.fn()
}

const mockHandleImageDelete = vi.fn()

function makeService() {
  return new UserService(
    mockRepo as any,
    mockHandleImageDelete
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('UserService', () => {
  let service: UserService
  let user: User

  beforeEach(() => {
    vi.clearAllMocks()
    user = makeUser()
    service = makeService()
  })

  // ── registerUser ─────────────────────────────────────────────────────────────

  describe('registerUser', () => {
    it('should hash the password, save the user, and return public DTO', async () => {
      vi.mocked(Hasher.hash).mockResolvedValue(VALID_HASH)
      mockRepo.save.mockResolvedValue(undefined)

      const result = await service.registerUser({ email: 'new@test.com', password: 'rawPassword123' })

      expect(Hasher.hash).toHaveBeenCalledWith('rawPassword123')
      expect(mockRepo.save).toHaveBeenCalledOnce()
      expect(result).toMatchObject({
        email: 'new@test.com',
        role: 'USER',
        enabled: true,
        name: 'Falta completar',
        nickname: 'new'
      })
      expect(result).not.toHaveProperty('password')
    })

    it('should throw an error if repository fails to save user', async () => {
      vi.mocked(Hasher.hash).mockResolvedValue(VALID_HASH)
      mockRepo.save.mockRejectedValue(new Error('DB Save Failed'))

      await expect(service.registerUser({ email: 'new@test.com', password: 'rawPassword123' }))
        .rejects.toThrow('DB Save Failed')
    })
  })

  // ── updateProfile ────────────────────────────────────────────────────────────

  describe('updateProfile', () => {
    it('should update user profile correctly', async () => {
      mockRepo.getById.mockResolvedValue(user)
      const updatedUserDto = {
        ...user.toDTO(),
        name: 'New Name',
        nickname: 'newnick'
      }
      mockRepo.update.mockResolvedValue(updatedUserDto)

      const updateData = {
        email: 'user@test.com',
        name: 'New Name',
        nickname: 'newnick',
        picture: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
      }

      const result = await service.updateProfile(user.toDTO().id, updateData)

      expect(mockRepo.getById).toHaveBeenCalledWith(user.toDTO().id)
      expect(mockRepo.update).toHaveBeenCalledOnce()
      expect(mockHandleImageDelete).not.toHaveBeenCalled()
      expect(result.name).toBe('New Name')
    })

    it('should execute handleImageDelete if profile picture URL changes', async () => {
      mockRepo.getById.mockResolvedValue(user)
      mockRepo.update.mockResolvedValue({
        ...user.toDTO(),
        picture: 'https://res.cloudinary.com/demo/image/upload/new_sample.jpg'
      })

      const updateData = {
        email: 'user@test.com',
        name: 'Test User',
        nickname: 'testuser',
        picture: 'https://res.cloudinary.com/demo/image/upload/new_sample.jpg'
      }

      await service.updateProfile(user.toDTO().id, updateData)

      expect(mockHandleImageDelete).toHaveBeenCalledWith('https://res.cloudinary.com/demo/image/upload/sample.jpg')
    })

    it('should throw NOT_FOUND if user does not exist', async () => {
      mockRepo.getById.mockResolvedValue(null)

      await expect(service.updateProfile('bad_id', {
        email: 'user@test.com',
        name: 'Test',
        nickname: 'test',
        picture: 'pic.jpg'
      })).rejects.toMatchObject({ code: ERROR_CODE.NOT_FOUND })
    })

    it('should throw ACCESS_DENIED if target user has OWNER role (#protectProtocol)', async () => {
      const ownerUser = makeUser({ role: 'OWNER' })
      mockRepo.getById.mockResolvedValue(ownerUser)

      await expect(service.updateProfile(ownerUser.toDTO().id, {
        email: 'owner@test.com',
        name: 'Owner',
        nickname: 'owner',
        picture: 'pic.jpg'
      })).rejects.toMatchObject({ code: ERROR_CODE.ACCESS_DENIED })
    })
  })

  // ── changePassword ───────────────────────────────────────────────────────────

  describe('changePassword', () => {
    it('should change password when current password is valid', async () => {
      vi.mocked(Hasher.compare).mockResolvedValue(true)
      vi.mocked(Hasher.hash).mockResolvedValue('$2b$12$NEWHASHFORTESTING123456789')
      mockRepo.getById.mockResolvedValue(user)
      mockRepo.update.mockResolvedValue(user.toDTO())

      const result = await service.changePassword({
        id: user.toDTO().id,
        password: 'currentPassword123',
        newPassword: 'newPassword456'
      })

      expect(Hasher.compare).toHaveBeenCalledWith('currentPassword123', VALID_HASH)
      expect(Hasher.hash).toHaveBeenCalledWith('newPassword456')
      expect(mockRepo.update).toHaveBeenCalledOnce()
      expect(result).not.toHaveProperty('password')
    })

    it('should throw NOT_FOUND if user does not exist', async () => {
      mockRepo.getById.mockResolvedValue(null)

      await expect(service.changePassword({
        id: 'bad_id',
        password: 'old',
        newPassword: 'new'
      })).rejects.toMatchObject({ code: ERROR_CODE.NOT_FOUND })
    })

    it('should throw INVALID_INPUT if current password is incorrect', async () => {
      vi.mocked(Hasher.compare).mockResolvedValue(false)
      mockRepo.getById.mockResolvedValue(user)

      await expect(service.changePassword({
        id: user.toDTO().id,
        password: 'wrongPassword',
        newPassword: 'newPassword'
      })).rejects.toMatchObject({ code: ERROR_CODE.INVALID_INPUT })
    })

    it('should throw ACCESS_DENIED if target user is OWNER (#protectProtocol)', async () => {
      const ownerUser = makeUser({ role: 'OWNER' })
      mockRepo.getById.mockResolvedValue(ownerUser)

      await expect(service.changePassword({
        id: ownerUser.toDTO().id,
        password: 'old',
        newPassword: 'new'
      })).rejects.toMatchObject({ code: ERROR_CODE.ACCESS_DENIED })
    })
  })

  // ── upgradeUser ──────────────────────────────────────────────────────────────

  describe('upgradeUser', () => {
    it('should update user role and enabled status', async () => {
      mockRepo.getById.mockResolvedValue(user)
      const updatedDto = { ...user.toDTO(), role: 'ADMIN', enabled: false }
      mockRepo.update.mockResolvedValue(updatedDto)

      const result = await service.upgradeUser(user.toDTO().id, { role: 'ADMIN', enabled: false })

      expect(mockRepo.update).toHaveBeenCalledOnce()
      expect(result.role).toBe('ADMIN')
      expect(result.enabled).toBe(false)
    })

    it('should throw ROLE_NOT_ALLOWED if new role is invalid', async () => {
      await expect(service.upgradeUser(user.toDTO().id, { role: 'SUPERUSER', enabled: true }))
        .rejects.toMatchObject({ code: ERROR_CODE.ROLE_NOT_ALLOWED })
    })

    it('should throw NOT_FOUND if user does not exist', async () => {
      mockRepo.getById.mockResolvedValue(null)

      await expect(service.upgradeUser('bad_id', { role: 'ADMIN', enabled: true }))
        .rejects.toMatchObject({ code: ERROR_CODE.NOT_FOUND })
    })

    it('should throw ACCESS_DENIED if target user has OWNER role (#protectProtocol)', async () => {
      const ownerUser = makeUser({ role: 'OWNER' })
      mockRepo.getById.mockResolvedValue(ownerUser)

      await expect(service.upgradeUser(ownerUser.toDTO().id, { role: 'ADMIN', enabled: true }))
        .rejects.toMatchObject({ code: ERROR_CODE.ACCESS_DENIED })
    })
  })

  // ── deleteUser ───────────────────────────────────────────────────────────────

  describe('deleteUser', () => {
    it('should delete user and handle associated image deletion', async () => {
      mockRepo.getById.mockResolvedValue(user)
      mockRepo.delete.mockResolvedValue(undefined)
      mockHandleImageDelete.mockResolvedValue(undefined)

      const result = await service.deleteUser(user.toDTO().id)

      expect(mockRepo.delete).toHaveBeenCalledWith(user.toDTO().id)
      expect(mockHandleImageDelete).toHaveBeenCalledWith('https://res.cloudinary.com/demo/image/upload/sample.jpg')
      expect(result).toBe('User with email: user@test.com deleted successfully')
    })

    it('should throw NOT_FOUND if user does not exist', async () => {
      mockRepo.getById.mockResolvedValue(null)

      await expect(service.deleteUser('bad_id'))
        .rejects.toMatchObject({ code: ERROR_CODE.NOT_FOUND })
    })

    it('should throw ACCESS_DENIED when attempting to delete an OWNER user (#protectProtocol)', async () => {
      const ownerUser = makeUser({ role: 'OWNER' })
      mockRepo.getById.mockResolvedValue(ownerUser)

      await expect(service.deleteUser(ownerUser.toDTO().id))
        .rejects.toMatchObject({ code: ERROR_CODE.ACCESS_DENIED })
    })
  })

  // ── login ─────────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should return user DTO when credentials are valid and user is enabled', async () => {
      vi.mocked(Hasher.compare).mockResolvedValue(true)
      mockRepo.findByEmail.mockResolvedValue(user)

      const result = await service.login('user@test.com', 'correctPassword')

      expect(Hasher.compare).toHaveBeenCalledWith('correctPassword', VALID_HASH)
      expect(result).toEqual(user.toDTO())
      expect(result).not.toHaveProperty('password')
    })

    it('should throw NOT_FOUND if email does not exist', async () => {
      mockRepo.findByEmail.mockResolvedValue(null)

      await expect(service.login('notfound@test.com', 'password'))
        .rejects.toMatchObject({ code: ERROR_CODE.NOT_FOUND })
    })

    it('should throw ACCESS_DENIED with message "User blocked" if user is disabled', async () => {
      const disabledUser = makeUser({ enabled: false })
      mockRepo.findByEmail.mockResolvedValue(disabledUser)

      await expect(service.login('user@test.com', 'password'))
        .rejects.toMatchObject({ code: ERROR_CODE.ACCESS_DENIED, message: 'User blocked' })
    })

    it('should throw INVALID_INPUT if password is incorrect', async () => {
      vi.mocked(Hasher.compare).mockResolvedValue(false)
      mockRepo.findByEmail.mockResolvedValue(user)

      await expect(service.login('user@test.com', 'wrongPassword'))
        .rejects.toMatchObject({ code: ERROR_CODE.INVALID_INPUT })
    })
  })

  // ── getAllUsers ───────────────────────────────────────────────────────────────

  describe('getAllUsers', () => {
    it('should return list mapped to public user objects without password', async () => {
      mockRepo.getAll.mockResolvedValue([user.toPersistence()])

      const result = await service.getAllUsers()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: TEST_ID,
        email: 'user@test.com',
        role: 'USER',
        name: 'Test User',
        nickname: 'testuser',
        picture: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        enabled: true
      })
      expect(result[0]).not.toHaveProperty('password')
    })

    it('should return an empty array if no users exist', async () => {
      mockRepo.getAll.mockResolvedValue([])

      const result = await service.getAllUsers()

      expect(result).toEqual([])
    })
  })

  // ── getUserById ───────────────────────────────────────────────────────────────

  describe('getUserById', () => {
    it('should delegate to repository getPublicById and return the result', async () => {
      const dto = user.toDTO()
      mockRepo.getPublicById.mockResolvedValue(dto)

      const result = await service.getUserById(TEST_ID)

      expect(mockRepo.getPublicById).toHaveBeenCalledWith(TEST_ID)
      expect(result).toEqual(dto)
    })

    it('should return null if getPublicById does not find user', async () => {
      mockRepo.getPublicById.mockResolvedValue(null)

      const result = await service.getUserById('non_existent')

      expect(result).toBeNull()
    })
  })
})`
},
{ 
  path:`/${options.sourceFolderName}/features/user/UserService.ts`,
  file:`import type { UserProps, UserUpdate } from './User.js'
import { User } from './User.js'
import type { UserRepository } from './UserRepository.js'
import type { IUser } from './User.interfaces.js'
import { Hasher } from '../../shared/utils/Hasher.js'
import { throwError, ERROR_CODE } from '../../configs/errors.js'

export class UserService {
  private userRepository: UserRepository
  private handleImageDelete: (url:string) => Promise<string | undefined>

  constructor(
    userRepository: UserRepository,
    handleImageDelete: (url:string) => Promise<string | undefined>,
  ) {
    this.userRepository = userRepository
    this.handleImageDelete= handleImageDelete
  }
  private mapToPublic(record:any):Omit<UserProps, 'password'> {
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

  /**
     * Registra un nuevo usuario en el sistema.
     * Hashea la contraseña y delega la creación a la Entidad y al Repositorio.
     */
  async registerUser(data: { email: string; password: string } ): Promise<IUser> {
    // 1. Hashear la contraseña (preocupación de infraestructura/aplicación)
    const hashedPassword = await Hasher.hash(data.password)

    // 2. Crear la Entidad de Dominio (esto genera el UUID y valida reglas)
    const newUser = User.register({
      email: data.email,
      hashedPassword
    })

    // 3. Guardar en la base de datos (El repositorio valida si el email ya existe)
    await this.userRepository.save(newUser)

    // 4. Retornamos el DTO
    return newUser.toDTO()
  }

  /**
     * Actualiza el perfil básico del usuario.
     */
  async updateProfile(id: string, updateData: UserUpdate): Promise<IUser> {
    let oldPictureUrl:string | undefined = undefined
    let execFunction: boolean = false
    
        
    // 1. Buscar el usuario existente
    const user = await this.userRepository.getById(id)
    if (!user) {
      throwError(ERROR_CODE.NOT_FOUND, 'User not found')
    }
    const oldUser = user!.toDTO()
    UserService.#protectProtocol(oldUser.role)

    if(oldUser.picture !==  updateData.picture){
      oldPictureUrl = oldUser.picture
      execFunction = true
    }

        // 2. Modificar el estado a través de los métodos de dominio
        user!.updateProfile(updateData)

        // 3. Guardar los cambios (usamos update para estar seguros de que no es creación)
        const updatedUser = await this.userRepository.update(id, user!)
        
        if(execFunction && oldPictureUrl !== undefined){
          await this.handleImageDelete(oldPictureUrl)
        }
        return updatedUser
  }

  /**
     * Cambia la contraseña de un usuario existente.
     */
  async changePassword(data:{ id: string, password:string, newPassword: string}): Promise<IUser> {
    const user = await this.userRepository.getById(data.id)
    if (!user) {
      throwError(ERROR_CODE.NOT_FOUND, 'User not found')
    }
    const oldUser = user!.toPersistence()
    UserService.#protectProtocol(oldUser.role)
    const passwordMatch = await Hasher.compare( data.password, oldUser.password)
    if(!passwordMatch){ throwError(ERROR_CODE.INVALID_INPUT, 'Invalid password')}

    const newHashedPassword = await Hasher.hash(data.newPassword)
        
        user!.changePassword(newHashedPassword)

        const updatedUser = await this.userRepository.update(data.id, user!)
        return updatedUser
  }

  /**
     * Deshabilita un usuario.
     */
  async upgradeUser(userId: string, data:{role:string, enabled: boolean}): Promise<IUser> {

        const allowedNewRole =  [ 'OWNER', 'ADMIN','USER']
    if(!allowedNewRole.includes(data.role)){throwError(ERROR_CODE.ROLE_NOT_ALLOWED, 'Invalid role')}

    const user = await this.userRepository.getById(userId)
    if (!user) {
      throwError(ERROR_CODE.NOT_FOUND, 'User not found')
    }
    const oldUser = user!.toPersistence()
    UserService.#protectProtocol(oldUser!.role)

    user!.changeUserScope(data.role, data.enabled)

      const updatedUser = await this.userRepository.update(userId, user!)
        return updatedUser

  }

  /**
     * Elimina a un usuario
     */
  async deleteUser(userId:string){
    const user = await this.userRepository.getById(userId)
    if(!user) throwError(ERROR_CODE.NOT_FOUND, 'User not found')
    const userForDelete = user!.toDTO()
    UserService.#protectProtocol(userForDelete.role)
    const oldPictureUrl = userForDelete.picture
    const message = userForDelete.email
    await this.userRepository.delete(userId)
    await this.handleImageDelete(oldPictureUrl)
    return \`User with email: \${message} deleted successfully\`
  }
  /**
     * Compara el password y enabled y da acceso al usuario
     */
  async login(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.findByEmail(email)
    const dummyHash = '$2b$10$e8W/Z63kP6V10M.0m8WpCeQ2w.U5O20vJ/5N/xXJ3xXJ3xXJ3xXJ'

    if (!user) {
      await Hasher.compare(password, dummyHash)
      throwError(ERROR_CODE.INVALID_CREDENTIALS, 'Invalid credentials')
    }

    const passwordMatch = await Hasher.compare(password, user.toPersistence().password)

    if (!passwordMatch || user.toDTO().enabled === false) {
      throwError(ERROR_CODE.INVALID_CREDENTIALS, 'Invalid credentials')
    }

    return user.toDTO()
  }
  /**
     * 
     * Entrega un array de usuarios
     */
  async getAllUsers(){
    const users = await this.userRepository.getAll()
    return users.map(user => this.mapToPublic(user))
  }
  async getUserById(userId:string){
   return await this.userRepository.getPublicById(userId)
  
  }
  static #protectProtocol(role: string):void {
    if(role === 'OWNER')throwError(ERROR_CODE.ACCESS_DENIED, 'Do not edited OWNER user')
  }
}
`
}
    ]
}