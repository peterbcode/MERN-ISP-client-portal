import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';

const PRIVATE_IPV4_PATTERNS = [
  /^10\.(?:\d{1,3}\.){2}\d{1,3}$/,
  /^192\.168\.(?:\d{1,3}\.)\d{1,3}$/,
  /^172\.(?:1[6-9]|2\d|3[0-1])\.(?:\d{1,3}\.)\d{1,3}$/,
];

const jsonError = (message, status) =>
  Response.json({ success: false, message }, { status });

function isPrivateIpv4(value) {
  if (!value || !PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(value))) {
    return false;
  }

  return value.split('.').every((part) => {
    const octet = Number(part);
    return Number.isInteger(octet) && octet >= 0 && octet <= 255;
  });
}

async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    const decoded = jwt.verify(authHeader.substring(7), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const isActive = user?.isActive ?? user?.stats?.isActive ?? true;

    if (!user || user.role !== 'admin' || !isActive) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getProtectedRouterConfig(request, options = {}) {
  if (process.env.ENABLE_ROUTER_API !== 'true') {
    return {
      error: jsonError('Router management is disabled until a real router integration is configured.', 503),
    };
  }

  const routerIP = process.env.ROUTER_IP;
  if (!isPrivateIpv4(routerIP)) {
    return {
      error: jsonError('Router management is not configured.', 503),
    };
  }

  await connectDB();
  const admin = await requireAdmin(request);
  if (!admin) {
    return {
      error: jsonError('Not authorized', 401),
    };
  }

  const routerPassword = process.env.ROUTER_ADMIN_PASSWORD;
  if (options.requireRouterPassword !== false && !routerPassword) {
    return {
      error: jsonError('Router credentials are not configured.', 503),
    };
  }

  return { routerIP, routerPassword, admin };
}

