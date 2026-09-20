import type { ProjectConfig } from "../../../types.js"

const fileSession = {
  import: `import Session from './session.model.js'`,
  line: `
  Session,`
}
const fileRefresh = {
    import: `import RefreshToken from './refreshToken.model.js'`,
    line: `
    RefreshToken,`
}
const emptyFile = {
  
    import: '',
    line: ``
}

  export const seqAuthIndex = (options: ProjectConfig)=>{
  if(options.selectedAuth.endsWith('-session')){return fileSession}
  if(options.selectedAuth.endsWith('-jwt-db')){return fileRefresh}
  return emptyFile

}
/*    ]
    export const optionAuth = [
      { name: "1) None", value: "auth-null" },
      { name: "2) Auth with session and cookies", value: "auth-session" },
      { name: "3) Auth with jwt (access and refresh)", value: "auth-jwt" },
      { name: "4) Auth with jwt an white-list (access and refresh)", value: "auth-jwt-db" },*/