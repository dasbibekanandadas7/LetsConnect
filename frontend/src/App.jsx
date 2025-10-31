import React from 'react'
import './App.css'
import { Navigate, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import Network from './pages/Network'
import Profile from './pages/Profile'

function App() {
  const {userData, loading }=useContext(userDataContext)
  if (loading) {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;}
  return (
    <Routes>
      <Route path="/" element={userData?<Home/>:<Navigate to='/login'/>}/>
      <Route path="/signup" element={userData?<Navigate to='/'/>:<Signup/>}/>
      <Route path="/login" element={userData?<Navigate to='/'/>:<Login/>}/>
      <Route path="/network" element={userData?<Network/>:<Navigate to="/login"/>}/>
      <Route path="/profile/:username" element={userData?<Profile/>:<Navigate to="/login"/>}/>
    </Routes>
  )
}

export default App