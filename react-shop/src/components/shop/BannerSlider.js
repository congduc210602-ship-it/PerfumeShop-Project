import React, { useState, useEffect } from 'react';
import './BannerSlider.css'; // Sẽ tạo file CSS này

const BannerSlider = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const safeBanners = Array.isArray(banners) ? banners : [];
  if (safeBanners.length === 0) {
    return null; // Don't render anything if no banners
  }

  const currentBanner = safeBanners[currentIndex];

  return (
    <div className="banner-slider-container">
      <div className="banner-slide">
        {currentBanner.linkUrl ? (
           <a href={currentBanner.linkUrl} target="_blank" rel="noopener noreferrer">
                <img
                    src={currentBanner.imageUrl || 'https://placehold.co/1200x400/f0f0f0/a0a0a0?text=Banner'}
                    alt={currentBanner.title || 'Shop Banner'}
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x400/f0f0f0/a0a0a0?text=Error' }}
                />
           </a>
        ) : (
             <img
                src={currentBanner.imageUrl || 'https://placehold.co/1200x400/f0f0f0/a0a0a0?text=Banner'}
                alt={currentBanner.title || 'Shop Banner'}
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x400/f0f0f0/a0a0a0?text=Error' }}
             />
        )}
      </div>

      {safeBanners.length > 1 && (
        <>
          <button className="prev-button" onClick={goToPrevious}>&#10094;</button>
          <button className="next-button" onClick={goToNext}>&#10095;</button>
          <div className="dots-container">
            {safeBanners.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerSlider;