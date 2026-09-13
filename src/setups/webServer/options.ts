
export const optionServer = [
      { name: "1) Express ts without db", value: "ex-single" },
      { name: "2) Express ts with sequelize (postgres)", value: "ex-seq" },
      { name: "3) Express ts with prisma (postgres)", value: "ex-pris" },
      { name: "4) Express ts with mongoose (mongoDb)", value: "ex-mg" },
      { name: "5) Fastify ts without db", value: "fast-single" },
      { name: "6) Fastify ts with sequelize (postgres)", value: "fast-seq" },
      { name: "7) Fastiv ts with prisma (postgres)", value: "fast-pris" },
      { name: "8) Fastify ts with mongoose (mongoDb)", value: "fast-mg" },
    ]
    export const optionAuth = [
      { name: "1) None", value: "auth-null" },
      { name: "2) Auth with session and cookies", value: "auth-session" },
      // { name: "3) Auth with jwt (access and refresh)", value: "auth-jwt" },
      // { name: "4) Auth with jwt an white-list (access and refresh)", value: "auth-jwt-db" },
    ]