import React, { useRef } from 'react'

import styled from 'styled-components'



let CreateGroupDiv = styled.div`

position: fixed; width: 100%; height: 100%;

display: flex; align-items: center;

justify-content: center; background: rgba(0, 0, 0, 0.4);

left: 0; top: 0;

& section {

    width: 50%; height: 50%;

    display: flex; align-items: center;

    justify-content: center; background: white;

    border-radius: 4px; flex-direction: column;
}

& section #createGroupInterfaceHeader {

    flex: 1; width: 90%;

    display: flex; align-items: center;

    justify-content: space-between; padding: 0 1rem;
}

& section #createGroupInterfaceHeader h3 {

    color: black; font-size: 18pt;
}

& section #createGroupInterfaceHeader #closeCreateGroup {

    width: 40% height: 3rem; border: none;

    border-radius: 8px; color: black;

    font-size: 16pt; text-align: center;

    line-height: 3rem; background: rgb(180 180 180);
}

& section #createGroupInterfaceBody {

    flex: 3; width: 90%;

    display: flex; align-items: center;

    justify-content: center; 
}

& section #createGroupInterfaceBody form {

    width: 100%; height: 100%;

    display: flex; align-items: center;

    justify-content: center; flex-direction: column;
}

& section #createGroupInterfaceBody form label  {

    width: 100%; height: 20%;

    display: flex; align-items: center;

    justify-content: center; margin-bottom: 2rem;
}

& section #createGroupInterfaceBody form label input{

    width: 80%; height: 3rem; color: black;

    background: rgb(200 200 200); border: none;

    border-radius: 4px; outline: none;

    text-align: center; line-height: 3rem;

    font-size: 16pt;

}

& section #createGroupInterfaceBody form label p {

    width: 20%; height: 3rem; color: black;

    text-align: center; line-height: 3rem;

    font-size: 16pt;
}

& section #createGroupInterfaceBody form button {

    width: 50%; height: 3rem; border: none;

    background: rgb(100 230 150); 
}

@media(max-width: 770px) {

   & section {

    width: 90%; height: 70%;
   }

   & section #createGroupInterfaceBody form label {

      flex-direction: column; height: 40%;

   }

   & section #createGroupInterfaceBody form label p {
    width: 80%; height: 2rem;
   }
}

`


function CreateGroupInterface({ close, conn }) {

    let nameGroupRef = useRef()


    function CreateGroup(e) {

        e.preventDefault()

        let name = nameGroupRef.current.value

        if (name) {

            conn.emit('create new group', name, (res) => {

                if (res) {

                    location.reload()
                }
            })

        }
    }

    return (
        <CreateGroupDiv>

            <section>
                <article id='createGroupInterfaceHeader'>
                    <h3>Create a new Group</h3>

                    <button id="closeCreateGroup" onClick={() => { close() }}>Close</button>
                </article>
                <article id='createGroupInterfaceBody'>

                    <form onSubmit={CreateGroup}>

                        <label >
                            <p>Group Name: </p>
                            <input type="text" ref={nameGroupRef} />
                        </label>

                        <button>Create</button>
                    </form>
                </article>
            </section>
        </CreateGroupDiv>
    )
}


export { CreateGroupInterface }