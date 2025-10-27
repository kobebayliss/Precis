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

app.get('/api/test', (req, res) => {
  res.json({
    status: 'API is working',
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
  });
});

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
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('MongoDB connected successfully');
    cachedDb = client.db('precis-db');
    return cachedDb;
  } catch (error) {
    console.error('Connection failed:', error.message);
    throw error;
  }
}

// Generate short code and add entry to DB
app.post('/api/shorten', async (req, res) => {
  console.log('POST /api/shorten called');
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
    console.error('Error in /api/shorten:', error.message);
    res.status(500).json({ error: 'Failed to shorten URL', details: error.message });
  }
})

// Redirect users to original URL
app.get('/:shortCode', async(req, res) => {
  try {
    const database = await databaseConnection();
    const { shortCode } = req.params;
    const link = await database.collection('links').findOne({ shortCode })

    if (!link) {
      return res.status(404).send('Short URL not found');
    }

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

module.exports.handler = serverless(app);