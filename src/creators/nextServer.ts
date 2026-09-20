import { prepareProjectDirectory, logSuccessMessage } from "./common.js";
import type { CreatorOptions } from '../types.js'
import { Colors } from "../cli/cliNative.js";

export async function createNextServer(options: CreatorOptions): Promise<void> {
  console.log(`\n${Colors.cyan}🚀 Starting Next.js Server creation for '${options.projectName}'...${Colors.reset}`);
  
  const projectPath = await prepareProjectDirectory(options);
  
  // Specific Next.js creator functions will be invoked here
  console.log(`[creator:nextServer] Running file creators for Next.js Server...`);
  
  // Example / Stub prepared to integrate specific generation
  console.log(`[creator:nextServer] TODO: Implement specific Next.js Server templates in ${projectPath}`);

  logSuccessMessage(options.projectName, "Next.js Server");
}
