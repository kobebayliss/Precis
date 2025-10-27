const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
let database;
let cachedDb = null;

function generateShortcode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Connect to DB
async function databaseConnection() {
  if (cachedDb) return cachedDb;
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    cachedDb = client.db('precis-db');
    return cachedDb;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
}

// Generate short code and add entry to DB
app.post('/api/shorten', async (req, res) => {
  try {
    const database = await databaseConnection();
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
      shortUrl: `/${shortCode}`
    });

  } catch (error) {
    console.error(error)
  }
})

// Redirect users to original URL
app.get('/:shortCode', async(req, res) => {
  try {
    const database = await databaseConnection();
    const { shortCode } = req.params;
    const link = await database.collection('links').findOne({ shortCode })

    await database.collection('links').updateOne(
      { shortCode },
      { $inc: {clicks: 1} }
    )

    res.redirect(link.originalUrl)

  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
})

module.exports = serverless(app);