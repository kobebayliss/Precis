const { MongoClient } = require('mongodb');
let cachedDb = null;

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

module.exports = async (req, res) => {
  try {
    const { shortCode } = req.query;
    if (!shortCode) return res.status(400).send('Missing short code');

    const db = await databaseConnection();
    const link = await db.collection('links').findOne({ shortCode });

    if (!link) return res.status(404).send('Short URL not found');

    await db.collection('links').updateOne({ shortCode }, { $inc: { clicks: 1 } });

    res.redirect(link.originalUrl);
    res.end();
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Internal Server Error');
  }
};