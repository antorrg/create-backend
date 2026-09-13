export const seqDepSnippet = {
  deps: `"@sequelize/core": "7.0.0-alpha.48",
    "@sequelize/postgres": "7.0.0-alpha.48",
    "pg": "^8.17.2",
    "pg-hstore": "^2.3.4",`,
  devDeps: `"@types/pg": "^8.23.1",`
}
/**
 * // conditional use for auth with whitelist
 */
export const sequelizeTestFnSnippet = {
  arr: `db.Log,
        db.User,`,
  arrAuth:`db.Log,
        db.User,
        db.RefreshToken`,
  arrSession: `db.Log,
        db.User,
        db.Session`,
  code: `$const records = await model.findAll()`
}
