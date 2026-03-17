'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { safeAlert, safeConfirm } from '@/lib/native-dialog'

type AdminUser = {
  _id: string
  username: string
  email: string
  role: 'user' | 'admin'
  isActive?: boolean
  stats?: { isActive?: boolean; accountCreated?: string }
  profile?: { firstName?: string; lastName?: string }
  createdAt?: string
}

type Pagination = { page: number; limit: number; total: number; pages: number }

const getIsActive = (user: AdminUser) => user.isActive ?? user.stats?.isActive ?? true
const getCreatedAt = (user: AdminUser) => user.stats?.accountCreated ?? user.createdAt ?? ''

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rowSaving, setRowSaving] = useState<Record<string, boolean>>({})

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [isActive, setIsActive] = useState('')
  const [sortBy, setSortBy] = useState('stats.accountCreated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const params = useMemo(
    () => ({
      page: String(page),
      limit: String(limit),
      search,
      role,
      isActive,
      sortBy,
      sortOrder,
    }),
    [page, limit, search, role, isActive, sortBy, sortOrder]
  )

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadUsers()
    }, 300)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const loadUsers = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await apiClient.admin.getUsers(params)
      if (res.data?.success) {
        setUsers(res.data.users || [])
        setPagination(res.data.pagination || null)
      } else {
        setError(res.data?.message || 'Failed to fetch users')
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (id: string, update: Record<string, any>) => {
    if (update?.role) {
      const ok = safeConfirm(`Change this user role to "${update.role}"?`)
      if (!ok) return
    }

    if (typeof update?.isActive === 'boolean') {
      const ok = safeConfirm(
        update.isActive ? 'Re-activate this user account?' : 'Deactivate this user account?'
      )
      if (!ok) return
    }

    setRowSaving((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await apiClient.admin.updateUser(id, update)
      if (!res.data?.success) throw new Error(res.data?.message || 'Update failed')

      const updated = res.data.user as AdminUser
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)))
    } catch (e: any) {
      safeAlert(e?.message || 'Failed to update user')
    } finally {
      setRowSaving((prev) => ({ ...prev, [id]: false }))
    }
  }

  const deactivateUser = async (id: string) => {
    const ok = safeConfirm('Deactivate this user account?')
    if (!ok) return

    setRowSaving((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await apiClient.admin.deactivateUser(id)
      if (!res.data?.success) throw new Error(res.data?.message || 'Deactivate failed')
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: false } : u)))
    } catch (e: any) {
      safeAlert(e?.message || 'Failed to deactivate user')
    } finally {
      setRowSaving((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="mt-1 text-sm text-zinc-400">Search, filter, sort, and manage user accounts</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Search</label>
            <input
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              placeholder="username / email / name"
              className="w-72 max-w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setPage(1)
                setRole(e.target.value)
              }}
              className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Active</label>
            <select
              value={isActive}
              onChange={(e) => {
                setPage(1)
                setIsActive(e.target.value)
              }}
              className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Sort</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="stats.accountCreated">Created</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
                <option value="isActive">Active</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Page size</label>
            <select
              value={String(limit)}
              onChange={(e) => {
                setPage(1)
                setLimit(Number.parseInt(e.target.value, 10))
              }}
              className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {error ? <div className="mt-4 text-sm text-red-400">{error}</div> : null}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400">
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Active</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-6 text-zinc-300">
                  Loading users...
                </td>
              </tr>
            ) : users.length ? (
              users.map((user) => {
                const isUserActive = getIsActive(user)
                const createdAt = getCreatedAt(user)
                const saving = !!rowSaving[user._id]
                const displayName = user.profile?.firstName || user.profile?.lastName
                  ? `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim()
                  : user.username

                return (
                  <tr key={user._id} className="border-t border-zinc-700/70">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{displayName}</div>
                      <div className="text-xs text-zinc-400">@{user.username}</div>
                    </td>
                    <td className="py-3 pr-4 text-zinc-200">{user.email}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={user.role}
                        disabled={saving}
                        onChange={(e) => updateUser(user._id, { role: e.target.value })}
                        className="rounded-lg border border-zinc-600 bg-zinc-900 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-60"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        disabled={saving}
                        onClick={() => updateUser(user._id, { isActive: !isUserActive })}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-60 ${
                          isUserActive
                            ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30'
                            : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
                        }`}
                      >
                        {isUserActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-zinc-300">
                      {createdAt ? new Date(createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        disabled={saving || !isUserActive}
                        onClick={() => deactivateUser(user._id)}
                        className="rounded-lg bg-red-600/20 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-600/30 disabled:opacity-60"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-zinc-300">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-zinc-400">
          {pagination
            ? `Showing page ${pagination.page} of ${pagination.pages} (${pagination.total} total)`
            : null}
        </div>
        <div className="flex gap-2">
          <button
            disabled={isLoading || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={isLoading || (pagination ? page >= pagination.pages : users.length < limit)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
