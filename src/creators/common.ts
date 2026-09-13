import fs from "fs/promises";
import path from "path";
import { Colors } from "../cli/cliNative.js";

export interface CreatorOptions {
  projectName: string;
  targetDir: string;
  sourceFolderName: string
}

/**
 * Asegura la creación del directorio del proyecto en la ruta invocada (process.cwd())
 */
export async function prepareProjectDirectory(options: CreatorOptions): Promise<string> {
  const projectPath = path.resolve(options.targetDir, options.projectName);
  //await fs.mkdir(projectPath, { recursive: true });
  const directories = [
  `${options.sourceFolderName}/features/user`,
  `${options.sourceFolderName}/@types`,
  `${options.sourceFolderName}/features/system-logs`,
  `${options.sourceFolderName}/configs`,
  `${options.sourceFolderName}/configs/logger`,
  `${options.sourceFolderName}/configs/errors`,
  `${options.sourceFolderName}/shared/repositories`,
  `${options.sourceFolderName}/shared/interfaces`,
  `serverAssets/fixtures`,
  'serverAssets/uploads',
  'tests/unit',
  'tests/integration'
];
  // Paralelizar creación de directorios
  await Promise.all(
    directories.map(dir =>
      fs.mkdir(path.join(projectPath, dir), { recursive: true })
    )
  );
  console.log(`${Colors.dim}Directorio objetivo:${Colors.reset} ${projectPath}`);
  return projectPath;
}

/**
 * Escribe un archivo dentro del proyecto informando en la consola
 */
export async function createProjectFile(
  projectPath: string,
  relativePath: string,
  content: string
): Promise<void> {
  const fullPath = path.join(projectPath, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
  console.log(`  ${Colors.green}+${Colors.reset} Creado: ${relativePath}`);
}

export function logSuccessMessage(projectName: string, category: string): void {
  console.log(`\n${Colors.green}${Colors.bold}¡Proyecto '${projectName}' (${category}) creado con éxito!${Colors.reset}`);
  console.log(`\nSiguientes pasos:`);
  console.log(`  ${Colors.cyan}cd ${projectName}${Colors.reset}`);
  console.log(`  ${Colors.cyan}npm install${Colors.reset}`);
  console.log(`  ${Colors.cyan}npm run dev${Colors.reset}\n`);
}
