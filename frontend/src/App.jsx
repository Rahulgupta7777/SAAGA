import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServicesFull from './pages/Services';
import Schedule from './pages/Schedule';
import Offers from './pages/Offers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesFull />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/offers" element={<Offers />} />
    </Routes>
  )
}

export default App
