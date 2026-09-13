import * as exHand from '../express/snippets/expressErrorHandler.snippet.js'
//import { fastifyErrorHandlerSnippet } from './fastify/fastify.snippet.js'


export function getErrorHandlerSnippet(selectedServer: string) {
  if (selectedServer.startsWith('ex-')) return exHand.expressErrorHandlerSnippet
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return exHand.expressErrorHandlerSnippet
}
export function getErrorHandlerTestSnippet(selectedServer: string) {
  if (selectedServer.startsWith('ex-')) return exHand.expressErrorHandlerTestSnippet
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return exHand.expressErrorHandlerTestSnippet
}
export function getErrorExportsSnippet(selectedServer: string) {
  if (selectedServer.startsWith('ex-')) return exHand.expressErrorExportsSnippet
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return exHand.expressErrorExportsSnippet
}
