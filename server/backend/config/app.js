module.exports = {
  // Secret key for JWT signing and encryption
  secret: process.env.JWT_KEY,
  // Database connection information
  database: process.env.DB_CONNECT,
  dbOptions: {
    useMongoClient: true,
  },
};
