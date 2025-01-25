import { Route, Routes } from "react-router-dom";
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
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