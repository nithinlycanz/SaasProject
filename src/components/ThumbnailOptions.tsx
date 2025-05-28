import React, { useRef, useState } from 'react';
import { Upload, Trash2, Plus } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';

interface ThumbnailOptionsProps {
  onGenerate: () => void;
}

const ThumbnailOptions: React.FC<ThumbnailOptionsProps> = ({ onGenerate }) => {
  const {
    customText,
    setCustomText,
    selectedTheme,
    setSelectedTheme,
    uploadedImages,
    setUploadedImages
  } = useVideo();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  const themes = [
    'Modern', 'Minimal', 'Bold', 'Colorful', 
    'Dark', 'Tech', 'Vintage', 'Professional'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (newFiles.length > 0) {
      setUploadedImages([...uploadedImages, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Customize Your Thumbnail</h2>
      
      <div>
        <label className="block text-sm font-medium text-youtube-dark-gray mb-2">
          Custom Text (optional)
        </label>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Enter text to display on the thumbnail"
          className="input-field"
        />
        <p className="text-xs text-youtube-gray mt-1">
          Keep it short and impactful for better visibility
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-youtube-dark-gray mb-2">
          Theme Style (optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                selectedTheme === theme
                  ? 'bg-youtube-red text-white'
                  : 'bg-youtube-light-gray text-youtube-black hover:bg-gray-200'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-youtube-dark-gray mb-2">
          Upload Images (optional)
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-youtube-red bg-red-50' : 'border-gray-300 hover:border-youtube-red'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-youtube-gray mb-2" />
          <p className="text-sm text-youtube-dark-gray">
            Drag and drop images here, or click to select files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        {uploadedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedImages.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-youtube-red transition-colors"
            >
              <Plus className="h-6 w-6 text-youtube-gray" />
            </button>
          </div>
        )}
      </div>
      
      <button
        type="button"
        onClick={onGenerate}
        className="btn-primary w-full py-3 mt-6"
      >
        Generate Thumbnails
      </button>
    </div>
  );
};

export default ThumbnailOptions;