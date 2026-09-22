import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/expenseTracker')
  .then((conn) => {
    console.log(`MongoDB connected to database: "${conn.name}"`);
    createApp().listen(PORT, () => console.log(`API on :${PORT}`));
  })
  .catch((e) => {
    console.error('DB connection failed:', e.message);
    process.exit(1);
  });
