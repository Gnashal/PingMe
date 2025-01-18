import {BrowserRouter} from 'react-router-dom'
import axios from 'axios'
import { Router } from './Routes'
import { UserContextProvider } from './UserContext';

function App() {
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Router/>
      </UserContextProvider>
    </BrowserRouter>
  )
}

export default App
