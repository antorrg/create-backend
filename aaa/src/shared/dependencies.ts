import type { IExternalImageDeleteService } from './interfaces/base.interface.js'
import { UserRepository } from '../features/user/UserRepository.js'
import { UserService } from '../features/user/UserService.js'


export const mockImageDeleteService: IExternalImageDeleteService<any> = {
  deleteImage: async (_imageInfo: any) => await Promise.resolve('true')
}

export const userRepository = new UserRepository()
export const userService = new UserService(userRepository, mockImageDeleteService.deleteImage)