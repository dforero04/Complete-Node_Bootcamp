const dotenv = require('dotenv');
const mongoose = require('mongoose');

// How to handle all uncaught exceptions in the application
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ⛔️ Shutting down application...');
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// How to handle all unhandled rejections in the application
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! ⛔️ Shutting down application...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
