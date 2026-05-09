import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GalleryGrid from '../components/GalleryGrid';
import BookingModal from '../components/BookingModal';
import API_URL from '../api';

const StoryCard = ({ wedding, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 cursor-pointer hover:border-amber-400/50 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-60 z-10" />
      <img
        src={wedding.featuredImage}
        alt={wedding.coupleName}
        className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 p-5 flex items-end z-20">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs tracking-widest uppercase mb-2">
            <span className="h-px w-8 bg-amber-400/70" />
            Featured Story
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-white leading-tight">
            {wedding.coupleName}
          </h3>
          <p className="text-sm text-white/80 mt-2">{wedding.location}</p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [allImages, setAllImages] = useState([]);
  const [allWeddings, setAllWeddings] = useState([]);
  const [preWeddingWeddings, setPreWeddingWeddings] = useState([]);
  const [weddingWeddings, setWeddingWeddings] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    // Fetch all gallery images
    axios
      .get(`${API_URL}/api/gallery`)
      .then((res) => setAllImages(res.data))
      .catch((err) => console.error('Error fetching gallery:', err));

    // Fetch all weddings
    axios
      .get(`${API_URL}/api/weddings`)
      .then((res) => {
        setAllWeddings(res.data);
        setPreWeddingWeddings(res.data.filter((w) => w.category === 'PreWedding'));
        setWeddingWeddings(res.data.filter((w) => w.category === 'Weddings'));
      })
      .catch((err) => console.error('Error fetching weddings:', err));
  }, []);

  // Fallback cinematic visuals
  const featured = allImages.slice(0, 6);
  const fallbackImages = [
    'https://images.unsplash.com/photo-1523438097201-512ae6f8d4e8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523438097201-512ae6f8d4e8?auto=format&fit=crop&w=1200&q=60',
    'https://images.unsplash.com/photo-1529636798451-6fdbd8ce9f0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523438097201-512ae6f8d4e8?auto=format&fit=crop&w=1200&q=70',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529636798451-6fdbd8ce9f0b?auto=format&fit=crop&w=1200&q=70',
  ];

  const storyWeddings = allWeddings.slice(0, 6).length > 0 ? allWeddings.slice(0, 6) : [];

  return (
    <div className="bg-black text-white">
      {/* Offset for fixed navbar */}
      <div className="h-16" aria-hidden />

      {/* 1) Home section */}
      <section id="home" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-14 sm:py-20">
            {/* Left */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-3 text-amber-300/90 text-xs tracking-widest uppercase mb-5">
                <span className="h-px w-10 bg-amber-400/70" />
                Cinematic Editorial Wedding Photography
              </div>

              <h1 className="font-serif italic text-4xl sm:text-5xl leading-tight">
                PRESERVING THE MAGIC OF YOUR SPECIAL DAY
              </h1>
              <p className="mt-5 text-white/80 max-w-xl text-sm sm:text-base leading-relaxed">
                We capture emotions, chaos, laughter, and timeless memories in a cinematic editorial
                style.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('weddings')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full px-6 py-3 border border-amber-400/40 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold"
                >
                  Explore Weddings
                </button>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="rounded-full px-6 py-3 bg-amber-400 text-black hover:bg-amber-300 transition-colors text-sm font-semibold"
                >
                  Book Your Shoot
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { k: '12+', v: 'Years' },
                  { k: '500+', v: 'Stories' },
                  { k: '4.9', v: 'Rating' },
                ].map((x) => (
                  <div key={x.v} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="text-amber-300 text-lg font-semibold">{x.k}</div>
                    <div className="text-xs text-white/70 mt-1">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <div className="absolute inset-0 bg-black/45 z-10" />
                <img
                  src={allImages[0]?.imageUrl || fallbackImages[0]}
                  alt="Cinematic wedding"
                  className="w-full h-[520px] object-cover scale-105 hero-zoom"
                />

                <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end">
                  <div className="max-w-md">
                    <div className="text-amber-300 text-xs tracking-widest uppercase">
                      Luxury • Gold accents • Black overlay
                    </div>
                    <h2 className="mt-2 font-serif italic text-3xl leading-tight">
                      A cinematic way to relive every moment.
                    </h2>
                    <p className="mt-3 text-white/80 text-sm leading-relaxed">
                      From chaotic laughter to quiet vows—your story, preserved like a film.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) PreWedding */}
      <section id="prewedding" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-col sm:flex-row">
            <div>
              <h2 className="font-serif italic text-3xl sm:text-4xl">PreWedding Stories</h2>
              <p className="text-white/70 mt-2">Small moments. Big emotions.</p>
            </div>
            <div className="text-amber-300 text-sm tracking-widest uppercase">Editorial • Cinematic • Timeless</div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {preWeddingWeddings.slice(0, 3).map((wedding) => (
              <Link key={wedding._id} to={`/wedding/${wedding._id}`}>
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 group cursor-pointer hover:border-amber-400/50 transition h-full">
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={wedding.featuredImage || fallbackImages[0]}
                      alt={wedding.coupleName}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-white/90 font-medium">{wedding.coupleName}</div>
                    <div className="text-white/70 text-sm mt-1">{wedding.location}</div>
                    <div className="text-xs text-pink-300 mt-2">PreWedding</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3) Weddings */}
      <section id="weddings" className="py-16 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-col sm:flex-row">
            <div>
              <h2 className="font-serif italic text-3xl sm:text-4xl">Weddings</h2>
              <p className="text-white/70 mt-2">Preserve the chaos, keep the glow.</p>
            </div>
            <div className="text-amber-300 text-sm tracking-widest uppercase">Slow zoom • Black overlay • Gold</div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddingWeddings.slice(0, 2).map((wedding) => (
              <Link key={wedding._id} to={`/wedding/${wedding._id}`}>
                <div className="relative overflow-hidden rounded-3xl border border-white/10 group cursor-pointer hover:border-amber-400/50 transition h-full">
                  <img
                    src={wedding.featuredImage || fallbackImages[0]}
                    alt={wedding.coupleName}
                    className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute inset-0 p-6 flex items-end">
                    <div>
                      <div className="text-amber-300 text-xs tracking-widest uppercase">Wedding</div>
                      <div className="mt-2 font-serif italic text-2xl">{wedding.coupleName}</div>
                      <div className="mt-2 text-white/80 text-sm">{wedding.location}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4) Featured Wedding Stories */}
      <section className="py-16" aria-label="Featured wedding stories">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif italic text-3xl sm:text-4xl">
            Capturing the Madness &amp; Chaos We Call Weddings
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {storyWeddings.map((wedding) => (
              <Link key={wedding._id} to={`/wedding/${wedding._id}`}>
                <StoryCard wedding={wedding} onClick={() => {}} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5) Portfolio */}
      <section id="portfolio" className="py-16 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-col sm:flex-row">
            <div>
              <h2 className="font-serif italic text-3xl sm:text-4xl">Portfolio</h2>
              <p className="text-white/70 mt-2">A living gallery of your favorite frames.</p>
            </div>
            <div className="text-amber-300 text-sm tracking-widest uppercase">Hover to zoom</div>
          </div>

          <div className="mt-10">
            <GalleryGrid images={allImages} />
          </div>
        </div>
      </section>

      {/* 6) Films */}
      <section id="films" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif italic text-3xl sm:text-4xl">Films</h2>
          <p className="text-white/70 mt-2">Cinematic edits for your biggest chapters.</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl border border-white/10 overflow-hidden bg-white/5">
                <div className="relative">
                  <img
                    src={allImages[i + 1]?.imageUrl || fallbackImages[i + 1]}
                    alt="Film"
                    className="h-56 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border border-amber-400/50 bg-black/30 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[12px] border-l-amber-300 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-white/90 font-medium">{['Cinematic Trailer', 'Vows & Highlights', 'Golden Moments'][i]}</div>
                  <div className="text-white/70 text-sm mt-1">Editorial • Slow motion • Gold</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7) Contact */}
      <section id="contact" className="py-16 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif italic text-3xl sm:text-4xl">Contact</h2>
          <p className="text-white/70 mt-2">Tell us the date—let’s craft your story.</p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-amber-300 text-xs tracking-widest uppercase">Studio</div>
              <div className="mt-3 text-2xl font-serif italic">THE GOLDEN SHUTTER</div>
              <p className="text-white/70 mt-3 text-sm leading-relaxed">
                We’re based in India and shoot across cities for weddings, preweddings, and cinematic films.
              </p>
              <div className="mt-5 space-y-2 text-sm text-white/80">
                <div>
                  <span className="text-amber-300">Email:</span> hello@thegoldenshutter.com
                </div>
                <div>
                  <span className="text-amber-300">Phone:</span> +91 99999 99999
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-serif italic text-white">Quick Inquiry</h3>
              <p className="text-white/70 text-sm mt-2">
                Have a question? Click below to get in touch with us directly.
              </p>
              <button
                onClick={() => setBookingModalOpen(true)}
                className="mt-6 rounded-full px-6 py-3 bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-colors text-sm w-full"
              >
                Start Your Booking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8) Book */}
      <section id="book" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-black/40 to-transparent" />
            <div className="relative p-8 sm:p-12">
              <h2 className="font-serif italic text-3xl sm:text-5xl">Ready To Book?</h2>
              <p className="text-white/80 mt-3 max-w-2xl">
                Share your date and location. We’ll respond with package details and availability.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="rounded-full px-6 py-3 bg-amber-400 text-black hover:bg-amber-300 transition-colors text-sm font-semibold"
                >
                  Book Your Shoot
                </button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="rounded-full px-6 py-3 border border-amber-400/40 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold"
                >
                  Back to Top
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </div>
  );
};

export default Home;

