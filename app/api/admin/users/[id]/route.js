import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { requireAdmin } from '../../_auth'

export const runtime = 'nodejs'

const getUserId = (context) => context?.params?.id
const mutationsEnabled = () =>
  process.env.NODE_ENV !== 'production' || process.env.ADMIN_MUTATIONS_ENABLED === 'true'
const roleChangesEnabled = () =>
  mutationsEnabled() && (process.env.NODE_ENV !== 'production' || process.env.ADMIN_ROLE_CHANGES_ENABLED === 'true')

export async function GET(request, context) {
  try {
    await connectDB()

    const admin = await requireAdmin(request)
    if (!admin) {
      return Response.json(
        { success: false, message: 'Not authorized. Admin access required.' },
        { status: 401 }
      )
    }

    const id = getUserId(context)
    const user = await User.findById(id).select(
      'username email role isActive stats.isActive stats.accountCreated profile preferences gaming createdAt updatedAt'
    )
    if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 })

    return Response.json({ success: true, user }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin get user error:', error)
    return Response.json({ success: false, message: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(request, context) {
  try {
    await connectDB()

    const admin = await requireAdmin(request)
    if (!admin) {
      return Response.json(
        { success: false, message: 'Not authorized. Admin access required.' },
        { status: 401 }
      )
    }

    if (!mutationsEnabled()) {
      return Response.json(
        { success: false, message: 'Admin mutations are disabled on this environment.' },
        { status: 403 }
      )
    }

    const id = getUserId(context)
    const body = await request.json()

    const allowedFields = ['username', 'email', 'role', 'isActive', 'profile', 'preferences']
    const updateData = {}

    for (const field of allowedFields) {
      if (body[field] === undefined) continue

      if (field === 'role' && !roleChangesEnabled()) {
        return Response.json(
          { success: false, message: 'Role changes are disabled on this environment.' },
          { status: 403 }
        )
      }

      if (field === 'isActive') {
        updateData.isActive = body.isActive
        updateData['stats.isActive'] = body.isActive
        continue
      }

      updateData[field] = body[field]
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('username email role isActive stats.isActive stats.accountCreated profile createdAt updatedAt')

    if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 })

    return Response.json({ success: true, user }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin update user error:', error)
    return Response.json({ success: false, message: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB()

    const admin = await requireAdmin(request)
    if (!admin) {
      return Response.json(
        { success: false, message: 'Not authorized. Admin access required.' },
        { status: 401 }
      )
    }

    if (!mutationsEnabled()) {
      return Response.json(
        { success: false, message: 'Admin mutations are disabled on this environment.' },
        { status: 403 }
      )
    }

    const id = getUserId(context)
    if (String(id) === String(admin._id)) {
      return Response.json(
        { success: false, message: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false, 'stats.isActive': false },
      { new: true }
    ).select('-password')

    if (!user) return Response.json({ success: false, message: 'User not found' }, { status: 404 })

    return Response.json(
      { success: true, message: 'User deactivated successfully' },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('Admin delete user error:', error)
    return Response.json({ success: false, message: 'Failed to deactivate user' }, { status: 500 })
  }
}
