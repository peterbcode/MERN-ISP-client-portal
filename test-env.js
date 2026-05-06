console.log('Loading dotenv...');
require('dotenv').config({ path: '.env.local' });
console.log('Environment variables:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
console.log('CONTACT_EMAIL:', process.env.CONTACT_EMAIL);
