export interface CreatorOptions {
  projectType: ProjectType
  jsonProjectName:string
  projectName: string;
  targetDir: string;
  sourceFolderName: string
}
export type NameProject = {
  projectName:string
  jsonProjectName:string
}
export type ProjectConfig = CreatorOptions & {
  selectedServer: ServerFramework
  selectedOrm: AppOrm
  selectedAuth: SelectedAuth,
  swaggerOption: boolean
}
export type ProjectType =  "webServer" | "nextServer" | "electronNode"
export type ServerFramework = 'express' | 'fastify'
export type AppOrm = 'none'|'sequelize'| 'prisma'| 'drizzle'
export type SelectedAuth = 'auth-null'| 'auth-session'
export type FileConstructor = {
  path: string
  file: string
}
export type FileInjector = {
  subPath: string
  file: string
}
