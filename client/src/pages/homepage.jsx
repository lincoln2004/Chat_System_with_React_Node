import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'


let Section = styled.section`

width: 100% ; height: 100%; display: grid;

background: linear-gradient(90deg, rgb(10 120 200), rgb(10 60 100)); 

grid-template-areas: 'title title' 'title title' 'describe buttons';

& h1 {
    width: 80%; height: 100%;

    align-self: center; grid-area: title;

    font-size: 10rem; margin: 0;

    user-select: none;
}

& p {
    width: 100%; height: 100%;

    grid-area: describe; justify-content: center;

    display: flex; align-items: center;

    align-self: center; font-size: 14pt;

    user-select: none;
}

& div {

    width: 100%; height: 100%;

    display: flex; align-items: center;

    justify-content: center
}

& div a {

    width: 40%; height 5rem;

    text-align: center; text-decoration: none;

    line-height: 5rem; font-size: 16pt;

    transition: 4s;
}

& div a:hover {

    text-decoration: underline;
}

@media(max-width: 770px) {

    display: flex; flex-direction: column;

    align-items: center; justify-content: center;

    width: 100vw; height: 100vh;

    & h1 {
        font-size: 5rem; display: flex; align-items: center; 
        
        justify-content: center; flex: 2; width: 100%;
    }

    & p {
        width: 100%; flex: 1;
    }

    & div {

        flex: 1;
    }

}

`

function Home() {

    return (
        <Section>

           <h1>Chat Room </h1>
           <p>to talk with your friends whole day!</p>

           <div>
            <Link to={'auth'}>Login</Link>
            <Link to={'register'}>Register</Link>
           </div>
        </Section>   
    )
}

export  { Home }