import type { ServerFramework, AppOrm, SelectedAuth } from './types.js'

export type Value = {framework:ServerFramework, persistence:AppOrm}
export type OptionServer = {name: string, value: Value}
export type OptionAuth = {name:string, value:SelectedAuth }

export const optionServer:OptionServer[] = [
      { name: "1) Express ts without db (standalone)", value: {framework:"express",persistence: "none"} },
      { name: "2) Express ts with sequelize (postgres)", value: {framework:"express",persistence:"sequelize"} },
      { name: "3) Express ts with prisma (postgres)", value: {framework:"express",persistence:"prisma"} },
      { name: "4) Express ts with drizzle (postgres)", value: {framework:"express",persistence:"drizzle"} },
      { name: "5) Fastify ts without db (standalone)", value: {framework:"fastify",persistence:"none"} },
      { name: "6) Fastify ts with sequelize (postgres)", value: {framework:"fastify",persistence:"sequelize"} },
      { name: "7) Fastify ts with prisma (postgres)", value: {framework:"fastify",persistence:"prisma"} },
      { name: "8) Fastify ts with drizzle (postgres)", value: {framework:"fastify",persistence:"drizzle"} },
    ]
    export const optionAuth: OptionAuth[] = [
      { name: "1) None", value: "auth-null" },
      { name: "2) Auth with session and cookies", value: "auth-session" },
    ]