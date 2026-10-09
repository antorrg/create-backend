import type { ProjectConfig } from "../../../types.js"

const fileSession = {
  import: `import { session } from './session.schema.js'`,
  line: `
  session,`
}
const emptyFile = {
  
    import: '',
    line: ``
}

  export const drizzleAuthIndex = (options: ProjectConfig)=>{
  if(options.selectedAuth.endsWith('-session')){return fileSession}
  return emptyFile

}
