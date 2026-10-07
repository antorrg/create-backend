import { 
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
}