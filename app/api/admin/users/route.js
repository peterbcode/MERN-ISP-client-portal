import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import { requireAdmin } from '../_auth'

export const runtime = 'nodejs'

const clampInt = (value, min, max, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

const parseBool = (value) => {
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

export async function GET(request) {
  try {
    await connectDB()

    const admin = await requireAdmin(request)
    if (!admin) {
      return Response.json(
        { success: false, message: 'Not authorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = clampInt(searchParams.get('page'), 1, 10_000, 1)
    const limit = clampInt(searchParams.get('limit'), 1, 200, 20)
    const search = (searchParams.get('search') || '').trim()
    const role = (searchParams.get('role') || '').trim()
    const isActiveParam = parseBool(searchParams.get('isActive'))
    const sortBy = (searchParams.get('sortBy') || 'stats.accountCreated').trim()
    const sortOrder = (searchParams.get('sortOrder') || 'desc').trim()

    const skip = (page - 1) * limit
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

    const andFilters = []

    if (search) {
      andFilters.push({
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'profile.firstName': { $regex: search, $options: 'i' } },
          { 'profile.lastName': { $regex: search, $options: 'i' } },
        ],
      })
    }

    if (role) andFilters.push({ role })

    if (isActiveParam !== null) {
      andFilters.push({
        $or: [{ isActive: isActiveParam }, { 'stats.isActive': isActiveParam }],
      })
    }

    const filter = andFilters.length ? { $and: andFilters } : {}

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          'username email role isActive stats.isActive stats.accountCreated profile.firstName profile.lastName createdAt updatedAt'
        )
        .lean(),
      User.countDocuments(filter),
    ])

    return Response.json(
      {
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('Admin users error:', error)
    return Response.json({ success: false, message: 'Failed to fetch users' }, { status: 500 })
  }
}
