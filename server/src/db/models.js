import { Sequelize, DataTypes, Model } from 'sequelize'
import { hashSync } from 'bcrypt'


let sequelize = new Sequelize({ dialect: 'sqlite', storage: './src/db/database.sqlite' })


class Messages extends Model { }

Messages.init(

    {

        message: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },

        name_chat: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        }


    },

    {
        sequelize: sequelize,
        tableName: 'Messages',
        freezeTableName: true,
        updatedAt: false
    })

class Users extends Model { }

Users.init({

    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        async set(val) {

            let hash = await hashSync(val, 10)

            this.setDataValue('password', hash)

        },

    }
}, {
    sequelize: sequelize,
    tableName: 'Users',
    freezeTableName: true,
    timestamps: false
})

class Friends extends Model { }

Friends.init(

    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        friend_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name_chat: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: sequelize,
        tableName: 'friends',
        freezeTableName: true,
        timestamps: false
    }
)

class Groups_Users extends Model { }

Groups_Users.init(

    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name_chat: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: sequelize,
        tableName: 'groups_users',
        freezeTableName: true,
        timestamps: false
    }
)

class Groups extends Model { }

Groups.init(

    {
        name_chat: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: sequelize,
        tableName: 'groups',
        freezeTableName: true,
        timestamps: false
    }
)

sequelize.sync()

export { Users, Messages, Friends, Groups, Groups_Users }