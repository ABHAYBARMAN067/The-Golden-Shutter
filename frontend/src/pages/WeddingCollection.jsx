import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_URL from '../api';
import Lightbox from '../components/Lightbox';
import BookingModal from '../components/BookingModal';

const WeddingCollection = () => {
  const { slug } = useParams();

  const [wedding, setWedding] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch wedding by slug or id
        const weddingRes = await axios.get(`${API_URL}/api/weddings/${slug}`);
        const weddingData = weddingRes.data;
        setWedding(weddingData);

        // Fetch photos for this wedding
        const photosRes = await axios.get(`${API_URL}/api/gallery?weddingId=${weddingData._id}`);
        setPhotos(photosRes.data);
      } catch (err) {
        console.error('Failed to fetch wedding collection:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const handlePhotoClick = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p>Loading wedding collection...</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Wedding not found</h2>
          <p className="text-white/70">Sorry, we couldn't find this wedding collection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Offset for fixed navbar */}
      <div className="h-16" aria-hidden />

      {/* Hero Section */}
      <div className="h-96 md:h-[520px] relative">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={wedding.featuredImage}
          alt={wedding.coupleName}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
          <div className="max-w-3xl">
            <div className="text-amber-300 text-xs tracking-widest uppercase font-semibold">
              {wedding.category}
            </div>
            <h1 className="font-serif italic text-4xl md:text-5xl mt-3 leading-tight">
              {wedding.coupleName}
            </h1>
            <div className="text-white/80 mt-4 text-lg">{wedding.location}</div>
            <div className="text-white/70 mt-4 text-sm">
              {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-0 py-12 md:py-16">
        {/* Description */}
        {wedding.description && (
          <div className="mb-12">
            <p className="text-white/70 text-base leading-relaxed max-w-3xl">
              {wedding.description}
            </p>
          </div>
        )}

        {/* Gallery Section */}
        <div>
          <h2 className="text-3xl font-serif italic mb-8">Wedding Gallery</h2>

          {photos.length === 0 ? (
            <div className="text-white/50 text-center py-12">No photos uploaded yet.</div>
          ) : (
            <>
              {/* Masonry Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-[200px] md:auto-rows-[250px]">
                {photos.map((photo, idx) => {
                  let gridClass = 'col-span-1';
                  if (photo.aspectRatio < 0.8) gridClass = 'row-span-2'; // Portrait
                  if (photo.aspectRatio > 1.6) gridClass = 'col-span-2'; // Landscape

                  return (
                    <div
                      key={photo._id}
                      className={`${gridClass} overflow-hidden shadow-lg group relative cursor-pointer`}
                      onClick={() => handlePhotoClick(idx)}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Videos Section (if available) */}
        {wedding.videos && wedding.videos.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-3xl font-serif italic mb-8">Cinematic Films</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wedding.videos.map((videoUrl, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                  <div className="relative h-64 md:h-72 bg-black/40">
                    <iframe
                      width="100%"
                      height="100%"
                      src={videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Film ${idx + 1}`}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-black/40 to-transparent" />
            <div className="relative">
              <h3 className="text-3xl font-serif italic">Love What You See?</h3>
              <p className="text-white/70 mt-3 max-w-2xl">
                We'd love to capture your special moments too. Book a consultation with us today.
              </p>
              <button
                onClick={() => setBookingModalOpen(true)}
                className="mt-6 rounded-full px-8 py-3 bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors"
              >
                Book Your Shoot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={photos}
        currentIndex={currentPhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />

      {/* Booking Modal */}
      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </div>
  );
};

export default WeddingCollection;

