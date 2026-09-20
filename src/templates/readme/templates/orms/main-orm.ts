import type { FilePattern } from '../../../../types.js'
import { capitalizeFirstLetter } from "../../readme.generator.js";
import { prisma } from './prisma.md.js';
import { sequelize } from './sequelize.md.js';

export const mainOrm = (options: FilePattern): Orm => {
    switch(options.selectedOrm){
        case 'sequelize':
            return sequelize
        case 'prisma' :
            return prisma
        default:
            throw new Error(`Orm ${options.selectedOrm} not implemented yet`)
    }
}
export type Orm = {
    part1:string
    part2:string
    part3:string
    part4:string
    part5:string
}