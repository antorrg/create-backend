export const drizzleDepSnippet = {
  deps: `"drizzle-kit": "^0.31.11",
    "drizzle-orm": "^0.45.3",`,
  devDeps: `"@types/pg": "^8.23.1",`
}
/**
 * // conditional use for auth with whitelist
 */
export const drizzleTestFnSnippet = {
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
