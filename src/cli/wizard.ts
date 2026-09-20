import { Colors, promptInput, promptList } from "./cliNative.js";
import type { ProjectType } from "../types.js";
import {
  createFunctionality,
  createWebServer,
  createNextServer,
  createElectronNode,
  CreatorOptions,
  NameProject,
} from "../creators/index.js";

export async function runCli(): Promise<void> {
  console.log("");
  console.log(`${Colors.bold}${Colors.cyan}=======================================================${Colors.reset}`);
  console.log(`${Colors.bold}${Colors.green}               🚀 CreateBackend CLI 🚀            ${Colors.reset}`);
  console.log(`${Colors.bold}${Colors.cyan}=======================================================${Colors.reset}`);
  console.log(`${Colors.dim}Welcome to native Node.js project and server generator${Colors.reset}\n`);

 

  // 2. Ask for the project type (equivalent to createServer.sh)
  const projectType = await promptList<ProjectType>(
    "What do you need to create?",
    [
      { name: "1) Web server", value: "webServer" },
      { name: "2) Next.js server", value: "nextServer" },
      { name: "3) Node backend (Electron)", value: "electronNode" },
    ]
  );
  // 1. Ask for the project name
  const project_name = await promptInput("Project or folder name?", {
    default: "my-server",
    validate: (input) => {
      if (!input.trim()) return "Name cannot be empty";
      if (!/^[a-zA-Z0-9 _.-]+$/.test(input.trim())) {
        return "Name can only contain letters, numbers, spaces, hyphens, and dots";
      }
      return true;
    },
  });
  const sourceFolderName = await promptInput("Main folder name?", {
    default: (projectType === 'nextServer')? "api" : "src",
    validate: (input) => {
      if (!input.trim()) return "Name cannot be empty";
      if (!/^[a-zA-Z0-9_.-]+$/.test(input.trim())) {
        return "Name can only contain letters, numbers, hyphens, and dots";
      }
      return true;
    },
  });

  // 3. Get target directory where CLI is invoked
  const targetDir = process.cwd();

  const { projectName, jsonProjectName } = validateProjectName(project_name);

  const options: CreatorOptions = {
    projectType,
    projectName,
    jsonProjectName,
    sourceFolderName,
    targetDir,
  };

  // 4. Execute corresponding creator based on selected option
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
      console.log(`${Colors.yellow}Unrecognized option, using default Web server...${Colors.reset}`);
      await createWebServer(options);
      break;
  }
}

export function validateProjectName(inputName: string): NameProject {
  if (typeof inputName !== "string" || !inputName.trim()) {
    throw new Error("Project name must be a non-empty string.");
  }

  const normalized = inputName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const kebabName = normalized
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[\s_.]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  if (!kebabName) {
    throw new Error(
      "Invalid project name. It must contain at least one alphanumeric character."
    );
  }

  return {
    projectName: kebabName,
    jsonProjectName: kebabName,
  };
}