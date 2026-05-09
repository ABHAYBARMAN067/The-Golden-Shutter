# TODO

## Frontend UI overhaul (Navbar + Hero + Featured Stories)
- [x] Update `frontend/src/components/Navbar.jsx`:
  - Transparent initially; becomes black glassmorphism on scroll
  - Sticky
  - Desktop links: Home/PreWedding/Weddings/Portfolio/Films/Contact
  - Golden “Book Now” CTA
  - Mobile hamburger menu
- [x] Update `frontend/src/pages/Home.jsx`:
  - Add sections with ids for anchor navigation

  - Hero section (left text/buttons, right cinematic fullscreen media with overlay + slow zoom)
  - Featured Wedding Stories heading + responsive card grid
  - Keep existing `GalleryGrid` inside “Portfolio” section
- [x] Update `frontend/src/index.css` (and/or `frontend/src/App.css`) with:

  - Smooth scrolling (if not already)
  - Hero zoom animation
  - Glassmorphism navbar transitions
  - Featured card hover overlay/zoom
- [ ] Smoke-test by running frontend dev server and checking:
  - Scroll behavior, mobile menu, smooth anchor scroll, hero animation

## Admin panel improvements (match Home feature style)
- [x] Update `frontend/src/pages/AdminDashboard.jsx` theme to black/gold/glassmorphism

- [ ] Improve admin layout (split preview + form, nicer typography/buttons)
- [ ] Smoke-test admin upload flow after UI changes

