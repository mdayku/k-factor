import bcrypt from 'bcryptjs';

async function main() {
  // Generate hash for password123!
  const personalHash = await bcrypt.hash('password123!', 10);
  console.log('\n=== Bcrypt Hash for Personal Accounts ===\n');
  console.log('Password: password123!');
  console.log('Hash:', personalHash);
  console.log('\n=== SQL Command for Supabase ===\n');
  console.log(`-- Fix your personal accounts`);
  console.log(`UPDATE "User" SET password = '${personalHash}', "updatedAt" = NOW() WHERE email IN ('marcusday3586@gmail.com', 'mday@syght.com');`);
  console.log('\n');
}

main().catch(console.error);

