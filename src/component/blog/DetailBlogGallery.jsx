import React from "react";
import { motion } from "framer-motion";

const DetailBlogGallery = ({ gallery }) => {
  if (!gallery || gallery.length === 0) return null;

  // Helper to construct image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("https")) return path;
    
    // Remove any absolute path prefixes
    let cleanPath = path;
    
    // If it contains a drive letter or full path, extract just the uploads part
    if (path.includes(':') || path.includes('xampp') || path.includes('backend')) {
      if (path.includes('uploads')) {
        const parts = path.split('uploads');
        cleanPath = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
      }
    } else {
      cleanPath = path.replace(/^backend[\\/]/, "").replace(/\\/g, "/");
    }
    
    const fullUrl = `http://localhost:5000/${cleanPath}`;
    return fullUrl;
  };

  return (
    <div className="mt-12">
      <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Gallery
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((image, index) => {
          const imageUrl = getImageUrl(image);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={
                  imageUrl && !imageUrl.includes("via.placeholder.com") && !imageUrl.includes("C:\\") && !imageUrl.includes("C:/")
                    ? imageUrl
                    : "https://placehold.co/600x400?text=Gallery+Image"
                }
                alt={`Gallery ${index + 1}`}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400?text=Gallery+Image";
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailBlogGallery;
