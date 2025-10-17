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
    const links = database.collection('links');
    console.log('Available collections:', collections);
    const result = await links.insertOne(
        {
            name: "Eddard",
            age: 43
        }
    )
    console.log('Insert successful:', result);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();