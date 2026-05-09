import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import WeddingCollection from './pages/WeddingCollection';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/wedding/:slug" element={<WeddingCollection />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;


