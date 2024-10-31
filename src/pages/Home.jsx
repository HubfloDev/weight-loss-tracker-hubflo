import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import LineGraph from '../components/LineChart';
import Timeline from '../components/Timeline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../index.css';
import { supabase } from '../supabase/client';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const { id } = useParams(); // Get the id from the route
  const [weightEntries, setWeightEntries] = useState([]);
  const [formValues, setFormValues] = useState({
    weight: '',
    date: new Date() // Default to current date
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [user, setUser] = useState(null); // Store user details

  // Fetch the user details from the users table in Supabase
  const fetchUserFromTable = async (userId) => {
    try {
      const { data: userDetails, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      } else {
        setUser(userDetails); // Set user details in state
      }
    } catch (error) {
      console.error('Error fetching user from users table:', error.message);
      setErrorMessage('Could not fetch user details. Please log in.');
      toast.error('Failed to fetch user details.');
    }
  };

  // Fetch the logged-in user ID from Supabase auth
  const fetchAuthUser = async () => {
    // Fetch the user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      // If user is in localStorage, fetch their details from the users table
      fetchUserFromTable(storedUser.id);
    } else {
      // If no user is in localStorage, fetch from Supabase Auth
      const {
        data: { user: authUser },
        error
      } = await supabase.auth.getUser();

      if (authUser) {
        // Store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(authUser));

        // Fetch full user details from the users table using authUser.id
        fetchUserFromTable(authUser.id);
      } else if (error) {
        console.error('Error fetching auth user:', error.message);
        setErrorMessage('Could not fetch user details. Please log in.');
        toast.error('Failed to fetch user details.');
      }
    }
  };

  // Fetch weight entries for the logged-in user
  const fetchWeightEntries = async () => {
    if (!user) return; // Ensure we have the user before fetching entries

    try {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('user_id', user.id) // Fetch only the records for the logged-in user
        .order('date', { ascending: true });

      if (error) {
        throw error;
      } else {
        setWeightEntries(data);
        toast.success('Weight entries fetched successfully!');
      }
    } catch (error) {
      console.error('Error fetching weight entries:', error.message);
      setErrorMessage(
        'Could not fetch weight entries. Please try again later.'
      );
      toast.error('Failed to fetch weight entries.');
    }
  };

  useEffect(() => {
    if (id) {
      // If there's an id in the route, fetch the details for that user
      fetchUserFromTable(id);
    } else {
      // If no id is provided, try fetching the authenticated user
      fetchAuthUser();
    }
  }, [id]);

  useEffect(() => {
    // Fetch weight entries when the user is available
    if (user) {
      fetchWeightEntries();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormValues({ ...formValues, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Set loading to true when form is submitted
    setErrorMessage(''); // Clear any previous errors

    const newEntry = {
      date: formValues.date.toISOString().split('T')[0], // Format the date to YYYY-MM-DD
      weight: Number(formValues.weight),
      user_id: user.id // Add the user's ID to the new entry
    };

    try {
      const { data, error } = await supabase
        .from('weight_records')
        .insert([newEntry]);

      if (error) {
        throw error;
      } else {
        setWeightEntries([...weightEntries, newEntry]);
        setFormValues({ weight: '', date: new Date() }); // Reset the form
        toast.success('New weight entry added successfully!');
      }
    } catch (error) {
      console.error('Error inserting new weight entry:', error.message);
      setErrorMessage('Could not add a new entry. Please try again.');
      toast.error('Failed to add new weight entry.');
    } finally {
      setLoading(false); // Set loading to false when the form submission is done
    }
  };

  return (
    <div className="w-ful bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <div
        className="relative min-h-screen p-8 max-w-[90%] w-full flex flex-col justify-start items-start"
        style={{ margin: '0 auto' }}>
        {/* Gradient background with custom shape */}
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
          className="absolute left-[calc(50%-11rem)] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />

        <h1 className="relative z-10 text-3xl font-bold text-gray-900 text-left">
          Weight Tracker
        </h1>

        {/* Display an error message if there is one */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {/* Use a form element for proper submission */}
        <form
          className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 flex items-center w-full"
          onSubmit={handleSubmit}>
          <Input
            label="Today's Weight"
            name="weight"
            placeholder="Enter your weight"
            type="number"
            value={formValues.weight}
            onChange={handleChange} // Proper onChange handler to update form values
            required
          />
          <div className="flex flex-col w-full">
            <label
              htmlFor="date-picker"
              className="block text-sm font-medium text-gray-900">
              Date of Weight-In
            </label>
            <div className="w-full mt-2">
              <DatePicker
                id="date-picker"
                selected={formValues.date}
                onChange={handleDateChange} // Correct onChange handler for DatePicker
                dateFormat="yyyy-MM-dd"
                className="block !w-full rounded-md border-0 py-1.5  px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customGreen sm:text-sm sm:leading-6"
                placeholderText="Select a date"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-customGreen text-white  py-1.5  mt-[24px] rounded-md"
            disabled={loading} // Disable the button while loading
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Grid for displaying the charts */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 flex items-center w-full my-14">
          {/* Line Graph Component */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Progress Chart
            </h2>
            <LineGraph data={weightEntries} />
          </div>

          {/* Timeline Component */}
          <div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Timeline
                </h2>
                <Timeline data={weightEntries} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
