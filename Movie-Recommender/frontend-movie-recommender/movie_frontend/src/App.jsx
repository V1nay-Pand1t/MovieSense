import { useState } from 'react'
import './App.css'
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { UserProvider } from './components/UserContext';
import Profile from "./pages/Profile";

function App() {
  const [count, setCount] = useState(0)

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/search" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
export default App
