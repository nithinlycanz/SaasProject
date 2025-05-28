import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, Check, AlertTriangle } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import VideoPreview from '../components/VideoPreview';
import ThumbnailOptions from '../components/ThumbnailOptions';
import ThumbnailResults from '../components/ThumbnailResults';
import { fetchVideoData, generateThumbnails } from '../services/api';

const GeneratorPage: React.FC = () => {
  const {
    videoUrl,
    setMetadata,
    setVideoSummary,
    thumbnailVariations,
    setThumbnailVariations,
    isLoading,
    setIsLoading,
    customText,
    selectedTheme,
    uploadedImages
  } = useVideo();
  
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // If no URL is provided, redirect to landing page
  useEffect(() => {
    if (!videoUrl) {
      navigate('/');
    } else {
      // Fetch video metadata
      const loadVideoData = async () => {
        setIsLoading(true);
        setError('');
        
        try {
          const data = await fetchVideoData(videoUrl);
          setMetadata(data.metadata);
          setVideoSummary(data.videoSummary);
          setStep(1);
        } catch (err) {
          setError('Failed to load video data. Please try again.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadVideoData();
    }
  }, [videoUrl, navigate, setMetadata, setVideoSummary, setIsLoading]);

  const handleGenerateThumbnails = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // This would normally call your backend API
      const variations = await generateThumbnails(videoUrl, customText, selectedTheme, uploadedImages);
      setThumbnailVariations(variations);
      setStep(2);
    } catch (err) {
      setError('Failed to generate thumbnails. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="youtube-container py-8 animate-fade-in">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-youtube-black hover:text-youtube-red mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
      </button>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button 
              className={`py-4 px-6 text-center flex-1 font-medium ${step === 1 ? 'bg-youtube-light-gray border-b-2 border-youtube-red' : ''}`}
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              1. Customize
            </button>
            <button 
              className={`py-4 px-6 text-center flex-1 font-medium ${step === 2 ? 'bg-youtube-light-gray border-b-2 border-youtube-red' : ''}`}
              onClick={() => setStep(2)}
              disabled={isLoading || thumbnailVariations.length === 0}
            >
              2. Choose Thumbnail
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-youtube-red animate-spin mb-4" />
              <p className="text-lg text-youtube-dark-gray">
                {step === 1 ? 'Analyzing video...' : 'Generating thumbnails...'}
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-8">
                  <VideoPreview />
                  <ThumbnailOptions onGenerate={handleGenerateThumbnails} />
                </div>
              )}
              
              {step === 2 && (
                <ThumbnailResults />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;