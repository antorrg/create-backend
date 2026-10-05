import { throwError } from '../../configs/errors.js'
import type { IUser, UserCreate, UserUpdate } from './users.js'
import type { ServiceResponse, IGenericService, TUpdate } from './user.interface.js'
import { UuidHandler } from '../../shared/utils/UuidHandler.js'


export class UserService implements IGenericService<IUser,UserCreate, UserUpdate > {
  private Model: IUser[]

  constructor(Model: IUser[]) {
    this.Model = Model
  }

  // Crear un nuevo usuario
  create(data: { name: string; username: string; email: string; enable?: boolean; phone?: number }): ServiceResponse<IUser> {
    const newId = UuidHandler.createUuid()
    const randomSevenDigit = () => Math.floor(1000000 + Math.random() * 9000000)

    const newUser: IUser = {
      id: newId,
      name: data.name,
      username: data.username,
      email: data.email,
      enabled: true,
      phone: data.phone ?? randomSevenDigit()
    }
    this.Model.push(newUser)
    return newUser
  }

  // Obtener todos los usuarios
  getAll(): ServiceResponse<IUser[]> {
    return  this.Model
    
  }

  // Obtener un usuario por ID
  getById(id: string): ServiceResponse<IUser> {
   
    const response = this.Model.find(user => user.id === id)
    if (!response) {
      throwError('User not found')
    }
    return  response!
  }

  // Actualizar un usuario por ID
  update(id: string, newData: TUpdate<IUser>): ServiceResponse<IUser> {
    const index = this.Model.findIndex(user => user.id === id)
    if (index === -1) {
      throwError('This user do not exists')
    }

    this.Model[index] = { ...this.Model[index], ...newData }
    return this.Model[index]
  }

  // Eliminar un usuario por ID
  delete(id: string): ServiceResponse<IUser> {
    const index = this.Model.findIndex(user => user.id === id)
    if (!index) {
      throwError('User not found')
    }
    const deleted = this.Model.splice(index, 1)[0]
    return `User ${deleted.name} deleted successfully`
  }
}

export default UserService
