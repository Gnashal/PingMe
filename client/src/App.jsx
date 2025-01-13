import {Routes, Route} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import axios from 'axios'

function App() {
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;
  return (
   <Routes>
    <Route path='/' element={<Register />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/dashboard' element={<Dashboard />}/>
   </Routes>
  )
}

export default App
