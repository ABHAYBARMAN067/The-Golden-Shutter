import React from 'react';

const GalleryGrid = ({ images }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 auto-rows-[200px] md:auto-rows-[300px]">
      {images.map((img) => {
        let gridClass = 'col-span-1 row-span-1';
        if (img.aspectRatio < 0.8) gridClass = 'row-span-2 col-span-1'; // Portrait
        if (img.aspectRatio > 1.6) gridClass = 'col-span-2 row-span-1'; // Landscape

        return (
          <div
            key={img._id}
            className={`${gridClass} overflow-hidden group relative`}
          >
            <img
              src={img.imageUrl}
              alt="wedding"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        );
      })}
    </div>
  );
};

export default GalleryGrid;

