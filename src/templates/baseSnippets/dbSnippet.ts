
export function dbSnippet(selectedServer: string){
      if (selectedServer.endsWith('-pris')) return postgresLines
      if(selectedServer.endsWith('-seq'))  return postgresLines
        if (selectedServer.endsWith('-single')) return singleLines
    return postgresLines
}
/*export function controllerInjectorSnippets(selectedServer: string) {
  if (selectedServer.startsWith('ex-')) return expressLoggerController
  //if (selectedServer.startsWith('fast-')) return fastifyErrorHandlerSnippet
  // futuro: next, electron
  return expressLoggerController
}*/
const postgresLines = {
environmentLine: 'DATABASE_URL=postgres://userName:password@localhost:5432/dbName',
envConfigLine: `,
   DatabaseUrl: getStringEnv('DATABASE_URL')`,
}
const singleLines = {
environmentLine: '',
envConfigLine: ``,
}