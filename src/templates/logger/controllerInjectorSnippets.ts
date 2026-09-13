import { expressLoggerController } from "../express/snippets/expressLoggerController.js"

export function controllerInjectorSnippets(selectedServer: string) {
  if (selectedServer.startsWith('ex-')) return expressLoggerController
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return expressLoggerController
}