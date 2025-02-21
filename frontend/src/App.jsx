import { useState } from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/Sighnup';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
    
  )
}

export default App
