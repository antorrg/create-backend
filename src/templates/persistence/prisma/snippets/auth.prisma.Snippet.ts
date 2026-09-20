
export const authPrismaSnippet = {
    schema:`
model Session {
  sid     String   @id
  expires DateTime
  data    String

  @@index([expires])
}`,

}