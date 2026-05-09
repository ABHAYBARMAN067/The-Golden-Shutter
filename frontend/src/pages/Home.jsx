import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GalleryGrid from '../components/GalleryGrid';

const Home = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/gallery').then((res) => setImages(res.data));
  }, []);

  return (
    <div>
      <header className="py-20 text-center">
        <h2 className="text-5xl font-serif italic text-zinc-800">Our Portfolio</h2>
        <p className="text-zinc-500 mt-4 tracking-widest text-xs uppercase">Capturing Eternal Love</p>
      </header>
      <GalleryGrid images={images} />
    </div>
  );
};

export default Home;

