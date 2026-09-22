import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-budget')
  .then(() => {
    console.log('MongoDB connected');
    createApp().listen(PORT, () => console.log(`API on :${PORT}`));
  })
  .catch((e) => {
    console.error('DB connection failed:', e.message);
    process.exit(1);
  });
