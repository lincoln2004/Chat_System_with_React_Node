import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'

import { MessageTemplate } from './components/message'



let Section = styled.section`

width: 100%; height: 100%;

display: flex; align-items: center;

justify-content: center;  

background: linear-gradient(90deg, rgb(10 120 200), rgb(10 60 100)); 

& form {

    width: 80%; height: 80%;

    display: flex; flex-direction: column;

    align-items: center; justify-content: space-between;

    background: white; border-radius: 8px;

    padding: 1rem 4rem 4rem 4rem;
}

& input {

    width: 30vw; height: 3rem;

    color: black; text-align: center;

    line-height: 2rem; outline: none;

    border: none; border-radius: 4px;

    font-size: 14pt; margin: 1rem 0;
}

& input[type=submit] {

    background: rgb(10 80 220); color: white;

    transition: 0.3s;
}

& input[type=submit]:hover {

    background: rgb(70 170 260); cursor: pointer;
}

& input[type=text], & input[type=password] {

    background: rgb(240 240 240);
}

& form h3 {
    color: rgb(40 40 40); font-size: 16pt;

    margin-bottom: 4rem; cursor: default;
}

& form div {

    width:80%; height: 6rem; align-items: start;

    display: inline-flex; justify-content: start;
}

& form div a{

    width:20%; height: 3rem; display: inline-flex;

    justify-content: center; align-items: center;

    background: rgb(180 180 180); border-radius: 4px;

    margin: 0 0.5rem; text-decoration: none;

    transition: 0.3s;
}

& form div a:hover{

    background: rgb(100 100 100); 
    
}


@media(max-width: 770px) {

    & form {

        width: 100%; height: 100%;

        display: flex; align-items: center; 
        
        justify-content: center; flex-direction: column;

        padding: 0;
    } 

    & form div {

        width: 100%; height: 4rem;

        display: flex; align-items: center; 
        
        justify-content: center; 


    }

    & form div a {

        width: 40%; height: 3rem;

    }

    & form input {

        width: 80%;
    }
}

`

function Register() {

    let nickRef = useRef(null)
    let passwordRef = useRef(null)

    let connection = null

    let [visible, setVisible] = useState(false)

    let [success, setSuccess] = useState(false)
    useEffect(() => {

        connection = io('http://localhost:4000')


        connection.on('user creation done', () => {

            setVisible(true)
            setSuccess(true)
        })

        connection.on('user creation error', () => {

            setVisible(true)
            setSuccess(false)
        })

        return () => {
            connection.off()
            connection.close()
        }
    })



    function handleForm(e) {

        e.preventDefault()

        connection.emit('register user', { nick: nickRef.current.value, pass: passwordRef.current.value })

        Array.from(e.target.childNodes).forEach(e => {

            if (e instanceof HTMLInputElement && ((e.type == 'text') || (e.type == 'password'))) {
                e.value = ''
            }
        })
    }

    return (

        <Section >

            {
                visible ? <MessageTemplate

                    background={

                        success ?

                            'linear-gradient(90deg,  rgb(56, 252, 121) 10%,  rgb(2, 224, 76) 90%)'

                            : 'linear-gradient(90deg, rgb(252, 94, 66) 10% ,  rgb(230, 50, 18) 90%)'
                    }

                    msg={

                        success ?

                            'created with success'
                            : 'user creation error'
                    }

                    fontColor={'white'}

                    onClick={() => { setVisible(false); setSuccess(false)}} /> : null
            }

            <form onSubmit={handleForm}>

                <div>
                    <Link to={'/'}>Back</Link>
                    <Link to={'/auth'} >Login</Link>
                </div>
                <h3>Register new user</h3>
                <input type="text" name="nickname" ref={nickRef} placeholder="NickName" />
                <input type="password" name="pswd" ref={passwordRef} placeholder="Password" />

                <input type="submit" value="Register" />
            </form>
        </Section>
    )
}


export { Register }