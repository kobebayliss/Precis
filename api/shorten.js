const { MongoClient } = require('mongodb');
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
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  
  try {
    await client.connect();
    cachedDb = client.db('precis-db');
    return cachedDb;
  } catch (error) {
    console.error('Connection failed:', error.message);
    throw error;
  }
}

// Generate short code and add entry to DB
module.exports = async (req, res) => {
  const db = await databaseConnection();

  // Handle POST /api/url to shorten URL
  if (req.method === 'POST') {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const shortCode = generateShortcode();
    await db.collection('links').insertOne({
      shortCode,
      originalUrl: normalizedUrl,
      clicks: 0,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      shortCode,
      shortUrl: `/${shortCode}`,
    });
  }
};