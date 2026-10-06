import {type  FileConstructor, type ProjectConfig, type SelectedAuth, type CreatorOptions } from "../types.js";
import { prepareProjectDirectory, logSuccessMessage, createProjectFile } from "./common.js";
import { Colors, promptInput, promptList, promptListObject } from "../cli/cliNative.js";
import { optionServer, optionAuth, type Value } from "../options.js";
import * as temp from '../templates/index.templates.js'


export async function createWebServer(options: CreatorOptions): Promise<void> {
  let selected ='auth-null' as SelectedAuth
  const serverConfig = await promptListObject<Value>(
    "Select framework and persistence",
    optionServer
  );
  if(serverConfig.persistence !== 'none'){
  selected = await promptList<SelectedAuth>(
    "Select authentication type",
    optionAuth
  );
  }
  console.log(`\n${Colors.cyan}🚀 Starting Web Server creation for '${options.projectName}'...${Colors.reset}`);
  console.time('constructor execution ')
  const projectPath = await prepareProjectDirectory(options);


  const finalOptions = {
    ...options,
    selectedServer: serverConfig.framework,
    selectedOrm: serverConfig.persistence,
    selectedAuth: selected,
    swaggerOption: false
  } satisfies ProjectConfig
 //console.log('options collection so far: ',finalOptions)
  // Specific Web Server creator functions will be invoked here
  console.log(`[creator:webServer] Running file creators for Web Server...`);

let serverFilesOrm: FileConstructor[]| []

switch (finalOptions.selectedOrm) {
  case 'none':
    serverFilesOrm = []
    break

  case 'prisma':
    serverFilesOrm = temp.prismaBase(finalOptions)
    break

  case 'sequelize':
    serverFilesOrm = temp.sequelizeBase(finalOptions)
    break

  case 'drizzle':
    throw new Error('Drizzle not implemented yet')
  
  default:
    throw new Error(`Not supportted ORM: ${finalOptions.selectedOrm}`)
}
  
  const serverFilesServer = temp.baseServer(finalOptions)
  const serverFilesLogger = temp.loggerTs(finalOptions)
  const serverFilesErrors = temp.errorsTemplate(finalOptions)
  const serverFilesApp = temp.baseApp(finalOptions)
  const readme = temp.readmeGenerator(finalOptions)

  const bases = [
    ...serverFilesOrm,
    ...serverFilesServer,
    ...serverFilesLogger,
    ...serverFilesErrors,
    ...serverFilesApp,
    ...readme
  ].flat(1)

  // Parallelize file creation
  await Promise.all(
    bases.map(server => 
      createProjectFile(projectPath, server.path, server.file)
    )
  )
  console.timeEnd('constructor execution ')
  //solo para prueba:
  //await createProjectFile(finalOptions.projectName, './options.txt', `${JSON.stringify(finalOptions)}`)
 
  logSuccessMessage(options.projectName, "Web Server");
  process.exit(0)
}
