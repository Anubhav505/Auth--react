import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import Signup from "./Signup.jsx";
import Home from './Home.jsx'
import Dashboard from './Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={< Home />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>   
      </Routes>
    </Router>
  </StrictMode>,
)
