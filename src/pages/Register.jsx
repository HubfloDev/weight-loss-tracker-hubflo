import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import toast, { Toaster } from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import { useAuth } from '../context/AuthProvider';

const Register = () => {
  const emailRef = useRef(null);
  const firstNameRef = useRef(null); // Added first name ref
  const lastNameRef = useRef(null); // Added last name ref
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const validateForm = () => {
    if (
      !emailRef.current?.value ||
      !firstNameRef.current?.value || // Check for first name
      !lastNameRef.current?.value || // Check for last name
      !passwordRef.current?.value
    ) {
      return 'Please fill all the fields';
    }
    // if (passwordRef.current.value !== confirmPasswordRef.current.value) {
    //   return "Passwords don't match";
    // }
    return null;
  };

  // Hash the password using bcrypt before storing it in the database
  const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds (default)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
    return hashedPassword;
  };

  const registerUser = async (email, first_name, last_name, hashedPassword) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, first_name, last_name, password: hashedPassword }]); // Include first and last name
    return { data, error };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      // Hash the user's password before registration
      const hashedPassword = await hashPassword(passwordRef.current.value);

      const { data, error } = await registerUser(
        emailRef.current.value,
        firstNameRef.current.value, // Pass first name
        lastNameRef.current.value, // Pass last name
        hashedPassword
      );

      await login(emailRef.current.value, passwordRef.current.value);

      console.log('Login successful');

      if (error) {
        setErrorMsg(error.message);
        toast.error(error.message);
      } else {
        navigate('/');

        setSuccessMsg('Registration successful! You can now log in.');
        toast.success('Registration successful!');
      }
    } catch (err) {
      setErrorMsg('Error in creating account');
      toast.error('Error in creating account');
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
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Register for an account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-customGreen hover:text-customGreenDefault">
                Sign in
              </Link>
            </p>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      ref={firstNameRef}
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      ref={lastNameRef}
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen"
                    />
                  </div>
                </div>

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

                {/* <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      ref={confirmPasswordRef}
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen"
                    />
                  </div>
                </div> */}

                {errorMsg && (
                  <div className="text-sm text-red-500">{errorMsg}</div>
                )}
                {successMsg && (
                  <div className="text-sm text-green-500">{successMsg}</div>
                )}

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreenDefault"
                    disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
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

export default Register;
