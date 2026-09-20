import type { ProjectConfig } from "../../../types.js"
import { seqAuthIndex } from "./sequelize.auth.index.js"
import { sequelizeBaseModels } from './sequelizeModels/sequelize.base.models.js'
import * as dep from './files/index.js'


export const sequelizeBase = (options:ProjectConfig)=>{
  const authIndex = seqAuthIndex(options)
  const models = sequelizeBaseModels(options)
  return[
    {
        path: `/${options.sourceFolderName}/models/index.model.ts`,
        file: `import User from './user.model.js'
import Log from './log.model.js'
${authIndex.import}

export default {
    User,
    Log,${authIndex.line}
}`
    },
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//************** Commons files **************//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     {
        path:`/${options.sourceFolderName}/configs/database.ts`,
        file: `${dep.database1}
  Log,${authIndex.line}
${dep.database2}
    Log,${authIndex.line}
    sequelize,
    startUp,
    closeDatabase
}`
    },    
    {
        path:`/${options.sourceFolderName}/shared/repositories/BaseRepository.ts`,
        file: dep.baseRepository
    },    
    {
        path:`/${options.sourceFolderName}/shared/repositories/testHelpers/testHelp.help.ts`,
        file: dep.baseRepositoryTestHelp
    },
    {
        path:`/${options.sourceFolderName}/shared/repositories/BaseRepository.test.ts`,
        file: dep.baseRepositoryTest
    },
        {
        path:`/${options.sourceFolderName}/features/user/UserRepository.ts`,
        file: dep.userRepository
   },
...models
      /*  {
        path:`/${options.sourceFolderName}`,
        file: ``
    },
        {
        path:`/${options.sourceFolderName}`,
        file: ``
    }*/
  ]}