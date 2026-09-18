import type { FileInjector, FilePattern, ServerFramework } from "../../types.js"
import { expressLoggerController } from "./express/expressLoggerController.js"
import { fastifyLoggerController } from "./fastify/fastifyLoggerController.js"

const loggerFrameworkHandlers: Partial<Record<ServerFramework, FileInjector>> = {
  express: expressLoggerController,
  fastify: fastifyLoggerController
}

export const controllerInjectorSnippets = (options: FilePattern) => {
  const handler = loggerFrameworkHandlers[options.selectedServer]

  if (!handler) {
    throw new Error(
      `Framework "${options.selectedServer}" not implemented yet`
    )
  }
  return handler
}