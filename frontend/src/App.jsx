import React from 'react'
import './App.css'
import { Navigate, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import Network from './pages/Network'

function App() {
  const {userData}=useContext(userDataContext)
  return (
    <Routes>
      <Route path="/" element={userData?<Home/>:<Navigate to='/login'/>}/>
      <Route path="/signup" element={userData?<Navigate to='/'/>:<Signup/>}/>
      <Route path="/login" element={userData?<Navigate to='/'/>:<Login/>}/>
      <Route path="/network" element={userData?<Network/>:<Navigate to="/login"/>}/>
    </Routes>
  )
}

export default App