 import { ProjectConfig } from "../../../../types.js"
 
export const userModel = {
        subPath:`user.model.ts`,
        file: `import { 
  Sequelize, 
  Model, 
  CreationOptional, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes 
} from '@sequelize/core'

export class User extends Model<
InferAttributes<User>, 
InferCreationAttributes<User>
> {
  declare id: string
  declare email: string
  declare password: string
  declare nickname: string
  declare name: string
  declare picture: string
  declare role: CreationOptional<string>
  declare enabled: CreationOptional<boolean>
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USER'
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true
    }
  )
  return User
}`
    }
export const logModel = {
        subPath:`log.model.ts`,
        file: `import {
  Sequelize, 
  Model, 
  CreationOptional, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes
} from '@sequelize/core'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export class Log extends Model<
  InferAttributes<Log>,
  InferCreationAttributes<Log>
> {
  declare id: string

  declare levelName: LogLevel
  declare levelCode: number
  declare message: string

  declare type: string | null
  declare status: number | null
  declare stack: string | null

  declare contexts: CreationOptional<string[]>

  declare pid: CreationOptional<number>
  declare time: CreationOptional<number | null>
  declare hostname: string | null

  declare keep: CreationOptional<boolean>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default (sequelize: Sequelize) => {
  Log.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },

      levelName: {
        type: DataTypes.ENUM(
          LogLevel.DEBUG,
          LogLevel.INFO,
          LogLevel.WARN,
          LogLevel.ERROR,
          LogLevel.FATAL
        ),
        allowNull: false
      },

      levelCode: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      type: {
        type: DataTypes.STRING,
        allowNull: true
      },

      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      stack: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      contexts: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
      },

      pid: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      time: {
        type: DataTypes.BIGINT,
        allowNull: true
      },

      hostname: {
        type: DataTypes.STRING,
        allowNull: true
      },

      keep: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      tableName: 'logs',
      timestamps: true
    }
  )

  return Log
}`
    }
 //* Optional models:
export const sessionModel = {
      subPath: `session.model.ts`,
      file:`import type {
  Sequelize, 
  CreationOptional, 
  InferAttributes, 
  InferCreationAttributes
} from '@sequelize/core'
import { 
  Model, 
  DataTypes
} from '@sequelize/core'

export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare sid: string
  declare expires: Date
  declare data: string
  declare createdAt?: CreationOptional<Date>
  declare updatedAt?: CreationOptional<Date>
}

export function initSessionModel(sequelize: Sequelize) {
  Session.init(
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'sessions',
      indexes: [
        {
          fields: ['expires']
        }
      ]
    }
  )
  return Session
}

export default initSessionModel
`}
export const refreshModel = {
  subPath: 'refreshToken.model.ts',
  file: `import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes
} from '@sequelize/core'
import { Model, DataTypes } from '@sequelize/core'

export class RefreshToken extends Model<
  InferAttributes<RefreshToken>,
  InferCreationAttributes<RefreshToken>
> {
  declare jti: string
  declare sub: string
  declare familyId: string
  declare parentId: string | null
  declare tokenHash: string
  declare csrfTokenHash: string
  declare revokedReason: string | null
  declare usedAt: Date | null
  declare revokedAt: Date | null
  declare expiredAt: Date
  declare isPersistent: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

export default (sequelize: Sequelize) => {
  RefreshToken.init(
    {
      jti: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      sub: {
        type: DataTypes.UUID,
        allowNull: false
      },
      familyId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      tokenHash: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      csrfTokenHash: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      revokedReason: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      isPersistent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'refresh_token',
      timestamps: true
    }
  )

  return RefreshToken
}
`
}