import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { io } from 'socket.io-client'

import { Link, useNavigate } from 'react-router-dom'


let FriendDiv = styled.div`

flex: 3; height: 100%;

background: rgb(30 30 30); display: flex;

align-items: center; justify-content: center;

& h1, p, strong {
    color: black;
}

& main {

    width: 100%; height: 95%;

    border-radius: 0 8px 8px 0; 

    display: flex; align-items: center;

    justify-content: space-around; background: white;

    flex-direction: column; 

}

& main a {

    width: 40%; height: 4rem;

    border: 0; box-shadow: 0 0 2rem rgba(0, 0, 0, 0.4);

    text-align: center; line-height: 4rem;

    font-size: 16pt; border-radius: 8px;

    color: black; background: white;

    cursor: pointer; text-decoration: none;
}

& main #friendsList {

    width: 80%; height: 50%;

    display: flex; align-items: center;

    flex-wrap: wrap; justify-content: center;

    box-shadow: inset 0 0 1rem rgba(100, 100, 100, 0.4);  background: rgb(180 180 180);

    overflow: scroll; overflow-x: hidden;
}

& main #friendsList::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
}

& main #friendsList::-webkit-scrollbar {
    width: 0.3rem; 
}

& main #friendsList::-webkit-scrollbar-thumb {

    background: linear-gradient(180deg, rgb(100 100 100) 10%, rgb(40 40 40) 100%);
}


& main #friendsList article {

    width: 40%; height: 40%;

    box-shadow: 0 0 2rem rgba(250, 250, 250, 0.6); border-radius: 4px;

    display: flex; align-items: center;

    justify-content: center; background: white;

    margin: 1rem; cursor: pointer;

    user-select: none;
}

@media(max-width: 770px) {

    & main #friendsList article {

        width: 80%
    }

    & main a {

        width: 80%;
    }

}

`

function ChatFriends({ cookies }) {

    let conn = io('localhost:4000', { auth: cookies.get('auth_creds') })

    let [list, setList] = useState()

    let creds = cookies.get('auth_creds') || false

    let nav = useNavigate()

    let friendListRef = useRef()

    useEffect(() => {

        let scroll = friendListRef.current.scrollHeight 

        friendListRef.current.scrollTo({left: 0, top: scroll + scroll * 0.3, behavior: 'smooth'})
    },[list])

    useEffect(() => {

        if (creds) {

            conn.emit('friend list', {}, (res) => {

                let tmp = res.map((el, id) => {

                    return <article key={id} onClick={() => handleClickChat(el.name_chat)}>
                        <p><strong>Name: </strong>{el.name_chat.split('//')[1]}</p>
                    </article>

                })

                setList(tmp)
            })

            

        }
        else {
            nav('/')
        }

    }, [])


    function handleClickChat(chat) {

        cookies.get('chat_current') ? cookies.remove('chat_current') : null
        
        cookies.set('chat_current', {chat, type: 'friend'})

        nav('/chat/room')

    }

    

    return (<FriendDiv>

        <main>

            <h1>Friends</h1>
            <div id="friendsList" ref={friendListRef}>

                {
                    list ? list : <p>Not found it</p>
                }

            </div>

            <Link to={'/chat/search'}>Add new Friends</Link>
        </main>

    </FriendDiv>)

}

export { ChatFriends }