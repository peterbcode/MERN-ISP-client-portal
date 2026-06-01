import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";
import LoginForm from "../../components/auth/LoginForm";

const Page = () => {
  return (
    <>
      <Navbar />
      <div className="site-page flex min-h-screen items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <div className="site-panel w-full max-w-md space-y-8 rounded-2xl p-6 sm:p-8">
          <div className="text-center">
            <p className="site-eyebrow">Client Portal</p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Sign in to your account to access your dashboard and games
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <SiteFooter />
    </>
  );
};

export default Page;
