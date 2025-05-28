import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, ArrowRight, Image, PencilLine, Palette } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';

const LandingPage: React.FC = () => {
  const { setVideoUrl } = useVideo();
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic YouTube URL validation
    if (!inputUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    if (!inputUrl.includes('youtube.com/watch?v=') && !inputUrl.includes('youtu.be/')) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    setError('');
    setVideoUrl(inputUrl);
    navigate('/generator');
  };

  return (
    <div className="animate-fade-in">
      <section className="bg-youtube-black text-white py-20">
        <div className="youtube-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Create Perfect YouTube Thumbnails
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-youtube-gray">
            Generate eye-catching thumbnails with AI that will help your videos stand out and get more views
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste YouTube video URL here"
                className="input-field flex-grow text-youtube-black"
              />
              <button type="submit" className="btn-primary flex items-center justify-center">
                Generate <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </form>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="youtube-container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center p-8 animate-slide-up">
              <div className="rounded-full bg-youtube-light-gray p-4 inline-flex mb-4">
                <Youtube className="h-8 w-8 text-youtube-red" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Paste Your URL</h3>
              <p className="text-youtube-dark-gray">
                Enter the YouTube video URL you want to create a thumbnail for
              </p>
            </div>
            
            <div className="card text-center p-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="rounded-full bg-youtube-light-gray p-4 inline-flex mb-4">
                <PencilLine className="h-8 w-8 text-youtube-red" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Customize</h3>
              <p className="text-youtube-dark-gray">
                Add your text, upload images, and select the perfect theme
              </p>
            </div>
            
            <div className="card text-center p-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="rounded-full bg-youtube-light-gray p-4 inline-flex mb-4">
                <Image className="h-8 w-8 text-youtube-red" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Choose Your Favorite</h3>
              <p className="text-youtube-dark-gray">
                Select from 4 AI-generated thumbnail variations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-youtube-light-gray">
        <div className="youtube-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Click-Through Rate?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-youtube-dark-gray">
            Start creating professional thumbnails in minutes
          </p>
          <button 
            onClick={() => document.querySelector('input')?.focus()} 
            className="btn-primary text-lg px-8 py-3"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;