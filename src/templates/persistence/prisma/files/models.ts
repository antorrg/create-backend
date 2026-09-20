/**
 * Fragment of model of prisma
 */
export const prismaModelPart = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: \`npx create-db\`

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
enum Role {
  ADMIN
  USER
  MODERATOR
}

model User { 
  id       String  @id 
  email    String  @unique
  password String
  nickname String
  name     String
  picture  String
  role     Role @default(USER)
  enabled  Boolean @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
} 

 
enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
  FATAL
}

model Log {
  id        String    @id
  levelName LogLevel
  levelCode Int
  message   String
  type      String
  stack     String?
  context   String[]
  pid       Int
  time      BigInt
  hostname  String
  keep      Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}`
