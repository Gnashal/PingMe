import { Route, Routes } from "react-router-dom";
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { useContext } from "react";
import { UserContext } from "./UserContext";

export function Router() {
    const {username, id} = useContext(UserContext)

    if (username || id) {
        
    }
    return(
        <Routes>
            <Route path='/' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/dashboard' element={<Dashboard />}/>
        </Routes>
    );
}