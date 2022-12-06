import React, { useEffect, } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'


let CustomDiv = styled.div`

flex: 3; height: 100%;

display: flex; align-items: center;

justify-content: center; background: rgb(30 30 30);

& main {
    width: 100%; height: 95%;

    border-radius: 0 8px 8px 0; 

    display: flex; align-items: center;

    justify-content: center; background: white;

    flex-direction: column;
}

& h1, p {
    color: black;
}

& h1 {
    width: 100%; flex: 1;

    display: flex; align-items: center;

    justify-content: center; margin: 0;

    font-size: 40pt;
}

`

function ChatHome({ cookies }) {


    let creds = cookies.get('auth_creds') || false

    let nav = useNavigate()


    useEffect(() => {


        if(!creds){

            return nav('/')
        }

    }, [])


    return (

        <CustomDiv>

            <main>

                <h1>{`${creds.nick}, ` || null} be well welcome!</h1>

            </main>
        </CustomDiv>
    )

}


export { ChatHome }