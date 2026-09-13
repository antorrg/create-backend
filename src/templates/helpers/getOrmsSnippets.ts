import {pkgJsonSnippet} from '../prismaFns/snippets/prisDepsSnippet.js'
import { seqDepSnippet } from '../seqFns/snippets/seqDepsSnippet.js'

export function getOrmDependencies(selectedServer: string) {
  if (selectedServer === 'ex-pris' ||selectedServer === 'fast-pris') return pkgJsonSnippet
  if (selectedServer === 'ex-seq' ||selectedServer === 'fast-seq') return seqDepSnippet
  // futuro: next, electron
  return seqDepSnippet
}
