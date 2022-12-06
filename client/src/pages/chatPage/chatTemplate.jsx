import React, { useEffect, useState, useRef } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { GoThreeBars } from 'react-icons/go'

let CustomNav = styled.nav`

    flex: 1; height: 100%;

    background: linear-gradient(270deg, rgb(0, 100, 205) 10%, rgb(1, 50, 140) 100%);

    display: flex; align-items: center;

    justify-content: center; flex-direction: column;


    & div#navLinks {

        width: 100%; height: 80%;

        display: flex; align-items: end;

        justify-content: center; flex-direction: column;


    }

    & div#navLinks a {

        width: 20vw; height: 20%; text-decoration: none;

        border-radius: 8px 0 0 8px; background: rgba(40, 40, 40, 0.6);

        display: flex; align-items: center;

        justify-content: center; margin: 1rem 0;
    }

    & div#navLinks #link_exit {

        width: 20vw; height: 20%; text-decoration: none;

        border-radius: 8px 0 0 8px; background: rgb(30 30 30); 

        display: flex; align-items: center;

        justify-content: center; margin: 1rem 0;
        
        font-size: 18pt; border: none;

        cursor: pointer; transition: 0.3s;
    }

    & div#navLinks #link_exit:hover {

      background: rgb(255 100 100); box-shadow: inset 0 0 4rem rgb(250 70 70);
    }

    & div#navLinks a.active{
        background: rgba(255, 255, 255, 0.9); color: black;
    }

    & svg {
        display: none;
    }

    @media(max-width: 770px){

        position: absolute; left: 0; top: 0;

        background: linear-gradient(270deg, rgba(0, 100, 205, 0.9) 10%, rgba(1, 50, 140, 0.9) 100%);

        z-index: 10;

       & div#navLinks a {

          width: 40vw; margin-left: 5rem;
       } 

       & svg {
          width: 3rem; height: 3rem;

          position: fixed; top: 2rem;

          left: 1rem; display: block;

          fill: black; transition: 0.3s;
       }

    }

`
let divStyle = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }

function Chat({ cookies }) {


    let loc = useLocation()

    let nav = useNavigate()

    let [menuOpen, setMenuOpen] = useState(screen.width <= 770 ? false : true)

    let MenuRef = useRef()

    let screenRef = useRef()

    useEffect(() => {

        let routes = ['home', 'friends', 'groups', 'search']

        if (MenuRef.current) {
            routes.forEach(route => {

                document.querySelector(`#${route}`).style.display = 'flex'

                document.querySelector(`#link_exit`).style.display = 'flex'
            })

            if (loc.pathname.includes('home')) {

                document.querySelector('#home').classList.add('active')

                routes.forEach(route => {

                    if (route !== 'home') {

                        if (document.querySelector(`#${route}`).classList.contains('active')) {
                            document.querySelector(`#${route}`).classList.remove('active')
                        }
                    }
                })

            }
            else if (loc.pathname.includes('friends')) {

                document.querySelector('#friends').classList.add('active')

                routes.forEach(route => {

                    if (route !== 'friends') {

                        if (document.querySelector(`#${route}`).classList.contains('active')) {
                            document.querySelector(`#${route}`).classList.remove('active')
                        }
                    }
                })
            }
            else if (loc.pathname.includes('groups')) {

                document.querySelector('#groups').classList.add('active')

                routes.forEach(route => {

                    if (route !== 'groups') {

                        if (document.querySelector(`#${route}`).classList.contains('active')) {
                            document.querySelector(`#${route}`).classList.remove('active')
                        }
                    }
                })
            }

            else if (loc.pathname.includes('search')) {

                document.querySelector('#search').classList.add('active')

                routes.forEach(route => {

                    if (route !== 'search') {

                        if (document.querySelector(`#${route}`).classList.contains('active')) {
                            document.querySelector(`#${route}`).classList.remove('active')
                        }
                    }
                })
            }

            else if (loc.pathname.includes('room')) {
                routes.forEach(route => {

                    if (document.querySelector(`#${route}`).classList.contains('active')) {
                        document.querySelector(`#${route}`).classList.remove('active')
                    }

                    document.querySelector(`#${route}`).style.display = 'none'

                    document.querySelector(`#link_exit`).style.display = 'none'
                })
            }
        }

    }, [loc])

    let handle = () => {

        if(screen.width > 770){
            setMenuOpen(true)
        }
    }

    useEffect(() => {

        window.addEventListener('resize', handle)
        
       return () => {

        window.removeEventListener('resize', handle)
       }
    }, [])

    function exitFunc() {

        cookies.remove('auth_creds')

        nav('/')
    }

    return (

        <div style={divStyle}>


            <CustomNav ref={screenRef}>

                <GoThreeBars onClick={() => { setMenuOpen(prev => !prev) }} />

                {

                    menuOpen ?

                        <div id="navLinks" ref={MenuRef}>
                            <Link to={'/chat/home'} id='home'>Home</Link>

                            <Link to={'/chat/friends'} id='friends'>Friends</Link>

                            <Link to={'/chat/groups'} id='groups'>Groups</Link>

                            <Link to={'/chat/search'} id='search'>Search</Link>

                            <button id='link_exit' onClick={exitFunc}>Exit</button>
                        </div>

                        : null
                }

            </CustomNav>

            <Outlet />
        </div>
    )
}


export { Chat }