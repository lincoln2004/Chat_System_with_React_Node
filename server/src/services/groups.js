import { Op } from 'sequelize'

export default (socket, Users, Groups, group_user) => {

    let auth = socket.handshake.auth

    socket.on('search new groups', async (data, cb) => {


        try {
            let user = await Users.findOne({ where: { nickname: auth.nick }, attributes: ['id'], raw: true })

            let alreadyJoined = await group_user.findAll({ where: { user_id: user.id }, attributes: ['name_chat'], raw: true })


            let result = await Groups.findAll({ where: { name_chat: { [Op.like]: `${data.group}%` } }, attributes: ['name_chat'], raw: true })

            
            if (alreadyJoined && alreadyJoined.length > 0) {

                result = result.filter(el => {

                    let condition = alreadyJoined.map(el => el.name_chat)

                    if (condition.includes(el.name_chat)) {

                        return false
                    }


                    return el
                })
            }

            cb(result)
        }
        catch (er) {

            console.log(er)
        }
    })

    socket.on('join new group', async (name, cb) => {

        try {
            let user = await Users.findOne({ where: { nickname: auth.nick }, attributes: ['id'], raw: true })

            let exist = await group_user.findOne({ where: { name_chat: name, user_id: user.id }, raw: true })

            if (exist) {
                return cb(false)
            }


            let group = await Groups.findOne({ where: { name_chat: name }, raw: true })

            if (group) {

                await group_user.create({ user_id: user.id, name_chat: group.name_chat })
                return cb(true)
            }

        } catch (er) {

            cb(false)
            console.log(er)
        }
    })

    socket.on('create new group', async (name, cb) => {

        if (name) {

            try {

                let exist = await Groups.findOne({ where: { name_chat: name }, raw: true })
                let user = await Users.findOne({ where: { nickname: auth.nick }, attributes: ['id'], raw: true })

                if (!exist) {

                    await Groups.create({ name_chat: name })
                    await group_user.create({ user_id: user.id, name_chat: name })

                    cb(true)
                }

            } catch (error) {

                cb(false)
                console.log(error)
            }

        }
    })

    socket.on('groups list', async (_, cb) => {

        try {
            let user = await Users.findOne({ where: { nickname: auth.nick }, raw: true })

            let relationships = await group_user.findAll({ where: { user_id: user.id }, attributes: ['name_chat'], raw: true })

            if (relationships && user) {

                return cb(relationships)
            }
            else {
                throw 'error'
            }
        } catch (error) {
            console.log(error)
            return
        }
    })
}