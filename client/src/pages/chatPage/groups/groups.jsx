import React, {useState, useEffect, useRef} from 'react'
import { io } from 'socket.io-client'
import styled from 'styled-components'

import { CreateGroupInterface } from './createGroup'

import { Link, useNavigate } from 'react-router-dom'


let GroupsDiv = styled.div`

flex: 3; height: 100%;

display: flex; align-items: center;

justify-content: center; background: rgb(30 30 30);

& main {
    width: 100%; height: 95%;

    border-radius: 0 8px 8px 0; 

    display: flex; align-items: center;

    justify-content: space-between; background: white;

    flex-direction: column;
}

& h1, p, strong {
    color: black;
}

& h1 {
    margin-top: auto;
}

& main #groupsList {

    width: 80%; height: 50%;

    display: flex; align-items: center;

    flex-wrap: wrap; justify-content: center;

    box-shadow: inset 0 0 1rem rgba(100, 100, 100, 0.4);  background: rgb(180 180 180);

    overflow: scroll; overflow-x: hidden; margin: 4rem 0 ;
}

& main #groupsList::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
}

& main #groupsList::-webkit-scrollbar {
    width: 0.3rem; 
}

& main #groupsList::-webkit-scrollbar-thumb {

    background: linear-gradient(180deg, rgb(100 100 100) 10%, rgb(40 40 40) 100%);
}

& main #groupsList article {

    width: 40%; height: 40%;

    box-shadow: 0 0 2rem rgba(250, 250, 250, 0.6); border-radius: 4px;

    display: flex; align-items: center;

    justify-content: center; background: white;

    margin: 1rem; cursor: pointer;

    user-select: none; 
}

& main #groupActions {

    width: 90%; height: 8rem;

    display: flex; align-items: center;

    justify-content: space-between;
}

& main #groupActions a {

    width: 40%; height: 4rem;

    border: 0; box-shadow: 0 0 2rem rgba(0, 0, 0, 0.4);

    text-align: center; line-height: 4rem;

    font-size: 16pt; border-radius: 8px;

    color: black; background: white;

    cursor: pointer; text-decoration: none;
}

& main #groupActions button {

    width: 50%; height: 4rem;

    border: 0; box-shadow: 0 0 2rem rgba(0, 0, 0, 0.4);

    text-align: center; line-height: 4rem;

    font-size: 16pt; border-radius: 8px;

    color: black; background: white;

    cursor: pointer; text-decoration: none;
}

@media(max-width: 770px) {


    & main #groupsList {

        margin: 1rem 0 1rem 0; 
    }

    & main #groupsList article {

        width: 80%
    }

    & main #groupActions {

        flex-direction: column; width: 100%;

        height: fit-content; margin-bottom: 1rem;

    }

    & main #groupActions a, & main #groupActions button{

        width: 80%; margin: 0.5rem 0;

    }

    & main h1 {
        height: 4rem; margin-top: 1rem;
    }

}

`


function Groups ({cookies}){


    let [ groups, setGroups ] = useState(false)

    let [createGroup, setCreateGroup ] = useState(false)

    let conn = io('http://localhost:4000', {auth: cookies.get('auth_creds')})


    let nav = useNavigate()

    let groupListRef = useRef()

    useEffect(() => {

        let scroll = groupListRef.current.scrollHeight 

        groupListRef.current.scrollTo({ left: 0, top: scroll + scroll * 0.3, behavior: 'smooth'})

    }, [groups])

    useEffect(() => {

        if(cookies.get('auth_creds')){

            conn.on('connect', () => {

                conn.emit('groups list', {}, (res) => {

                    
                    if(res && res.length > 0){

                        let tmp = res.map((el, id) => {

                            return <article key={id} onClick={() => handleClickChat(el.name_chat)}>
                                <p><strong>Name: </strong>{el.name_chat}</p>
                            </article>
        
                        })

                        setGroups(tmp)
                    }
                })
            })
        }

        return () => {

            conn.off('connect')
        }

    }, [])

    function handleClickChat(chat) {

        cookies.get('chat_current') ? cookies.remove('chat_current') : null
        
        cookies.set('chat_current', {chat, type: 'group'})

        nav('/chat/room')

    }

    return (

        <GroupsDiv>

            <main>

                {
                    createGroup ? <CreateGroupInterface close={() => setCreateGroup(false)} conn={conn} /> :null
                }

                <h1>Groups</h1>

                <div id='groupsList' ref={groupListRef}>
                    {
                        groups ? groups : <p>Don't found it</p>
                    }
                </div>

                <div id="groupActions">
                <Link to={'/chat/search'}>Search for groups</Link>
                <button onClick={() => setCreateGroup(true)}> Create a new group </button>
                </div>
                
            </main>
        </GroupsDiv>
    )
}


export { Groups }