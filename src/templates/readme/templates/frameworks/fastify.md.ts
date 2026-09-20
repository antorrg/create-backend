import type { FilePattern } from '../../../../types.js'
import { capitalizeFirstLetter } from "../../readme.generator.js";
import { mainOrm } from '../orms/main-orm.js'

export const fastifyMd = (options: FilePattern)=>{
    const nameServer = capitalizeFirstLetter(options.selectedServer)
    return ``}