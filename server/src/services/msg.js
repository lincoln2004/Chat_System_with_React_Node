import { Op } from 'sequelize'

export default (socket, Messages) => {

    let auth = socket.handshake.auth

    socket.on('chat init', async (info, cb) => {


        if (info) {

            let { chat, type } = info


            if (chat) {

                if (type == 'friend') {

                    try {

                        let prevData = await Messages.findAll({
                            where:

                            {
                                name_chat: {

                                    [Op.or]: [chat, chat.split('//').reverse().join('//')]
                                }
                            }, raw: true
                        })


                        socket.join(`chat::${chat}`)

                        return prevData ? cb(prevData) : null

                    } catch (er) {

                        return console.log(er)
                    }
                }
                else if (type == 'group') {

                    try {

                        let prevData = await Messages.findAll({
                            where: {
                                name_chat: chat
                            }, raw: true
                        })


                        socket.join(`group::${chat}`)

                        return prevData ? cb(prevData) : null

                    } catch (er) {

                        return console.log(er)
                    }

                }
            }
        }

    })

    socket.on('chat msg', async (msg) => {


        // args[0] = Users , args[1] = Messages

        try {
            await Messages.create({ message: msg.text, nickname: auth.nick, name_chat: msg.chat })


            if(msg.type == 'friend'){

                let update = Messages.findAll({
                    where: {
    
                        name_chat: {
                            [Op.or]: [msg.chat, msg.chat.split('//').reverse().join('//')]
                        }
                    }, raw: true
                })

                if (update) {
                    socket.broadcast.to(`chat::${msg.chat}`).emit('chat msg update', { data: update, chat: msg.chat })
                }
            }
            else if (msg.type == 'group'){

                let update = Messages.findAll({
                    where: {
    
                        name_chat: msg.chat
                    }, raw: true
                })

                if (update) {
                    socket.broadcast.to(`group::${msg.chat}`).emit('chat msg update', { data: update, chat: msg.chat })
                }
            }


            

        } catch (error) {
            console.log(error)
            return
        }


    })


    socket.on('chat msg leave', (info) => {

        let { chat, type }  = info

        if (chat) {

            if(type == 'friend'){

                socket.leave(`chat::${chat}`)
            }
            else if(type == 'group'){

                socket.leave(`group::${chat}`)
            }
        }
    })

}