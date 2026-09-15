import type { FilePattern } from "../../types.js"
import * as dep from './common/index.js'
import { ormInjectorLog } from "./ormInjector.js"
import { controllerInjectorSnippets } from "./controllerInjectorSnippets.js"

export const loggerTs = (options:FilePattern)=>{
  const serviceDb = ormInjectorLog(options.selectedOrm)
  const controllerLog = controllerInjectorSnippets(options.selectedServer)

    return[

{
//# Crear archivo de manejo de errores de Express
path: `/${options.sourceFolderName}/configs/logger.ts`,
file: dep.logger
},
{

path: `/${options.sourceFolderName}/configs/logger/transports/fileTransport.ts`,
file: dep.fileTransport

},
{


path: `/${options.sourceFolderName}/configs/logger/transports/dbTransport.ts`,
file: dep.dbTransport

},
{

path: `/${options.sourceFolderName}/configs/logger/Logger.interfaces.ts`,
file: `
import type { LogLevel } from ${serviceDb.importType}
${dep.loggerInterface}
`
},
{
   path:`/${options.sourceFolderName}/configs/logger/LoggerServiceDb.ts`,
   file:`${serviceDb.file}`
},
        {
path:`/${options.sourceFolderName}/configs/logger/${controllerLog.subPath}`,
file: `${controllerLog.file}`
        }
]
}

