require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch images from Unsplash
app.get('/images', async (req, res) => {
  const category = req.query.category || 'animals'; // Default category
  const apiUrl = `https://api.unsplash.com/photos/random?count=10&query=${category}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const imageUrls = response.data.map(image => image.urls.small);
    res.json(imageUrls);
  } catch (error) {
    console.error('Error fetching images:', error); // Log error for better debugging
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Use process.env.PORT or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Change to just PORT, not localhost
});
