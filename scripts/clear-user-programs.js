// Clear programs from a user's account
// Usage: node scripts/clear-user-programs.js robertvphd@gmail.com

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/clear-user-programs.js user@example.com');
  process.exit(1);
}

async function clearPrograms() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error('❌ User not found:', email);
      process.exit(1);
    }

    console.log('\n📋 Current programs:', JSON.stringify(user.programs, null, 2));
    console.log('\n🗑️  Clearing programs array...');
    
    user.programs = [];
    await user.save();
    
    console.log('✅ Programs cleared successfully!');
    console.log('📋 New programs array:', user.programs);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearPrograms();
