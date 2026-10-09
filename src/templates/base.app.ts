import type { ProjectConfig} from "../types.js"
import * as dep from './baseApp/files/index.js'

/**
 * 
 * @param options 
 * @returns 
 * base.interfaces, 
 * dependencies.ts, 
 * uuidHandler.ts, 
 * hasher, 
 * userApplications, 
 * userinterfaces, 
 * userTest, 
 * user, 
 * userServiceTest, 
 * userService
 */
export const baseApp = (options:ProjectConfig)=>{

    const finalApp = [

{
  path:`/${options.sourceFolderName}/shared/utils/UuidHandler.ts`,
  file: dep.uuidHandler
},
{
  path:`/${options.sourceFolderName}/shared/utils/Hasher.ts`,
  file: dep.hasher
},
    ]
  const applicationWithDb = [
    {
    path:`/${options.sourceFolderName}/shared/interfaces/base.interface.ts`,
    file: dep.baseInterface
    },
    {
      path:`/${options.sourceFolderName}/shared/dependencies.ts`,
      file: dep.dependencies
    },
    {
        path: `/${options.sourceFolderName}/features/user/applications/UserApplications.ts`,
        file: dep.userApplications
      },
      { 
        path:`/${options.sourceFolderName}/features/user/User.interfaces.ts`,
        file: dep.userInterface
      },
      { 
        path:`/${options.sourceFolderName}/features/user/User.test.ts`,
        file: dep.userTest
      },
      { 
        path:`/${options.sourceFolderName}/features/user/User.ts`,
        file: dep.user
      },
      { 
        path:`/${options.sourceFolderName}/features/user/UserService.test.ts`,
        file: dep.userServiceTest
      },
      { 
        path:`/${options.sourceFolderName}/features/user/UserService.ts`,
        file:dep.userService
      }
  ]
  if(options.selectedOrm !== 'none'){
    applicationWithDb.map(obj => finalApp.push(obj))
  }
    return finalApp
}