import express, { urlencoded, json } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'

import { Messages, Users, Friends, Groups, Groups_Users } from './db/models.js'


import msgService from './services/msg.js'
import FriendService from './services/friends.js'
import GroupService from './services/groups.js'

import middleService from './services/middleware.js'
import loginService from './services/auth.js'


import dotenv from 'dotenv'

dotenv.config()

let app = express()

app.use(urlencoded({ extended: false }))
app.use(json())
app.use(cors())
app.use(helmet())

app.get('', (_, res) => { res.end() })
let server = createServer(app)


let io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true
    },

    
})

io.on('connect', async (socket) => {

    console.log('\n\nconnected: ', socket.id)

    middleService(socket, Users)

    loginService(socket, Users)

    msgService(socket, Messages, Users, Groups, Groups_Users)
    FriendService(socket, Users, Friends)
    GroupService(socket, Users, Groups, Groups_Users)


    socket.on('disconnect', () => {
        console.log('end: ', socket.id)
    })


})

let port = process.argv[2] || 4000

server.listen(port, () => console.log(`server listening in port ${port}\n\nhttp://localhost:${port}`))