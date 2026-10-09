/**
 * logSchema, userSchema
 */
export const logSchema = `import type { Schema } from "req-valid-express";

const logquery: Schema = {
  page: {
    type: "int",
    default: 1
  },
  limit: {
    type: "int",
    default: 5
  },
  searchField: {
    type: "string",
    default: "levelName",
    sanitize: {
      trim: true
    }
  },
  search: {
    type: "string",
    default: "",
    sanitize: {
      trim: true
    }
  },
  sortBy: {
    type: "string",
    default: "id",
    sanitize: {
      trim: true
    }
  },
  order: {
    type: "string",
    default: "ASC",
    sanitize: {
      trim: true
    }
  }
};

export default logquery;`

export const userSchema = `import { Schema } from 'req-valid-express'

export const createUser:Schema = {
  email:{
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  password:{
      type: 'string',
    sanitize: {
      trim: true
    }
  }
}
export const updateProfile:Schema = {
  email:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  name:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  nickname:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  picture: {
        type: 'string',
    sanitize: {
      trim: true
    }
  }
}
export const changePassword:Schema={
  id:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  password:{
        type: 'string',
    sanitize: {
      trim: true
    }
  },
  newPassword:{
        type: 'string',
    sanitize: {
      trim: true
    }
  }
}
export const upgradeUser:Schema = {
  role:{
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  enabled: {
        type: 'boolean',

  }
}`