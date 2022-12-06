import React from 'react'
import styled from 'styled-components'

let MessageDiv = styled.div`

position: fixed; top: 0; left: 0;

width: 100%; height: 100%; 

display: flex ; align-items: center;

justify-content: center; background: rgba(255, 255, 255, 0.2);


& #msg_body {

    width: 30vw; height: fit-content;

    display: flex; align-items: center;

    justify-content: space-between; flex-direction: column;
    
    padding: 0.5rem 0 2rem 0; background: ${ ({theme}) => theme};

    border-radius: 4px;
}

& #msg_body h3 {

    width: 100%; flex: 1;

    display: flex ; align-items: center;

    justify-content: center; color: ${ ({fontColor}) => fontColor};

    font-size: 16pt;
}

& #msg_body p {

    width: 100%; flex: 2;

    display: flex ; align-items: center;

    justify-content: center; color: ${ ({fontColor}) => fontColor};

    font-size: 14pt;

}

`


function MessageTemplate({ msg, title, background, fontColor, onClick}) {

    return (
        <MessageDiv theme={background ? background : 'white'} fontColor={fontColor ? fontColor : 'black'} onClick={onClick}>

            <div id='msg_body'> 
                {
                    title ? <h3>{title}</h3> : null
                }
                <p>
                    {
                        msg
                    }
                </p>
            </div>
        </MessageDiv>
    )
}



export { MessageTemplate }