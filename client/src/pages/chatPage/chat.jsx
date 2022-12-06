import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import { useNavigate, useLocation } from 'react-router-dom'

import { io } from 'socket.io-client'

let ChatDiv = styled.div`

width: 100%; height: 100%;

display: flex; align-items: center;

justify-content: center; background: rgba(0,0,0, 0.4);

position: fixed; left: 0;

& #main_chat {

    width: 80%; height: 80%;

    background: white; border-radius: 8px;

    display: flex; flex-direction: column;

    align-items: center; padding: 2rem;
}

& #main_chat #back_but_chat {

    margin: 0 0 1rem auto; border: none;

    height: 3rem; width: 5rem; 

    text-align: center; line-height: 3rem;

    background: rgb(70 70 70); border-radius: 8px;
}

& #main_chat #msg_box {

    width: 95%; height: 70%;

    background: rgb(235 245 245); border-radius: 4px;

    display: flex; flex-direction: column;

    align-items: center; padding: 1rem;

    overflow: scroll; overflow-x: hidden;
}

& #main_chat #msg_box::-webkit-scrollbar-track {
   background: rgba(150, 150, 150, 0.1); 

}

& #main_chat #msg_box::-webkit-scrollbar {
    width: 0.5rem;
}

& #main_chat #msg_box::-webkit-scrollbar-thumb {

    background: linear-gradient(180deg, rgb(180 180 180) 10%, rgb(120 120 120) 100%);

}

& #main_chat #msg_box::-webkit-scrollbar-track-piece:start {

    margin-top: 4rem; background: transparent; 
}

& #main_chat #msg_box::-webkit-scrollbar-track-piece:end {

    margin-bottom: 4rem; background: transparent;
}

& #main_chat #box_msg_input {

    height: 20%; width: 80%;

    display: flex; align-items: center;

    justify-content: center;
}

& #main_chat #box_msg_input input[type=text]{

    width: 80%; height: 3rem; border-radius: 4px;

    text-align: center; line-height: 3rem; 

    font-size: 14pt; outline: none; 
    
    border: none; background: rgba(70, 70, 70, 0.4); 

    color: black; transition: 0.3s;
}

& #main_chat #box_msg_input input[type=text]:focus {

    background: rgba(130, 130, 130, 0.4);
}

& #main_chat #box_msg_input button {

    width: 15%; height: 3rem; 

    background: rgb(40 120 230); border: none;

    border-radius: 4px; margin-left: 2rem;
}

& #main_chat #msg_box .msg_card {

    width: 30%; height: fit-content;

    padding: 0.5rem; display: flex;
    
    flex-direction: column; align-items: center;

    border-radius: 4px; user-select: none;

}

& #main_chat #msg_box .msg_card p {
    width: 80%; height: fit-content;

    display: flex; align-items: center;

    justify-content: center; font-size: 14pt;
}

& #main_chat #msg_box .msg_card h3 {
    width: 80%; height: fit-content;

    display: flex; align-items: center;

    justify-content: center; font-size: 14pt;
}

& #main_chat #msg_box .you {

    background: rgb(66, 245, 161);

    margin: 0.5rem 0 0.5rem auto;
}

& #main_chat #msg_box .friend {

    background: rgb(56, 202, 242);

    margin: 0.5rem auto 0.5rem 0;
}

@media(max-width: 770px) {


    & #main_chat #msg_box .msg_card {

        width: 80%; padding: 0.1rem;
    }

    & #main_chat #msg_box {
        width: 100%
    }

    & #main_chat #box_msg_input button {

        width: 40%; margin-left: 0.5rem;
    }

    & #main_chat #box_msg_input input[type=text] {

        width: 90%; margin-bottom: 1rem;
    }

    & #main_chat #box_msg_input {
        width: 100%; flex-direction: column;

        justify-content: space-between; margin: 1rem 0;

        height: fit-content; padding: 1rem 0;
    }

}

`

function RoomChat({ cookies }) {

    let msgRef = useRef()
    let chatRef = useRef()

    let nav = useNavigate()
    let loc = useLocation()

    let [data, setData] = useState([])

    let conn = io('localhost:4000', { auth: cookies.get('auth_creds') }) || null

    useEffect(() => {

        let scroll = chatRef.current.scrollHeight

        chatRef.current.scrollTo({ left: 0, top: scroll + scroll * 0.3, behavior: 'smooth' })
    }, [data])

    useEffect(() => {

        if (!cookies.get('auth_creds')) {

            return nav('/')
        }

        
        conn.on('connect', () => {

            let tmp = cookies.get('chat_current')

            conn.emit('chat init', { chat: tmp.chat, type: tmp.type }, res => {

                if (res) {

                    let tmp = res.map((el, id) => {

                        if (el.nickname !== cookies.get('auth_creds').nick) {

                            return <article className='msg_card friend' key={id}>

                                <h3>{el.nickname}:</h3>

                                <p>
                                    {el.message}
                                </p>

                            </article>
                        }
                        else {
                            return <article className='msg_card you' key={id}>

                                <h3>You:</h3>

                                <p>
                                    {el.message}
                                </p>

                            </article>
                        }

                    });

                    setData(tmp)
                }
            })

            conn.on('chat msg update', ({ data, chat }) => {

                if (data && chat) {

                    if (chat !== cookies.get('chat_current')) {
                        return
                    }

                    let tmp = data.map(el => {

                        if (el.nickname !== creds.nick) {

                            return <article className='msg_card friend'>

                                <h3>{el.nickname}:</h3>

                                <p>
                                    {el.message}
                                </p>

                            </article>
                        }
                        else {
                            return <article className='msg_card you'>

                                <h3>You:</h3>

                                <p>
                                    {el.message}
                                </p>

                            </article>
                        }

                    });

                    setData(tmp)
                }

            })
        })



        return () => {

            conn.off('connect')
            conn.off('chat msg update')

        }
    }, [loc])

    function closeHandle() {
        
        let tmp = cookies.get('chat_current')

        cookies.remove('chat_current')

        conn.close()

        if(tmp.type == 'friend'){

            nav('/chat/friends')
        }
        else if (tmp.type == 'group'){
            nav('/chat/groups')
        }

    }

    function sendMsg() {

        let chat = cookies.get('chat_current')
        let msg = msgRef.current.value


        console.log(conn, msg, chat)
        if (conn && msg && chat) {

            conn.emit('chat msg', { text: msg, ...chat })

            let newMsg = <article className='msg_card you' key={data.length}>

                <h3>You:</h3>

                <p>
                    {msg}
                </p>

            </article>

            setData(prev => [...prev, newMsg])
            msgRef.current.value = ''

            
        }

        let scroll = chatRef.current.scrollHeight

        chatRef.current.scrollTo({ left: 0, top: scroll + scroll * 0.3, behavior: 'smooth' })

    }

    return (
        <ChatDiv>
            <main id='main_chat'>
                <button onClick={closeHandle} id='back_but_chat'>Back</button>
                <div id="msg_box" ref={chatRef}>{data}</div>
                <div id='box_msg_input'>

                    <input type="text" ref={msgRef} />
                    <button onClick={() => sendMsg()}>Send</button>

                </div>
            </main>
        </ChatDiv>
    )
}

export { RoomChat }