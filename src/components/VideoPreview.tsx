import React from 'react';
import { useVideo } from '../contexts/VideoContext';

const VideoPreview: React.FC = () => {
  const { metadata, videoSummary } = useVideo();

  // Extract video ID from URL to show thumbnail
  const getYouTubeID = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  if (!metadata) {
    return (
      <div className="bg-youtube-light-gray rounded-lg p-6 text-center">
        <p className="text-youtube-dark-gray">No video data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg overflow-hidden bg-youtube-light-gray">
        <img
          src={`https://img.youtube.com/vi/${getYouTubeID(metadata.video_title)}/maxresdefault.jpg`}
          alt="Video thumbnail"
          className="w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://img.youtube.com/vi/${getYouTubeID(metadata.video_title)}/hqdefault.jpg`;
          }}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{metadata.video_title}</h2>
        <p className="text-youtube-dark-gray mb-2">{metadata.channel_name}</p>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Video Summary</h3>
          <p className="text-sm text-youtube-dark-gray">
            {videoSummary?.summary || "No summary available"}
          </p>
        </div>
        
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {metadata.tags.slice(0, 5).map((tag, index) => (
                <span key={index} className="bg-youtube-light-gray text-youtube-dark-gray text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {metadata.tags.length > 5 && (
                <span className="text-youtube-dark-gray text-xs">+{metadata.tags.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;