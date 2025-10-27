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
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

  // Handle POST /api/url → shorten URL
  if (req.method === 'POST') {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const shortCode = generateShortcode();
    await db.collection('links').insertOne({
      shortCode,
      originalUrl: url,
      clicks: 0,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      shortCode,
      shortUrl: `/${shortCode}`,
    });
  }

  if (req.method === 'GET') {
    const shortCode = req.query.shortCode;
    if (!shortCode) return res.status(400).send('Short code is required');

    const link = await db.collection('links').findOne({ shortCode });
    if (!link) return res.status(404).send('Short URL not found');

    db.collection('links').updateOne({ shortCode }, { $inc: { clicks: 1 } }).catch(console.error);

    res.writeHead(302, { Location: link.originalUrl });
    res.end();
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};