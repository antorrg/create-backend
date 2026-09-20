export const pkgJsonSnippet = {
  deps: `"@prisma/adapter-pg": "^7.10.0",
    "@prisma/client": "^7.10.0",
    "pg": "^8.23.0",`,
  devDeps: `"@types/pg": "^8.23.1",
    "prisma": "8.0.0-rc.12",`
}
/**
 * // conditional use for auth with whitelist
 */
export const prisTestFnSnippet = {
  arr: `db.prisma.log,
        db.prisma.user,`,
  arrAuth:`db.prisma.log,
        db.prisma.user,
        db.prisma.session`,
  code: `$const records = await model.findMany()`
}