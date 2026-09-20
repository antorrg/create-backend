import type { FileConstructor, FilePattern, ServerFramework } from "../../types.js"
import {authSessionExpress} from './express/auth.session.express.js'
import { authSessionFastify } from "./fastify/auth.session.fastify.js"

type SessionFrameworkHandler = (options: FilePattern) => FileConstructor[]

const sessionFrameworkHandlers: Partial<Record<ServerFramework, SessionFrameworkHandler>> = {
  express: authSessionExpress,
  fastify: authSessionFastify
}

export const sessionFrameworkSnippet = (options: FilePattern) => {
  const handler = sessionFrameworkHandlers[options.selectedServer]

  if (!handler) {
    throw new Error(
      `Framework "${options.selectedServer}" not implemented yet`
    )
  }

  return handler(options)
}

// export const sessionFrameworkSnippet = (options:FilePattern) => {
//     switch(options.selectedServer){
//         case 'express':
//             return authSessionExpress(options)
//         default: 
//             throw new Error('Framework not implemented yet')
//     }
// }