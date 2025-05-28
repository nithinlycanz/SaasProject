import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import { VideoProvider } from './contexts/VideoContext';

function App() {
  return (
    <VideoProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-youtube">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/generator" element={<GeneratorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </VideoProvider>
  );
}

export default App;