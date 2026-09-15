import type { FilePattern } from "../../types.js"
import * as dep from './common/index.js'
import { getErrorHandlerSnippet, getErrorHandlerTestSnippet, getErrorExportsSnippet } from "./getErrorHandlerSnippets.js"

export const errorsTemplate = (options: FilePattern) => {
    const errorHandler = getErrorHandlerSnippet(options.selectedServer)
    const errorHandlerTest = getErrorHandlerTestSnippet(options.selectedServer)
    const errorExport = getErrorExportsSnippet(options.selectedServer)
// Include statusMap in function scope
const statusMap = {
  path: `/${options.sourceFolderName}/configs/errors/errorStatusMap.ts`,
  file: dep.statusMap
}

   const code = [
{
   path: `/${options.sourceFolderName}/configs/errors/errorCodes.ts`,
  file: dep.errorCodes
},
{
  path: `/${options.sourceFolderName}/configs/errors/errorHandlers.ts`,
  file: `import logger from '../logger.js'
${errorHandler.imports}
import { ERROR_CODE, type ErrorCode } from './errorCodes.js'
${options.projectType === 'webServer'? `import { ErrorStatus } from './errorStatusMap.js'`: ''}
${dep.errorHandler}


${errorHandler.handler}

  `
},
{
  path: `/${options.sourceFolderName}/configs/errors/errorHandlers.test.ts`,
  file: `import { describe, it, expect, vi, beforeEach } from 'vitest'
${errorHandlerTest.imports}
${dep.errorTest}
${errorHandlerTest.handler}
})
  `
},

{
 path: `/${options.sourceFolderName}/configs/errors.ts`,
 file: `
 ${errorExport.imports}
 ${errorExport.handler}
 `
},
    ]
 if(options.projectType === 'webServer'){
    code.push(statusMap)
 }
    return code
}

