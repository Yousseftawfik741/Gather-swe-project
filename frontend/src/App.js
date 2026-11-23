
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventCategories from './components/EventCategories';
import Footer from './components/Footer';

function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <EventCategories />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
