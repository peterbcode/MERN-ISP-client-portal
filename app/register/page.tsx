import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";
import RegisterForm from "../../components/auth/RegisterForm";

// Registration page component - displays the account creation form
const Page = () => {
  return (
    <>
      <Navbar />
      <div className="site-page flex min-h-screen items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <div className="site-panel w-full max-w-md space-y-8 rounded-2xl p-6 sm:p-8">
          <div className="text-center">
            <p className="site-eyebrow">New Account</p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Join our community
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
      <SiteFooter />
    </>
  );
};

export default Page;
