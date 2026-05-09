const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, required: true },
  role: String,
  suiteNumber: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing users
  await User.deleteMany({});
  console.log('Cleared existing users');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@ship2aruba.com',
      password: adminPassword,
      role: 'ADMIN',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: clientPassword,
      role: 'CLIENT',
      suiteNumber: 'S2A-1001',
    },
  ];

  await User.insertMany(users);
  console.log('Seeded Admin and Client accounts');

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
