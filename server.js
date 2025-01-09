const app = require('./app');
const { connectDB } = require('./config/db');
const {serverPort} = require('./secret');


// Connect to database
connectDB();

// Start server
app.listen(serverPort, () => {
  if (!process.env.PORT) {
    console.warn('Warning: PORT is not explicitly set in the environment. Using default port 5000.');
  }
  console.log(`Server running on port ${serverPort}`);
});
