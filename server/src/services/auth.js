import { compare } from 'bcrypt'

export default (socket, Users) => {

    socket.on('login process', async (auth, cb) => {


        try {
            let user = await Users.findOne({ where: { nickname: auth.nick } })

            if (user) {
                if (await compare(auth.pass, user.password)) {
                    return cb(true)
                }
                else {

                    throw new Error('unauthorized credentials')
                }
            }
            else {

                throw new Error('unauthorized credentials')
            }
        } catch (error) {

            cb(false)

            console.log(error)
        }
    })
}