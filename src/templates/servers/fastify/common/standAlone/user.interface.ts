export const userInterfaces = `export interface ServiceResponse<T = unknown> {}
export type TCreate<T> = Partial<T>
export type TUpdate<T> = Partial<Omit<T,'id'>>


export interface IGenericService<T, TCreate, TUpdate> {
  create(data: TCreate): Promise<ServiceResponse<T>> | ServiceResponse<T>
  getAll(): Promise<ServiceResponse<T[]>> | ServiceResponse<T[]>
  getById(id: string|number): Promise<ServiceResponse<T>> | ServiceResponse<T>
  update(id: string| number, data: TUpdate): Promise<ServiceResponse<T>> | ServiceResponse<T>
  delete(id: string| number): Promise<ServiceResponse<T>> | ServiceResponse<T>
}`