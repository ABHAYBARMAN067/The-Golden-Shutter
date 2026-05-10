import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BookingModal from './BookingModal';

const NAV_ITEMS = [
  { label: 'Home', href: '/', isHashLink: false },
  { label: 'PreWedding', href: '#prewedding', isHashLink: true },
  { label: 'Weddings', href: '#weddings', isHashLink: true },
  { label: 'Portfolio', href: '#portfolio', isHashLink: true },
  { label: 'Films', href: '#films', isHashLink: true },
  { label: 'Contact', href: '#contact', isHashLink: true },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    // Handle hash-based navigation
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  const navClass = useMemo(() => {
    return scrolled
      ? 'bg-black/60 backdrop-blur-xl border-b border-amber-500/20'
      : 'bg-transparent';
  }, [scrolled]);

  const scrollToHash = (href) => {
    if (!href.startsWith('#')) return;
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('#')) return false;
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
  <Link
    to="/"
    onClick={() => setOpen(false)}
    className="text-white hover:text-amber-400 transition-colors"
  >
    <h1 className="font-serif italic text-xl sm:text-2xl tracking-wide">
      ASUPHOTOGRAPHY
    </h1>
  </Link>
</div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => 
              item.isHashLink ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash(item.href);
                  }}
                  className="text-sm font-medium text-white/90 hover:text-amber-400 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-amber-400'
                      : 'text-white/90 hover:text-amber-400'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Book Now button (desktop) */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={() => setBookingModalOpen(true)}
              className="rounded-full px-5 py-2 text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors"
            >
              Book Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Open menu"
          >
            <span className="sr-only">Menu</span>
            <div className="relative w-5 h-4">
              <span
                className={`absolute left-0 right-0 top-0 h-0.5 bg-white transition-transform duration-200 ${
                  open ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-2 h-0.5 bg-white/90 transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-4 h-0.5 bg-white transition-transform duration-200 ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex flex-col gap-3 pt-2">
            {NAV_ITEMS.map((item) =>
              item.isHashLink ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    scrollToHash(item.href);
                  }}
                  className="text-sm font-medium text-white/90 hover:text-amber-400 transition-colors py-1"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium transition-colors py-1 ${
                    isActive(item.href)
                      ? 'text-amber-400'
                      : 'text-white/90 hover:text-amber-400'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setBookingModalOpen(true);
              }}
              className="mt-2 rounded-full px-5 py-2 text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors w-fit"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
    </nav>
  );
};

export default Navbar;

