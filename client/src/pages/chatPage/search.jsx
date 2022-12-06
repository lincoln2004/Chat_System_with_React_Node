import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import styled from 'styled-components'

import { CustomSelect } from '../components/select'

let SearchDiv = styled.div`

flex: 3; height: 100%;

display: flex; align-items: center;

justify-content: center; background: rgb(30 30 30);

& main {
    width: 100%; height: 95%;

    background: white; border-radius: 0 8px 8px 0;

    display: flex; align-items: center;

    justify-content: center; flex-direction: column;
}

& main h1 {
    color: black; font-size: 20pt;

    width: 100%; height: 10%;

    display: flex; align-items: center;

    justify-content: center;
}

& main form {

    width: 100%; height: 10%;

    display: flex; align-items: center;

    justify-content: center; position: relative;
}

& main form input {

    width: 50%; height: 3rem;

    text-align: center; line-height: 3rem;

    background: rgb(240 240 240); border-radius: 4px;

    border: none; font-size: 16pt;

    color: black; outline: none;

    transition: 0.3s; margin: 0 1rem;
}

& main form input:focus {

    background: rgb(230 230 230);
}

& main form input[type=submit] {

    width: 10%; height 3rem;

    border: none; border-radius: 4px;

    background: rgb(60 160 240); font-size: 14pt;

    margin: 0 1rem 0 1rem; transition: 0.3s;
}

& main form input[type=submit]:hover {

    background: rgb(50 130 220);
}

& main #result_box {

    width: 80%; height: 70%;

    display: flex; align-items: center;

    justify-content: center; overflow-x: hidden;

    overflow-y: scroll; background: rgb(180 180 180);
 
    flex-wrap: wrap; margin: 2rem 0;

    border-radius: 8px;
}

& main #result_box::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
}

& main #result_box::-webkit-scrollbar {
    width: 0.3rem; 
}

& main #result_box::-webkit-scrollbar-thumb {

    background: linear-gradient(180deg, rgb(100 100 100) 10%, rgb(40 40 40) 100%);
}

& main #result_box .friends_card {

    width: 30%; height 30%;

    box-shadow: 0 0 2rem 0.5rem rgba(230, 230, 230, 0.6);

    border-radius: 4px; justify-content: center;

    display: flex; align-items: center;

    margin: 1rem; background: white;
    
}

& main #result_box .friends_card p {

    display: flex; align-items: center;

    justify-content: center; color: black;
    
    width: 60%; height: 100%; font-size: 14pt;

    margin: 0 1rem;
}

& main #result_box .friends_card p strong {

    color: black; font-size: 16pt; margin: 0 1rem 0 0;
}

& main #result_box .friends_card button {

   width: 40%; height: 100%;

   background: rgb(240 240 240); border: none;

   color: black; font-size: 14pt;

   transition: 0.3s; border-radius: 0 4px 4px 0;
}

& main #result_box .friends_card button:hover {

    background: rgb(150 150 150); color: white;

    cursor: pointer;
}

@media(max-width: 770px) {

    height: 100%;

    & main h1 {
        flex: 0.5;
    }

    & main form {

        flex-direction: column; margin: 2rem 0;

        align-items: center; display: flex;

        flex: 1;
    }

    & main form > * {
        width: 80%;
    }

    & main form input, & main form input[type=submit] {

       width: 80%; margin: 0; margin: 0.5rem 0;
    }

    & main #result_box {
        margin: 1rem 0; flex: 3; display: flex; 
    }

    & main #result_box .friends_card {

        width: 80%; height: 40%;
    }
}

`

function Search({ cookies }) {

    let conn = io('http://localhost:4000', { auth: cookies.get('auth_creds') })
    let creds = cookies.get('auth_creds') || false

    let [result, setResult] = useState([])

    let searchRef = useRef()
    let resultChanges = useRef()
    let selectChooseRef = useRef()

    let nav = useNavigate()

    let [selectActivate , setselectActivate] = useState(false)

    useEffect(() => {

        if (!creds) {
            nav('/')
        }

    }, [])

    function handleForm(e) {

        e.preventDefault()

        let type = selectChooseRef.current.value

        let search = searchRef.current.value

        if ( search && type) {

            result ?  setResult([]): null
           
            if(type == 'Group'){

                conn.emit('search new groups', {group: search}, (res) => {

                    if (res) {
    
                        let tmp = res.map((el, id) => {
    
                            return <article key={id} className='friends_card'>
                                <p>
                                    <strong>Group:</strong>
                                    {el.name_chat}
                                </p>
    
                                <button onClick={() => addFriend(el.name_chat)}>Add</button>
    
                            </article>
                        })
    
                        setResult(tmp)
    
                    }
                })
            }
            else if (type == 'Friend'){

                conn.emit('search new friend', { friend: search }, res => {


                    if (res) {
    
                        let tmp = res.map((el, id) => {
    
                            return <article key={id} className='friends_card'>
                                <p>
                                    <strong>User:</strong>
                                    {el.nickname}
                                </p>
    
                                <button onClick={() => addFriend(el.nickname)}>Add</button>
    
                            </article>
                        })
    
                        setResult(tmp)
    
                    }
                })
            }
        }

    }

    function addFriend(entity) {


        if(selectChooseRef.current.value == 'Friend'){
            conn.emit('add new friend', entity, (res) => {

                if (res) {
                    nav('/chat/friends')
                }
            })
        }
        else if (selectChooseRef.current.value == 'Group'){

            conn.emit('join new group', entity, (res) => {

                if(res){
                    nav('/chat/groups')
                }
            })
        }

    }

    function selectOpt(opt){


        selectChooseRef.current.value = opt
    }

    return (<SearchDiv>

        <main>

            <h1>Search for friends or groups:</h1>

            <form onSubmit={handleForm}>
                <CustomSelect active={selectActivate} onClick={() => { setselectActivate(prev => !prev )}}>
                    <input type="text"  readOnly={true} placeholder='groups or friends' id={'selectMenu'} ref={selectChooseRef}/>

                    <article className='option_card' onClick={() => selectOpt('')}>
                        None
                    </article>
                    <article className='option_card' onClick={() => selectOpt('Group')}>
                        Groups
                    </article>

                    <article className='option_card' onClick={() => selectOpt('Friend')}>
                        Friends
                    </article>
                </CustomSelect>
                <input type="text" id="search_input" ref={searchRef} placeholder='Search for Friends or Groups' />
                <input type="submit" value="Search" />
            </form>

            <div id="result_box" ref={resultChanges}>

                {
                    result ? result : null
                }
            </div>
        </main>
    </SearchDiv>)
}


export { Search }