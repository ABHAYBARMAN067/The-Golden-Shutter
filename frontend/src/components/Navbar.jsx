import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="flex justify-between items-center p-6 bg-white shadow-sm sticky top-0 z-50">
    <h1 className="text-xl font-bold tracking-tighter">THE WEDDING CAPTURE</h1>
    <div className="space-x-6 text-sm font-medium">
      <Link to="/" className="hover:text-amber-600">GALLERY</Link>
      <Link to="/admin" className="hover:text-amber-600">ADMIN</Link>
    </div>
  </nav>
);

export default Navbar;

