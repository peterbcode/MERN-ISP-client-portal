const users = [
  { name: "Peter B", email: "peter@example.com", role: "admin", created: "2026-01-10" },
  { name: "Support Agent", email: "support@example.com", role: "staff", created: "2026-02-03" },
];

const AdminPage = () => {
  return (
    <main className="bg-slate-950 px-4 pb-16 pt-32 text-slate-100 sm:px-6 lg:px-8 lg:pt-40">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">
            <span className="text-orange-500">RVC</span> Admin Panel
          </h1>
          <button className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500">
            Logout
          </button>
        </div>

        <article className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-3 text-xl font-semibold">User Stats</h2>
          <ul className="space-y-1 text-slate-300">
            <li>Total Users: 2</li>
            <li>Admins: 1</li>
            <li>Staff: 1</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-3 text-xl font-semibold">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="border-b border-slate-800">
                    <td className="px-3 py-2">{user.name}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.role}</td>
                    <td className="px-3 py-2">{user.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
};

export default AdminPage;
