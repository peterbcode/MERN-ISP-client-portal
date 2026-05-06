require('dotenv').config({ path: '.env.local' });
const { sendContactEmail } = require('./lib/email.js');

async function testEmail() {
  console.log('Testing contact email service...');
  
  const result = await sendContactEmail({
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    message: 'This is a test message from the contact form.',
    service: 'Test Service'
  });
  
  console.log('Email result:', result);
}

testEmail().catch(console.error);
