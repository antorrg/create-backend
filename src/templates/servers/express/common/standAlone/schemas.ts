export const schemas = `import type { Schema } from 'req-valid-express'

export const userCreate:Schema = {
    email: {
        type: 'string'
    },
    name:  {
        type: 'string'
    },
    username: {
        type: 'string'
    },
}

export const userUpdate: Schema = {
    email: {
        type: 'string'
    },
    name: {
        type: 'string'
    },
    username:  {
        type: 'string'
    },
    enabled:  {
        type: 'boolean'
    },
    phone: {
        type: 'int'
    },
}

export const regexEmail:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
`
