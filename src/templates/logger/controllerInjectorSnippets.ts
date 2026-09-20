import type { ProjectConfig } from "../../types.js"
import { expressLoggerController } from "./express/expressLoggerController.js"
import { fastifyLoggerController } from "./fastify/fastifyLoggerController.js"

export const controllerInjectorSnippets = (options: ProjectConfig) => {
    switch(options.selectedServer){
      case 'express':
        return expressLoggerController
      case 'fastify':
        return fastifyLoggerController
      default:
            throw new Error(`Framework "${options.selectedServer}" not implemented yet`)
    }
  }