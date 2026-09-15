import { expressJsonSnippet } from "../servers/express/snippets/expressDepsSnippet.js"

export function getFramDependencies(selectedServer: string) {
   if (selectedServer === 'express') return expressJsonSnippet
  //if (selectedServer === 'ex-seq' ||selectedServer === 'fast-seq') return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return expressJsonSnippet
}