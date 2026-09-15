// dependencies, uuidHandler, hasher

export const dependencies = `import type { IExternalImageDeleteService } from './interfaces/base.interface.js'
import { UserRepository } from '../features/user/UserRepository.js'
import { UserService } from '../features/user/UserService.js'


export const mockImageDeleteService: IExternalImageDeleteService<any> = {
  deleteImage: async (_imageInfo: any) => await Promise.resolve('true')
}

export const userRepository = new UserRepository()
export const userService = new UserService(userRepository, mockImageDeleteService.deleteImage)`

export const uuidHandler =`import {v7 as uuid } from 'uuid'

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
export const hasher = `import bcrypt from 'bcrypt'


export class Hasher{
    static hash = async(value:string):Promise<string> => {
        return await bcrypt.hash(value, 12)
    }
    static compare = async(value:string, hash:string):Promise<boolean>=>{
        return await bcrypt.compare(value, hash)
    }
}
`