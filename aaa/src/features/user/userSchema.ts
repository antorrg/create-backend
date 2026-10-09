export const createUser = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false
} as const

export const updateProfile = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    name: { type: 'string' },
    nickname: { type: 'string' },
    picture: { type: 'string' }
  },
  required: [],
  additionalProperties: false
} as const

export const changePassword = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    password: { type: 'string' },
    newPassword: { type: 'string' }
  },
  required: ['id', 'password', 'newPassword'],
  additionalProperties: false
} as const

export const upgradeUser = {
  type: 'object',
  properties: {
    role: { type: 'string' },
    enabled: { type: 'boolean' }
  },
  required: ['role', 'enabled'],
  additionalProperties: false
} as const

export type CreateUser = {
  email: string
  password: string
}

export type UpdateProfile = Partial<{
  email: string
  name: string
  nickname: string
  picture: string
}>

export type ChangePassword = {
  id: string
  password: string
  newPassword: string
}

export type UpgradeUser = {
  role: string
  enabled: boolean
}

export type UserId = { userId: string }