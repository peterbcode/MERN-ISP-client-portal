import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongoose';

export const runtime = 'nodejs';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

async function saveSubscriber(email) {
  if (!process.env.MONGODB_URI) {
    return { stored: false };
  }

  await connectDB();
  await mongoose.connection.collection('newsletter_subscribers').updateOne(
    { email },
    {
      $setOnInsert: {
        email,
        source: 'footer',
        createdAt: new Date(),
      },
      $set: {
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  return { stored: true };
}

async function notifyWebhook(email) {
  if (!process.env.NEWSLETTER_WEBHOOK_URL) {
    return;
  }

  const response = await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      source: 'website-footer',
      subscribedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Newsletter notification failed');
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    if (!emailPattern.test(email)) {
      return Response.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    const result = await saveSubscriber(email);
    await notifyWebhook(email);

    if (!result.stored && process.env.NODE_ENV === 'production') {
      return Response.json(
        {
          success: false,
          message: 'Mailing list is not configured yet. Please contact us directly.',
        },
        { status: 503 },
      );
    }

    return Response.json({
      success: true,
      message: 'Thanks, you are on the list.',
    });
  } catch (error) {
    console.error('Newsletter signup error:', error);

    return Response.json(
      {
        success: false,
        message: 'We could not add you right now. Please try again later.',
      },
      { status: 500 },
    );
  }
}
