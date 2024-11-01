require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // This line serves static files

// Endpoint to fetch images from Unsplash
app.get('/images', async (req, res) => {
  const category = req.query.category || 'animals'; // Default category
  const apiUrl = `https://api.unsplash.com/photos/random?count=10&query=${category}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const imageUrls = response.data.map(image => image.urls.small);
    res.json(imageUrls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
