require('dotenv').config();
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
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

// Connect to DB
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

// Generate short code and add entry to DB
app.post('/shorten', async (req, res) => {
  try {
    if (!database) {
      console.error('Database not connected yet!');
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
      shortUrl: `https://precis-backend.vercel.app/${shortCode}`
    });

  } catch (error) {
    console.error(error)
  }
})

// Redirect users to original URL
app.get('/:shortCode', async(req, res) => {
  try {
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

databaseConnection();
module.exports = app;
module.exports.handler = serverless(app);