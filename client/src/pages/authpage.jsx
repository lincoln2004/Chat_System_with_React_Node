import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
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

function Auth({ cookies }) {

    let nickRef = useRef(null)
    let passwordRef = useRef(null)

    let [visible, setVisible] = useState(false)
    let [emptyFields, setEmptyFields] = useState(false)


    let connection = null

    let nav = useNavigate()

    useEffect(() => {

        cookies.get('auth_creds') ? cookies.remove('auth_creds') : null

        connection = io('http://localhost:4000')

    }, [])

    function handleForm(e) {

        e.preventDefault()

        setVisible(false)
        setEmptyFields(false)

        let tmp = { nick: nickRef.current.value || false, pass: passwordRef.current.value || false }

        if (Object.values(tmp).includes(false)) {
            setVisible(true)
            setEmptyFields(true)
            return
        }

        connection.emit('login process', tmp, (result) => {

            if (result) {

                cookies.set('auth_creds', tmp, { maxAge: 1800, path: '/' })

                return nav('/chat/home')
            }
            else {

                connection.connect()
                setVisible(true)
            }

        })

        Array.from(e.target.childNodes).forEach(e => {

            if (e instanceof HTMLInputElement && ((e.type == 'text') || (e.type == 'password'))) {
                e.value = ''
            }
        })
    }

    return (
        <Section>

            {
                visible ? 
                
                <MessageTemplate 
                
                onClick={() => { setVisible(prev => !prev); location.reload() }} 
                
                background={'linear-gradient(90deg,  rgb(224, 210, 13) 10%,  rgb(252, 173, 15) 90%)'}
                
                msg={emptyFields ? 'empty fields. try again' : 'unauthorized access or unknow credentials'}
                
                fontColor={'white'}
                /> : null
            }


            <form onSubmit={handleForm}>

                <div>
                    <Link to={'/'}>Back</Link>
                    <Link to={'/register'} >Register</Link>
                </div>
                <h3>Login</h3>
                <input type="text" name="nickname" ref={nickRef} placeholder="NickName" />
                <input type="password" name="pswd" ref={passwordRef} placeholder="Password" />

                <input type="submit" value="Login" />
            </form>
        </Section>
    )
}


export { Auth }