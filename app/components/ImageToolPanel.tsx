import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';

interface ImagesToolPanelProps {
  isOpen: boolean;
  onClose: () => void;
  addImageToCanvas: (imageUrl: string) => void;
}

const ImagesToolPanel: React.FC<ImagesToolPanelProps> = ({ isOpen, onClose, addImageToCanvas }) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('animals');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Example categories
  const categories = ['animals', 'cats', 'landscapes', 'food'];

  // Fetch images based on selected category
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/images`, {
          params: { category: selectedCategory },
        });
        setImages(response.data); // Expecting response.data to be an array of image URLs
        setSelectedImage(null);
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]); // Clear images in case of an error
      }
    };

    fetchImages();
  }, [selectedCategory]);

  if (!isOpen) return null;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleAddImage = () => {
    if (selectedImage) {
      addImageToCanvas(selectedImage);
      setSelectedImage(null);
    }
  };

  return (
    <div className="fixed top-16 left-24 mt-7 h-[calc(100vh-80px)] bg-white pt-8 shadow-lg w-80 transition-transform duration-300 ease-in-out z-20 overflow-y-auto">
      <button onClick={onClose} className="absolute mt-5 right-2 top-4 p-2 text-gray-600 hover:text-gray-900 transition">
        <IoIosArrowBack size={24} />
      </button>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Image Options</h2>

        {/* Category Selection */}
        <div className="mb-4 flex flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`mr-2 mb-2 px-3 py-2 rounded ${
                selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              } transition`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Image List */}
        <h3 className="text-lg font-semibold mb-3">Select an Image</h3>
        <div className="grid grid-cols-2 gap-2">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className={`cursor-pointer border rounded overflow-hidden hover:shadow-lg transition ${
                selectedImage === imageUrl ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => handleImageSelect(imageUrl)}
            >
              <img src={imageUrl} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Selected Image Preview and Add Button */}
        {selectedImage && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected Image</h3>
            <img src={selectedImage} alt="Selected" className="w-full h-auto border rounded mb-2" />
            <button
              onClick={handleAddImage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Image to Canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesToolPanel;
