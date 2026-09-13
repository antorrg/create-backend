import { expressJsonSnippet } from "../express/snippets/expressDepsSnippet.js"

export function getFramDependencies(selectedServer: string) {
   if (selectedServer.startsWith('ex-')) return expressJsonSnippet
  //if (selectedServer === 'ex-seq' ||selectedServer === 'fast-seq') return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return expressJsonSnippet
}