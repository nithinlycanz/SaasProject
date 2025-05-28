import axios from 'axios';

// Mock API responses for frontend development
// In a real application, these would call your Python backend

export const fetchVideoData = async (url: string) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Mock response based on the Python code structure
  return {
    metadata: {
      channel_name: 'Example Channel',
      video_title: url,
      description: 'This is a sample video description that would normally be fetched from the YouTube API.',
      tags: ['tutorial', 'youtube', 'thumbnails', 'ai', 'design']
    },
    videoSummary: {
      summary: 'This video explains how to create effective YouTube thumbnails that attract viewers. It covers design principles, color theory, and practical tips for higher click-through rates. The presenter demonstrates several examples of before and after thumbnail designs.'
    }
  };
};

export const generateThumbnails = async (
  url: string,
  customText: string,
  theme: string,
  images: File[]
) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // In a real app, you would upload the images and send the data to your backend
  // const formData = new FormData();
  // formData.append('url', url);
  // formData.append('customText', customText);
  // formData.append('theme', theme);
  // images.forEach((image, index) => {
  //   formData.append(`image-${index}`, image);
  // });
  
  // const response = await axios.post('/api/generate-thumbnails', formData);
  // return response.data;
  
  // For now, return mock thumbnail variations
  return [
    { id: '1', imageUrl: '/thumbnail-1.jpg' },
    { id: '2', imageUrl: '/thumbnail-2.jpg' },
    { id: '3', imageUrl: '/thumbnail-3.jpg' },
    { id: '4', imageUrl: '/thumbnail-4.jpg' }
  ];
};

export const downloadThumbnail = async (imageUrl: string) => {
  // In a real app, this would handle the download from your backend
  // or directly use the browser's download capabilities
  
  // For example:
  // const response = await axios.get(imageUrl, { responseType: 'blob' });
  // const url = window.URL.createObjectURL(new Blob([response.data]));
  // const link = document.createElement('a');
  // link.href = url;
  // link.setAttribute('download', 'thumbnail.jpg');
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};