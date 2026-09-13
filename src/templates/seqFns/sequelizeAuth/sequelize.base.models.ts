 import { FilePattern } from "../../../types.js"
 import * as m from './sequelizeModels.js'


export const sequelizeBaseModels = (options: FilePattern) => {
const session ={ path:`/${options.sourceFolderName}/models/${m.sessionModel.subPath}`, file: m.sessionModel.file}
const refresh ={ path:`/${options.sourceFolderName}/models/${m.refreshModel.subPath}`, file: m.refreshModel.file}
const models = [{ path:`/${options.sourceFolderName}/models/${m.userModel.subPath}`, file: m.userModel.file},
                  {path:`/${options.sourceFolderName}/models/${m.logModel.subPath}`, file: m.logModel.file},
                ]
    if(options.selectedAuth.endsWith('-session')){
      models.push(session)
    }
    if(options.selectedAuth.endsWith('-jwt-db')){
      models.push(refresh)
    }
    return models
}
