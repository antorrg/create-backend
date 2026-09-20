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
export type AppOrm = 'none'|'sequelize'| 'prisma'| 'mongoose'
export type SelectedAuth = 'auth-null'| 'auth-session'
export type FileConstructor = {
  path: string
  file: string
}
export type FileInjector = {
  subPath: string
  file: string
}
/*type BaseOptions = {
    projectName: string
    jsonProjectName: string
    sourceFolderName: string
    targetDir: string
}

type WebServerOptions = CreatorOptions & {
    projectType: 'webServer'
    selectedServer: ServerFramework
    selectedOrm: AppOrm
    selectedAuth: SelectedAuth
    swaggerOption: boolean
}

type NextServerOptions = CreatorOptions & {
    projectType: 'nextServer'
    selectedOrm: AppOrm
}

type ElectronNodeOptions = CreatorOptions & {
    projectType: 'electronNode'
    selectedOrm: AppOrm
}

export type FilePattern =
    | WebServerOptions
    | NextServerOptions
    | ElectronNodeOptions
    
*/