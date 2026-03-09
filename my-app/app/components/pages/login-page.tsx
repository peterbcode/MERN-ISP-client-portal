import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-28 text-white">
      <section className="w-full max-w-md rounded-2xl border border-orange-500/40 bg-zinc-950 p-8 shadow-2xl shadow-orange-900/30">
        <h1 className="text-2xl font-bold text-orange-500">Login</h1>
        <p className="mt-2 text-sm text-orange-100/80">Sign in to your account.</p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-orange-100">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-orange-100">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            />
          </div>
          <button type="submit" className="w-full rounded-lg bg-orange-600 py-2 font-semibold hover:bg-orange-500">
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-orange-100/80">
          Need help?{" "}
          <Link href="/contact" className="font-semibold text-orange-400 hover:text-orange-300">
            Contact support
          </Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
