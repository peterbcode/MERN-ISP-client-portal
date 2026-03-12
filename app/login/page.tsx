import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";
import LoginForm from "../../components/auth/LoginForm";

const Page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-black text-white">
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
