import { useState } from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/Sighnup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dash" element={<Dashboard/>}/>

      </Routes>
    </Router>
    
  )
}

export default App
