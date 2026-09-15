import { CreatorOptions, prepareProjectDirectory, logSuccessMessage, createProjectFile } from "./common.js";
import { Colors, promptInput, promptList, promptListObject } from "../cli/cliNative.js";
import { optionServer, optionAuth, type Value } from "../options.js";
import * as temp from '../templates/index.templates.js'


export async function createWebServer(options: CreatorOptions): Promise<void> {

  const serverConfig = await promptListObject<Value>(
    "Select framework and persistence",
    optionServer
  );
  const selectedAuth = await promptList<string>(
    "Select authentication type",
    optionAuth
  );
  console.log(`\n${Colors.cyan}🚀 Starting Web Server creation for '${options.projectName}'...${Colors.reset}`);
  console.time('constructor execution ')
  const projectPath = await prepareProjectDirectory(options);
  const finalOptions = {
    ...options,
    selectedServer: serverConfig.framework,
    selectedOrm: serverConfig.persistence,
    selectedAuth,
    swaggerOption: false
  }
 console.log('options collection so far: ',finalOptions)
  // Specific Web Server creator functions will be invoked here
  console.log(`[creator:webServer] Running file creators for Web Server...`);
  
  const serverFilesOrm = finalOptions.selectedServer.endsWith('-pris')
          ? temp.prismaBase(finalOptions) 
          : temp.sequelizeBase(finalOptions)
  
  const serverFilesServer = temp.baseServer(finalOptions)
  const serverFiles2 = temp.express(finalOptions)
  const serverFilesLogger = temp.loggerTs(finalOptions)
  const serverFilesErrors = temp.errorsTemplate(finalOptions)
  const serverFilesApp = temp.baseApp(finalOptions)
  const serverFilesAuth = temp.generalBaseAuth(finalOptions)
  selectedAuth.endsWith('-session')? serverFiles2.push(...serverFilesAuth): null

  const bases = [
    ...serverFilesOrm,
    ...serverFilesServer,
    ...serverFiles2,
    ...serverFilesLogger,
    ...serverFilesErrors,
    ...serverFilesApp,
  ].flat(1)

  // Parallelize file creation
  await Promise.all(
    bases.map(server => 
      createProjectFile(finalOptions.projectName, server.path, server.file)
    )
  )
 
  console.timeEnd('constructor execution ')
  logSuccessMessage(options.projectName, "Web Server");
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