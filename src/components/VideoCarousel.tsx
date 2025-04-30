
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoCarouselProps {
  videoUrls: string[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videoUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoUrls.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videoUrls.length) % videoUrls.length);
  };

  // Function to convert Google Drive links to embedded format
  const getEmbedUrl = (url: string) => {
    const fileId = url.match(/\/d\/(.+?)\/|id=(.+?)&/);
    if (fileId && (fileId[1] || fileId[2])) {
      const id = fileId[1] || fileId[2];
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    return url;
  };

  return (
    <div className="py-16 bg-solo-dark-bg relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Solo Leveling <span className="text-solo-purple">Videos</span>
        </h2>
        
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg shadow-xl border border-solo-purple/20">
            <iframe
              src={getEmbedUrl(videoUrls[currentIndex])}
              title={`Solo Leveling video ${currentIndex + 1}`}
              className="w-full h-[500px] md:h-[600px]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Controls */}
          <button 
            onClick={prevVideo} 
            className="absolute top-1/2 -left-4 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full z-10 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextVideo} 
            className="absolute top-1/2 -right-4 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full z-10 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {videoUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-solo-purple w-6' : 'bg-white/50'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;
