import type { FileConstructor, ProjectConfig, ServerFramework } from "../../types.js"
import {express as expressCode} from './express/express.js'
import { fastify as fastifyCode } from "./fastify/fastify.js"

type FrameworkHandler = (options: ProjectConfig) => FileConstructor[]

const serverFrameworks: Partial<Record<ServerFramework, FrameworkHandler>> = {
  express: expressCode,
  fastify: fastifyCode,
}

export const frameworkInjector = (options: ProjectConfig) => {
  const handler = serverFrameworks[options.selectedServer]

  if (!handler) {
    throw new Error(
      `Framework "${options.selectedServer}" not implemented yet`
    )
  }

  return handler(options)
}

