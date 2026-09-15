export type Value = {framework:string, persistence:string}
export type OptionServer = {name: string, value: Value}

export const optionServer:OptionServer[] = [
      { name: "1) Express ts without db", value: {framework:"express",persistence: "none"} },
      { name: "2) Express ts with sequelize (postgres)", value: {framework:"express",persistence:"sequelize"} },
      { name: "3) Express ts with prisma (postgres)", value: {framework:"express",persistence:"prisma"} },
      { name: "4) Express ts with mongoose (mongoDb)", value: {framework:"express",persistence:"mongooose"} },
      { name: "5) Fastify ts without db", value: {framework:"fastify",persistence:"none"} },
      { name: "6) Fastify ts with sequelize (postgres)", value: {framework:"fastify",persistence:"sequelize"} },
      { name: "7) Fastiv ts with prisma (postgres)", value: {framework:"fastify",persistence:"prisma"} },
      { name: "8) Fastify ts with mongoose (mongoDb)", value: {framework:"fastify",persistence:"mongoose"} },
    ]
    export const optionAuth = [
      { name: "1) None", value: "auth-null" },
      { name: "2) Auth with session and cookies", value: "auth-session" },
      // { name: "3) Auth with jwt (access and refresh)", value: "auth-jwt" },
      // { name: "4) Auth with jwt an white-list (access and refresh)", value: "auth-jwt-db" },
    ]