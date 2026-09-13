import { CreatorOptions, prepareProjectDirectory, logSuccessMessage } from "./common.js";
import { Colors } from "../cli/cliNative.js";

export async function createElectronNode(options: CreatorOptions): Promise<void> {
  console.log(`\n${Colors.cyan}🚀 Iniciando creación de Backend Node (Electron) para '${options.projectName}'...${Colors.reset}`);
  
  const projectPath = await prepareProjectDirectory(options);
  
  // Aquí se invocarán las funciones creadoras específicas de Backend Node (Electron)
  console.log(`[creator:electronNode] Ejecutando creadores de archivos para Backend Node (Electron)...`);
  
  // Ejemplo / Stub preparado para integrar la generación específica
  console.log(`[creator:electronNode] TODO: Implementar plantillas específicas de Backend Node (Electron) en ${projectPath}`);

  logSuccessMessage(options.projectName, "Backend Node (Electron)");
}
