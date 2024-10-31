import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import bcrypt from 'bcryptjs';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Function to compare a plain password with the hashed password stored in the database
const checkPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Login: fetch user from the `users` table and compare password
const login = async (email, password) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('User not found');
  }

  // Compare the provided password with the stored hashed password
  const passwordMatch = await checkPassword(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  return user; // Return the user data if the password is valid
};

// Sign Out: Clear localStorage and reset the user session
const signOut = () => {
  localStorage.removeItem('user');
  return { success: true };
};

// Password Reset: Hash the new password and update it in the DB
const passwordReset = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const { data, error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('email', email);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Update Password: Hash the new password for a logged-in user
const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const { data, error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a user session exists in localStorage on app initialization
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setAuth(true);
    }
    setLoading(false);
  }, []);

  // Login handler: Authenticate the user and store session in localStorage
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const userData = await login(email, password); // Validate email and password

      // After successful login, store the user data in localStorage and update the state
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setAuth(true);
      return userData;
    } catch (error) {
      setAuth(false);
      setUser(null);
      throw error; // Pass error to the caller for displaying error messages
    } finally {
      setLoading(false);
    }
  };

  // Sign out: Clear the session from localStorage and reset user state
  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setAuth(false);
    window.open('/login', '_self');
  };

  // Password reset handler
  const handlePasswordReset = async (email, newPassword) => {
    try {
      await passwordReset(email, newPassword);
    } catch (error) {
      throw error;
    }
  };

  // Update password for logged-in user
  const handleUpdatePassword = async (newPassword) => {
    if (!user) throw new Error('No user is logged in');
    try {
      await updatePassword(user.id, newPassword);
      handleSignOut(); // Optionally sign the user out after updating the password
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        login: handleLogin,
        signOut: handleSignOut,
        passwordReset: handlePasswordReset,
        updatePassword: handleUpdatePassword
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
