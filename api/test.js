module.exports = (req, res) => {
  res.json({ 
    status: 'working',
    hasEnv: !!process.env.MONGODB_URI
  });
};