import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Authenticate user by checking their hashed password
  // const login = async (email, password) => {
  //   // Fetch the user by email from the database
  //   const { data: user, error } = await supabase
  //     .from('users')
  //     .select('*')
  //     .eq('email', email)
  //     .single(); // Ensure we only get one user

  //   if (error) {
  //     return { error: 'User not found' };
  //   }

  //   // Compare the plain-text password with the hashed password from the database
  //   const passwordMatch = await bcrypt.compare(password, user.password);
  //   console.log({ passwordMatch, user });
  //   if (!passwordMatch) {
  //     return { error: 'Invalid password' };
  //   }

  //   localStorage.setItem('user', JSON.stringify(user));
  //   navigate('/');

  //   return { data: user };
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setLoading(true);

      if (!passwordRef.current?.value || !emailRef.current?.value) {
        setErrorMsg('Please fill in the fields');
        toast.error('Please fill in the fields');
        setLoading(false);
        return;
      }

      const { data, error } = await login(
        emailRef.current.value,
        passwordRef.current.value
      );

      console.log('Inside error');
      if (error) {
        setErrorMsg('Email or Password Incorrect');
        toast.error('Email or Password Incorrect');
      } else {
        toast.success('Login successful!');
        user.role === 'admin' || user.role === 'doctor'
          ? navigate('/dashboard')
          : navigate('/'); // Navigate to home page
      }
    } catch (error) {
      setErrorMsg('An error occurred during login');
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <img
              alt="Your Company"
              src="/logo.png"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Not a member?{' '}
              <Link
                to="/register"
                className="font-semibold text-customGreen hover:text-customGreenDefault">
                Register
              </Link>
            </p>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      ref={emailRef}
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      ref={passwordRef}
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="text-sm text-red-500">{errorMsg}</div>
                )}

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreenDefault"
                    disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 lg:block bg-gray-100">
          <div className="mx-12 my-12 mt-14 pt-12 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
            <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
              <div className="relative">
                <img
                  src="/unsplash1.jpg"
                  alt=""
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
            </div>
            <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
              <div className="relative">
                <img
                  src="/unsplash2.jpg"
                  alt=""
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="relative">
                <img
                  src="/unsplash3.jpg"
                  alt=""
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
            </div>
            <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
              <div className="relative">
                <img
                  src="/unsplash4.jpg"
                  alt=""
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="relative">
                <img
                  src="/unsplash4.jpg"
                  alt=""
                  className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
