import type { ServerFramework, AppOrm, SelectedAuth } from './types.js'

export type Value = {framework:ServerFramework, persistence:AppOrm}
export type OptionServer = {name: string, value: Value}
export type OptionAuth = {name:string, value:SelectedAuth }

export const optionServer:OptionServer[] = [
      { name: "Express ts without db (standalone)", value: {framework:"express",persistence: "none"} },
      { name: "Express ts with sequelize (postgres)", value: {framework:"express",persistence:"sequelize"} },
      { name: "Express ts with prisma (postgres)", value: {framework:"express",persistence:"prisma"} },
      { name: "Express ts with drizzle (postgres)", value: {framework:"express",persistence:"drizzle"} },
      { name: "Fastify ts without db (standalone)", value: {framework:"fastify",persistence:"none"} },
      { name: "Fastify ts with sequelize (postgres)", value: {framework:"fastify",persistence:"sequelize"} },
      { name: "Fastify ts with prisma (postgres)", value: {framework:"fastify",persistence:"prisma"} },
      { name: "Fastify ts with drizzle (postgres)", value: {framework:"fastify",persistence:"drizzle"} },
    ]
    export const optionAuth: OptionAuth[] = [
      { name: "None", value: "auth-null" },
      { name: "Session-based authentication", value: "auth-session" },
    ]