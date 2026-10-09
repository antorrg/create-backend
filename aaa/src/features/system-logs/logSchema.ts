export const idParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' }
  },
  required: ['id'],
  additionalProperties: false
} as const

export const logQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, default: 5 },
    searchField: { type: 'string', enum: ['levelName', 'message', 'status'], default: 'levelName' },
    search: { type: 'string' },
    sortBy: { type: 'string', enum: ['id', 'time', 'createdAt'], default: 'id' },
    order: { type: 'string', enum: ['ASC', 'DESC', 'asc', 'desc'], default: 'ASC' }
  },
  additionalProperties: false
} as const

export const updateLogBodySchema = {
  type: 'object',
  properties: {
    keep: { type: 'boolean' }
  },
  required: ['keep'],
  additionalProperties: false
} as const