
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Gather</h1>
      <p>Your event planning and booking platform.</p>
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
