 import { ProjectConfig } from "../../../../types.js"
 import * as s from './drizzle.schemas.js'


export const drizzleBaseSchemas = (options: ProjectConfig) => {
const session ={ path:`/${options.sourceFolderName}/schemas/${s.sessionSchema.subPath}`, file: s.sessionSchema.file}
const schemas = [{ path:`/${options.sourceFolderName}/schemas/${s.userSchema.subPath}`, file: s.userSchema.file},
                  {path:`/${options.sourceFolderName}/schemas/${s.logSchema.subPath}`, file: s.logSchema.file},
                ]
    if(options.selectedAuth.endsWith('-session')){
      schemas.push(session)
    }
    return schemas

}
