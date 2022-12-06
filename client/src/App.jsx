import React  from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cookies from 'universal-cookie'


import { Home } from './pages/homepage'
import { Register } from './pages/register'
import { Auth } from './pages/authpage'


import { Chat } from './pages/chatPage/chatTemplate'
import { ChatHome } from './pages/chatPage/home'
import { ChatFriends } from './pages/chatPage/friends' 
import { Search } from './pages/chatPage/search'
import { RoomChat } from './pages/chatPage/chat'
import { Groups } from './pages/chatPage/groups/groups'

let cookies = new Cookies()

function App() {

  return (
    <>

      <BrowserRouter>

        <Routes>

          <Route path='/' >

            <Route path='' element={<Home />} />
            <Route path='auth' element={<Auth cookies={cookies} />} />
            <Route path='register' element={<Register />} />


            <Route path='chat' element={<Chat cookies={cookies}/>}>

              <Route path='home' element={<ChatHome cookies={cookies}/>}/>

              <Route path='friends' element={<ChatFriends cookies={cookies}/>}/>

              <Route path='groups' element={<Groups  cookies={cookies}/>}/>

              <Route path='search' element={<Search cookies={cookies}/>}/>

              <Route path='room' element={<RoomChat cookies={cookies}/>}/>

            </Route>

            
          </Route>
        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
