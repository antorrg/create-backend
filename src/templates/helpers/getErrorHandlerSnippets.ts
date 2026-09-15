import * as exHand from '../servers/express/snippets/expressErrorHandler.snippet.js'
//import { fastifyErrorHandlerSnippet } from './fastify/fastify.snippet.js'


export function getErrorHandlerSnippet(selectedServer: string) {
  if (selectedServer === 'express') return exHand.expressErrorHandlerSnippet
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return exHand.expressErrorHandlerSnippet
}
export function getErrorHandlerTestSnippet(selectedServer: string) {
  if (selectedServer === 'express') return exHand.expressErrorHandlerTestSnippet
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return exHand.expressErrorHandlerTestSnippet
}
export function getErrorExportsSnippet(selectedServer: string) {
  if (selectedServer === 'express') return exHand.expressErrorExportsSnippet
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return exHand.expressErrorExportsSnippet
}
