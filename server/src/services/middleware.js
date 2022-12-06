import { compare } from 'bcrypt'

export default (socket, Users) => {


    async function authenticate(auth, socket, next) {

        try {
            let user = await Users.findOne({ where: { nickname: auth.nick } })

            if (user) {
                if (await compare(auth.pass, user.password)) {
                    next()
                }
                else {
                    throw new Error('unauthorized credentials')
                }
            }
        } catch (error) {

            if (error.message === 'unauthorized credentials') {
                socket.emit('unauthorizated credentials')
            }

            console.log(error)
        }
    }

    socket.use(async ([ev, ...args], next) => {

        if (ev == 'register user') {

            let data = args[0]

            try {
                await Users.create({ nickname: data.nick, password: data.pass }) // others[0] = Users
                socket.emit('user creation done', {})
            } catch (error) {
                socket.emit('user creation error', {})
                next(error)
            }

            return
        }

        if (ev == 'login process') {

            return next()
        }

        let auth = socket.handshake.auth


        if (auth) {
            authenticate(auth, socket, next)
        }
        else {
            socket.emit('unauthorizated credentials')
        }

    })

    socket.on("error", (err) => {
        if (err) {
            console.log(err)
            socket.disconnect()
        }
    })
}