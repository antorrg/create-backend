import {pkgJsonSnippet} from '../prismaFns/snippets/prisDepsSnippet.js'
import { seqDepSnippet } from '../seqFns/snippets/seqDepsSnippet.js'

export function getOrmDependencies(selectedOrm: string) {
  if (selectedOrm === 'prisma') return pkgJsonSnippet
  if (selectedOrm === 'sequelize') return seqDepSnippet
  // futuro: next, electron
  return seqDepSnippet
}
