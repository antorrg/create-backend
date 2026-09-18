export type FilePattern = {
  projectType:string
  projectName: string
  sourceFolderName: string
  targetDir: string
  selectedServer: ServerFramework
  selectedOrm: AppOrm
  selectedAuth: string,
  swaggerOption: boolean
}
export type ProjectType =  "webServer" | "nextServer" | "electronNode"
export type ServerFramework = 'express' | 'fastify'
export type AppOrm = 'none'|'sequelize'| 'prisma'| 'mongoose'
export type FileConstructor = {
  path: string
  file: string
}
export type FileInjector = {
  subPath: string
  file: string
}