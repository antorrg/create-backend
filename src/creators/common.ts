import fs from "fs/promises";
import path from "path";
import { Colors } from "../cli/cliNative.js";
import type { CreatorOptions, SuccessStep, NameProject } from "../types.js";


/**
 * Ensures creation of the project directory at the target path
 */
export async function prepareProjectDirectory(options: CreatorOptions): Promise<string> {
  const projectPath = path.resolve(options.targetDir, options.projectName);
  await fs.mkdir(projectPath, { recursive: true });
  // const directories = [
  // 'tests/unit',
  // 'tests/integration'
  //  ];
  // // Parallelize directory creation
  // await Promise.all(
  //   directories.map(dir =>
  //     fs.mkdir(path.join(projectPath, dir), { recursive: true })
  //   )
  // );
  console.log(`${Colors.dim}Target directory:${Colors.reset} ${projectPath}`);
  return projectPath;
}

/**
 * Writes a file inside the project directory
 */
export async function createProjectFile(
  projectPath: string,
  relativePath: string,
  content: string
): Promise<void> {
  const fullPath = path.join(projectPath, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
  //console.log(`  ${Colors.green}+${Colors.reset} Created: ${relativePath}`);
}


export function logSuccessMessage(projectName: string, category: string, nextSteps: readonly SuccessStep[]): void {
 // const steps = nextSteps.map(n => {console.log(n)})
  console.log(`\n${Colors.green}${Colors.bold}Project '${projectName}' (${category}) created successfully!${Colors.reset}`);
  console.log(`\nNext steps:`);
   for (const { text, color = Colors.cyan } of nextSteps) {
    console.log(`  ${color}${text}${Colors.reset}`);
  }

  console.log();

}
