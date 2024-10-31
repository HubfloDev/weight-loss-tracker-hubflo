import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import toast, { Toaster } from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import { useAuth } from '../context/AuthProvider';

const Register = () => {
  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [role, setRole] = useState('user'); // Default role is user
  const { login } = useAuth();
  const navigate = useNavigate();

  // Define role badges with their respective styles
  const roles = [
    { name: 'user', color: 'bg-green-50 text-green-700 ring-green-600/20' },
    { name: 'admin', color: 'bg-red-50 text-red-700 ring-red-600/10' },
    { name: 'doctor', color: 'bg-blue-50 text-blue-700 ring-blue-700/10' }
  ];

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const validateForm = () => {
    if (
      !emailRef.current?.value ||
      (role === 'user' &&
        (!firstNameRef.current?.value || !lastNameRef.current?.value)) ||
      !passwordRef.current?.value
    ) {
      return 'Please fill all the required fields';
    }
    return null;
  };

  const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };

  const registerUser = async (
    email,
    first_name,
    last_name,
    hashedPassword,
    role
  ) => {
    console.log('ROLE', role);
    const { data, error } = await supabase
      .from('users')
      .insert([
        { email, first_name, last_name, password: hashedPassword, role }
      ]);
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

      const hashedPassword = await hashPassword(passwordRef.current.value);

      const { data, error } = await registerUser(
        emailRef.current.value,
        role === 'user' ? firstNameRef.current.value : null, // Only pass first name if role is 'user'
        role === 'user' ? lastNameRef.current.value : null, // Only pass last name if role is 'user'
        hashedPassword,
        role
      );

      if (error) {
        setErrorMsg(error.message);
        toast.error(error.message);
      } else {
        await login(emailRef.current.value, passwordRef.current.value);
        if (role == 'doctor' || role == 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }

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

            <div className="mt-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Select Role
              </label>
              <div className="flex space-x-2 mt-2">
                {roles.map((r) => (
                  <span
                    key={r.name}
                    onClick={() => setRole(r.name)}
                    className={`inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset ${
                      role === r.name
                        ? 'bg-customGreen text-white'
                        : 'bg-white text-gray-600'
                    } ring-gray-300`}>
                    {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {role === 'user' && (
                  <>
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
                          required={role === 'user'}
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
                          required={role === 'user'}
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen"
                        />
                      </div>
                    </div>
                  </>
                )}

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

        {/* Retaining the existing image layout */}
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
