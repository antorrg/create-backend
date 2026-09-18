import {FilePattern } from '../../types.js'
import * as exHand from '../servers/express/snippets/expressErrorHandler.snippet.js'
import * as fastHand from '../servers/fastify/snippets/fastifyErrorHandler.snippet.js'


export function getErrorHandlerSnippets(options:FilePattern){
   switch(options.selectedServer){
    case 'express':
      return {
        error:exHand.expressErrorHandlerSnippet,
        errorTest: exHand.expressErrorHandlerTestSnippet,
        exports: exHand.expressErrorExportsSnippet
      }
    case 'fastify':
      return {
        error:fastHand.fastifyErrorHandlerSnippet,
        errorTest:fastHand.fastifyErrorHandlerTestSnippet,
        exports: fastHand.fastifyErrorExportsSnippet
      }
    default: 
      throw new Error(`This framework ${options.selectedServer} is not implemented yet`)
  }
}
