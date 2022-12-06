import { Op } from 'sequelize'

export default (socket, Users, Friends) => {

    let auth = socket.handshake.auth

    socket.on('search new friend', async (data, cb) => {


        if (data.friend == auth.nick) {
            cb(false)
        }


        try {

            let exist = await Friends.findOne({
                where: {
                    name_chat: {
                        [Op.or]: [`${auth.nick}//${data}`, `${data}//${auth.nick}`]
                    }

                }, raw: true
            })

            if(exist){
                cb(false)
            }
            
            let result = await Users.findAll({ where: { nickname: { [Op.like]: `${data.friend}%` } }, attributes: ['nickname'], raw: true })

            result = result.filter(el => {

                if (el.nickname !== auth.nick) {
                    return el
                }
            })

            cb(result)
        }
        catch (er) {

            console.log(er)
        }
    })



    socket.on('add new friend', async (data, cb) => {


        let result = await Users.findOne({ where: { nickname: data }, raw: true })

        let user = await Users.findOne({ where: { nickname: auth.nick }, attributes: ['id', 'nickname'], raw: true })

        if (result) {
            try {
                let exist = await Friends.findOne({
                    where: {
                        name_chat: {
                            [Op.or]: [`${auth.nick}//${data}`, `${data}//${auth.nick}`]
                        }

                    }, raw: true
                }) || false


                if (exist.length && exist.length > 0) {
                    throw Error('already exist this it relationship')
                }
                await Friends.create({ friend_id: result.id, user_id: user.id, name_chat: `${auth.nick}//${data}` })
                await Friends.create({ friend_id: user.id, user_id: result.id, name_chat: `${data}//${auth.nick}` })
                return cb(true)
            } catch (er) {
                console.log(er)
                return cb(false)
            }
        }
    })

    socket.on('friend list', async (_, cb) => {


        try {
            let user = await Users.findOne({ where: { nickname: auth.nick }, raw: true })

            let relationships = await Friends.findAll({ where: { user_id: user.id }, attributes: ['name_chat'], raw: true })

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