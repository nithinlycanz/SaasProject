import React, { createContext, useContext, useState } from 'react';

interface VideoMetadata {
  channel_name: string;
  video_title: string;
  description: string;
  tags: string[];
}

interface VideoSummary {
  summary: string;
}

interface ThumbnailVariation {
  id: string;
  imageUrl: string;
}

interface VideoContextType {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  metadata: VideoMetadata | null;
  setMetadata: (data: VideoMetadata | null) => void;
  videoSummary: VideoSummary | null;
  setVideoSummary: (data: VideoSummary | null) => void;
  thumbnailVariations: ThumbnailVariation[];
  setThumbnailVariations: (variations: ThumbnailVariation[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  customText: string;
  setCustomText: (text: string) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  uploadedImages: File[];
  setUploadedImages: (images: File[]) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [videoSummary, setVideoSummary] = useState<VideoSummary | null>(null);
  const [thumbnailVariations, setThumbnailVariations] = useState<ThumbnailVariation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  return (
    <VideoContext.Provider
      value={{
        videoUrl,
        setVideoUrl,
        metadata,
        setMetadata,
        videoSummary,
        setVideoSummary,
        thumbnailVariations,
        setThumbnailVariations,
        isLoading,
        setIsLoading,
        customText,
        setCustomText,
        selectedTheme,
        setSelectedTheme,
        uploadedImages,
        setUploadedImages,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};