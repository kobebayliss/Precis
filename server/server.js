require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    
    const database = client.db('precis-db');
    const collections = await database.listCollections().toArray();

    console.log(collections)
    
    const testEntry = {
      shortCode: 'ABCDEF',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt: new Date()
    }

    await database.collection('links').insertOne(testEntry)

  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();