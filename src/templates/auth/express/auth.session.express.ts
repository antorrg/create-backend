import type { FilePattern } from "../../../types.js"
import { sessionDbSnippets } from "../sessionDbSnnipet.js"
import { selectOrmForInitDb } from '../../helpers/selectOrmForInitDb.js'
import * as dep from './common/index.js'


export const authSessionExpress = (options: FilePattern)=>{
  const select = selectOrmForInitDb(options)
  const dbSnippet = sessionDbSnippets(options)
    return [
          {
        path:`/${options.sourceFolderName}/@types/index.d.ts`,
        file: dep.indexTypes
    },
        {
        path:`/${options.sourceFolderName}/shared/auth/session.ts`,
        file: dep.session
},
{
    path:`/${options.sourceFolderName}/shared/auth/session.test.ts`,
    file: dep.sessionTest
},
{
    path:`/${options.sourceFolderName}/shared/auth/authMiddlewares.ts`,
    file: dep.authMiddleware
},
{
    path:`/${options.sourceFolderName}/shared/auth/testHelpers/serverTest.help.ts`,
    file: dep.testHelperAuth
},{
    path:`/${options.sourceFolderName}/shared/auth/session/types.ts`,
    file: `${dep.sessionImport}

export interface DefaultFields {
  data: string;
  expires: Date;
  [key: string]: unknown;
}

export interface ISessionAdapter {
  get(sid: string): Promise<{ sid: string; expires: Date; data: string; [key: string]: unknown } | null>;
  set(sid: string, defaults: DefaultFields): Promise<void>;
  touch(sid: string, expires: Date): Promise<void>;
  destroy(sid: string): Promise<void>;
  length(): Promise<number>;
  clearExpiredSessions(now?: Date): Promise<void>;
}

export interface SessionStoreOptions {
  adapter: ISessionAdapter;
  checkExpirationInterval?: number;
  expiration?: number;
  disableTouch?: boolean;
  extendDefaultFields?: (defaults: DefaultFields, session: SessionData) => DefaultFields;
}
`
},
{
    path:`/${options.sourceFolderName}/shared/auth/session/connect-session-app.ts`,
    file: dep.connectSessionApp
},
{
    path:`/${options.sourceFolderName}/shared/auth/session/connect-db.ts`,
    file: `${dbSnippet.file}`
},
{
    path:`/${options.sourceFolderName}/features/auth/AuthService.ts`,
    file: dep.authService
},
{
    path:`/${options.sourceFolderName}/features/auth/AuthController.ts`,
    file: dep.authController
},
{
    path:`/${options.sourceFolderName}/features/auth/auth.routes.ts`,
    file: dep.authRouter
},
{
    path:`/${options.sourceFolderName}/features/auth/auth.integration.test.ts`,
    file: `${dep.integrationTest1}

describe('Auth Integration Tests', () => {
  beforeAll(async() => {
    ${select}
    await testUsersSeed()
  })
  ${dep.integrationTest2}
  `
},
{
    path:`/${options.sourceFolderName}/features/auth/testHelpers/serverAuth.help.ts`,
    file: dep.featureTestHelper
},
        
    ]
}