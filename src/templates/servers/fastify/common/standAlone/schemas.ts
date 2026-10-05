export const schemas = `export const createUser = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    name: { type: 'string' },
    username: { type: 'string' }
  },
  required: ['email', 'name', 'username'],
  additionalProperties: false
} as const

export const update = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    name: { type: 'string' },
    username: { type: 'string' },
    enabled: { type: 'boolean' },
    phone: { type: 'number' }
  },
  required: [],
  additionalProperties: false
} as const

export type CreateUser = {
  email: string
  name: string
  username: string
}

export type Update = Partial<{
  email: string
  name: string
  username: string
  enabled: boolean
  phone: number
}>

export type UserId = { id: string }

`
