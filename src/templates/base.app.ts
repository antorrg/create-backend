import type { FilePattern } from "../types.js"
import * as dep from './common/index.js'

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
export const baseApp = (options:FilePattern)=>{

    return[

{
path:`/${options.sourceFolderName}/shared/interfaces/base.interface.ts`,
file: dep.baseInterface
},
{
  path:`/${options.sourceFolderName}/shared/dependencies.ts`,
  file: dep.dependencies
},
{
  path:`/${options.sourceFolderName}/shared/utils/UuidHandler.ts`,
  file: dep.uuidHandler
},
{
  path:`/${options.sourceFolderName}/shared/utils/Hasher.ts`,
  file: dep.hasher
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
}