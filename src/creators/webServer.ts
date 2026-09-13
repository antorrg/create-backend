import { CreatorOptions, prepareProjectDirectory, logSuccessMessage, createProjectFile } from "./common.js";
import { Colors, promptInput, promptList } from "../cli/cliNative.js";
import { optionServer, optionAuth  } from "../setups/webServer/options.js";
import * as temp from '../templates/index.templates.js'


export async function createWebServer(options: CreatorOptions): Promise<void> {

  const selectedServer = await promptList<string>(
    "Escoja el framework y la persistencia",
    optionServer
  )
    const selectedAuth = await promptList<string>(
    "Escoja el tipo de autenticacion",
    optionAuth
  )
  console.log(`\n${Colors.cyan}🚀 Iniciando creación de Servidor Web para '${options.projectName}'...${Colors.reset}`);
    console.time('ejecucion constructor ')
  const projectPath = await prepareProjectDirectory(options);
  const finalOptions = {
    ...options,
    selectedServer,
    selectedAuth,
    swaggerOption: false
  }
  console.log('coleccion de opciones hasta ahora: ',finalOptions)

  const serverFilesFramework = finalOptions.selectedServer.endsWith('-pris')
          ? temp.prismaBase(finalOptions) 
          : temp.sequelizeBase(finalOptions)
  
  const serverFilesServer = temp.baseServer(finalOptions)
  const serverFiles2 = temp.express(finalOptions)
  const serverFilesLogger = temp.loggerTs(finalOptions)
  const serverFiles4 = temp.baseApp(finalOptions)
  const serverFilesAuth = temp.generalBaseAuth(finalOptions)
  selectedAuth.endsWith('-session')? serverFiles4.push(...serverFilesAuth): null

  const bases = [
    ...serverFilesFramework,
    ...serverFilesServer,
    ...serverFiles2,
    ...serverFilesLogger, 
    ...serverFiles4,
  ].flat(1)

  // Paralelizar creación de archivos
  await Promise.all(
    bases.map(server => 
      createProjectFile(finalOptions.projectName, server.path, server.file)
    )
  )
  
  // Aquí se invocarán las funciones creadoras específicas de Servidor Web
  console.log(`[creator:webServer] Ejecutando creadores de archivos para Servidor Web...`);
  
  // Ejemplo / Stub preparado para integrar la generación específica
  console.log(`[creator:webServer] TODO: Implementar plantillas específicas de Servidor Web en ${projectPath}`);

  console.timeEnd('ejecucion constructor ')
  logSuccessMessage(options.projectName, "Servidor Web");
  process.exit(0)
}
/*  const projectType = await promptList<"functionality" | "webServer" | "nextServer" | "electronNode">(
    "¿Qué necesita crear?",
    [
      { name: "1) Funcionalidad", value: "functionality" },
      { name: "2) Servidor web", value: "webServer" },
      { name: "3) Servidor next.js", value: "nextServer" },
      { name: "4) Backend node (electron)", value: "electronNode" },
    ]
  );*/