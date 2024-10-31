import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const PasswordReset = () => {
  const { passwordReset } = useAuth();
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await passwordReset(emailRef.current.value);
      if (!error) {
        setMsg('Password reset link has been sent to your email');
        toast.success('Password reset link sent successfully!');
      } else {
        toast.error(error.message);
      }
    } catch (e) {
      console.error(e);
      toast.error('An error occurred');
    }
    setLoading(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Reset Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    ref={emailRef}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customGreen sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {msg && <div className="text-sm text-green-500">{msg}</div>}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreenDefault focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customGreen"
                  disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-customGreen hover:text-customGreenDefault text-sm">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
