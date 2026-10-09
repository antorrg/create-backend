import type { ProjectConfig } from "../../../types.js"
import { drizzleAuthIndex } from "./drizzle.auth.index.js"
import { drizzleBaseSchemas } from './drizzleSchemas/drizzle.base.schemas.js'
import * as dep from './files/index.js'


export const drizzleBase = (options:ProjectConfig)=>{
  const authIndex = drizzleAuthIndex(options)
  const models = drizzleBaseSchemas(options)
  const files = [
    {
        path: `/${options.sourceFolderName}/schemas/index.schemas.ts`,
        file: `import { user, enumRole } from './user.schema.js'
import {log, LogLevel} from './log.schema.js'
${authIndex.import}

export {
    user,
    enumRole,
    log,
    LogLevel,${authIndex.line}
}`
    },
{
path: `/drizzle.config.ts`,
file: `import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'


export default {
  schema: './src/schemas/index.schemas.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
`
},
{
  path:`/.env`,
  file: `# 

DATABASE_URL="postgres://postgres:password@localhost:5432/dbName"`
},
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//************** Commons files **************//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     {
        path:`/${options.sourceFolderName}/configs/database.ts`,
        file: dep.database
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
  ]
return files
}