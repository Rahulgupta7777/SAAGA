import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServicesFull from './pages/Services';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesFull />} />
    </Routes>
  )
}

export default App
