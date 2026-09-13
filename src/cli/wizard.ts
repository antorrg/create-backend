import { Colors, promptInput, promptList } from "./cliNative.js";
import {
  createFunctionality,
  createWebServer,
  createNextServer,
  createElectronNode,
  CreatorOptions,
} from "../creators/index.js";

export async function runCli(): Promise<void> {
  console.log("");
  console.log(`${Colors.bold}${Colors.cyan}=============================================${Colors.reset}`);
  console.log(`${Colors.bold}${Colors.green}          🚀 CreateServers CLI 🚀            ${Colors.reset}`);
  console.log(`${Colors.bold}${Colors.cyan}=============================================${Colors.reset}`);
  console.log(`${Colors.dim}Generador de proyectos y servidores nativo en Node.js${Colors.reset}\n`);

 

  // 2. Pregunta por el tipo de proyecto (equivalente a createServer.sh)
  const projectType = await promptList< "webServer" | "nextServer" | "electronNode">(
    "¿Qué necesita crear?",
    [
      { name: "1) Servidor web", value: "webServer" },
      { name: "2) Servidor next.js", value: "nextServer" },
      { name: "3) Backend node (electron)", value: "electronNode" },
    ]
  );
   // 1. Pregunta por el nombre del proyecto
  const project_name = await promptInput("¿Nombre del proyecto o carpeta?", {
    default: "my-server",
    validate: (input) => {
      if (!input.trim()) return "El nombre no puede estar vacío";
      if (!/^[a-zA-Z0-9_.-]+$/.test(input.trim())) {
        return "El nombre solo puede contener letras, números, guiones y puntos";
      }
      return true;
    },
  });
    const sourceFolderName = await promptInput("¿Nombre de la carpeta principal?", {
    default: (projectType === 'nextServer')? "api" : "src",
    validate: (input) => {
      if (!input.trim()) return "El nombre no puede estar vacío";
      if (!/^[a-zA-Z0-9_.-]+$/.test(input.trim())) {
        return "El nombre solo puede contener letras, números, guiones y puntos";
      }
      return true;
    },
  });

  // 3. Obtener el directorio objetivo donde se invoca la CLI
  const targetDir = process.cwd();

  const options: CreatorOptions = {
    projectName: normalizePackageName(project_name),
    sourceFolderName,
    targetDir,
  };

  // 4. Ejecutar el creador correspondiente según la opción seleccionada
  switch (projectType) {

    case "webServer":
      await createWebServer(options);
      break;

    case "nextServer":
      await createNextServer(options);
      break;

    case "electronNode":
      await createElectronNode(options);
      break;

    default:
      console.log(`${Colors.yellow}Opción no reconocida, usando Servidor web por defecto...${Colors.reset}`);
      await createWebServer(options);
      break;
  }
}
function normalizePackageName(name:string):string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/^-+|-+$/g, '')
}