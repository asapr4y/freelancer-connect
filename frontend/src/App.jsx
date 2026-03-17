import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Freelancers from './pages/Freelancers'
import Dashboard from './pages/Dashboard'
import BookingForm from './pages/BookingForm'

function App() {
  return (
    <BrowserRouter basename="/freelancer-connect">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<BookingForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App