require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
let database;

function generateShortcode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

async function databaseConnection() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    
    database = client.db('precis-db');
    const collections = await database.listCollections().toArray();

    console.log(collections)

  } catch (error) {
    console.error('Connection failed:', error);
  }
}

app.post('/shorten', async (req, res) => {
  try {
    if (!database) {
      console.error('❌ Database not connected yet!');
      return res.status(503).json({ error: 'Database not ready' });
    }
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = generateShortcode();
    const linkEntry = {
      shortCode: shortCode,
      originalUrl: url,
      clicks: 0,
      createdAt: new Date()
    }
    await database.collection('links').insertOne(linkEntry)

    res.json({ 
      success: true, 
      shortCode,
      shortUrl: `http://localhost:${PORT}/${shortCode}`
    });

  } catch (error) {
    console.error(error)
  }
})

databaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});