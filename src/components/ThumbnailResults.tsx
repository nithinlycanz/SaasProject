import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import thumb1 from './assets/1.png';
import thumb2 from './assets/2.png';
import thumb3 from './assets/3.png';
import thumb4 from './assets/4.png';


const ThumbnailResults: React.FC = () => {
  const { thumbnailVariations } = useVideo();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Combine local and online placeholder images
  const placeholderImages = [thumb1, thumb2, thumb3, thumb4];

  const downloadThumbnail = (index: number) => {
    const link = document.createElement('a');
    link.href = placeholderImages[index];
    link.download = `youtube-thumbnail-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Choose Your Thumbnail</h2>

      {thumbnailVariations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {thumbnailVariations.map((variation, index) => (
              <div
                key={variation.id}
                className={`relative rounded-lg overflow-hidden group cursor-pointer transition-all ${
                  selectedIndex === index ? 'ring-4 ring-youtube-red' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={placeholderImages[index]}
                  alt={`Thumbnail variation ${index + 1}`}
                  className="w-full aspect-video object-cover"
                />

                {selectedIndex === index && (
                  <div className="absolute top-3 right-3 bg-youtube-red text-white rounded-full p-1">
                    <Check className="h-5 w-5" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadThumbnail(index);
                    }}
                    className="bg-white text-youtube-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <p className="text-white font-medium">Variation {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedIndex !== null && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => downloadThumbnail(selectedIndex)}
                className="btn-primary flex items-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Selected Thumbnail
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-youtube-dark-gray">No thumbnail variations available yet.</p>
          <p className="text-youtube-gray text-sm mt-2">
            Go back to the customize step and generate thumbnails.
          </p>
        </div>
      )}
    </div>
  );
};

export default ThumbnailResults;
