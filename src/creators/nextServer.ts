import { CreatorOptions, prepareProjectDirectory, logSuccessMessage } from "./common.js";
import { Colors } from "../cli/cliNative.js";

export async function createNextServer(options: CreatorOptions): Promise<void> {
  console.log(`\n${Colors.cyan}🚀 Iniciando creación de Servidor Next.js para '${options.projectName}'...${Colors.reset}`);
  
  const projectPath = await prepareProjectDirectory(options);
  
  // Aquí se invocarán las funciones creadoras específicas de Next.js
  console.log(`[creator:nextServer] Ejecutando creadores de archivos para Servidor Next.js...`);
  
  // Ejemplo / Stub preparado para integrar la generación específica
  console.log(`[creator:nextServer] TODO: Implementar plantillas específicas de Servidor Next.js en ${projectPath}`);

  logSuccessMessage(options.projectName, "Servidor Next.js");
}
