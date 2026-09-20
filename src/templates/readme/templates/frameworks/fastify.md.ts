import type { ProjectConfig } from '../../../../types.js'
import { capitalizeFirstLetter } from "../../readme.generator.js";
import { mainOrm } from '../orms/main-orm.js'

export const fastifyMd = (options: ProjectConfig)=>{
    const nameServer = capitalizeFirstLetter(options.selectedServer)
    return ``}