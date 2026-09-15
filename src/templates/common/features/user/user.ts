// user, userApplications, userTest

export const user = `import envConfig from '../../configs/envConfig.js'
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

}`
export const userApplications = `import { UuidHandler } from '../../../shared/utils/UuidHandler.js'

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
export const userTest = `import { describe, it, expect, beforeEach } from 'vitest'
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