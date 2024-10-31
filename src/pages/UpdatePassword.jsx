import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const UpdatePassword = () => {
  const { updatePassword } = useAuth();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRef.current?.value) {
      setErrorMsg('Please fill all the fields');
      toast.error('Please fill all the fields');
      return;
    }
    // if (passwordRef.current.value !== confirmPasswordRef.current.value) {
    //   setErrorMsg("Passwords don't match. Try again");
    //   toast.error("Passwords don't match. Try again");
    //   return;
    // }
    try {
      setErrorMsg('');
      setLoading(true);
      const { error } = await updatePassword(passwordRef.current.value);
      if (!error) {
        toast.success('Password updated successfully!');
        navigate('/');
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      setErrorMsg('Error in updating password. Please try again');
      toast.error('Error in updating password');
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
              Update Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    ref={passwordRef}
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customGreen sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customGreen sm:text-sm sm:leading-6"
                  />
                </div>
              </div> */}

              {errorMsg && (
                <div className="text-sm text-red-500">{errorMsg}</div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-customGreenDefault focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customGreen"
                  disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
