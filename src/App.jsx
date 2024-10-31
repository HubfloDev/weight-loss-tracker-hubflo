import { Navigate, Route, Routes } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import Register from './pages/Register';
import UpdatePassword from './pages/UpdatePassword';
import AdminRegister from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthProvider';
import NewRegister from './pages/NewRegister';
import DoctorRegister from './pages/DoctorRegister';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="w-full h-screen" style={{ minHeight: '100vh' }}>
        <div className="w-full h-full">
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/home/:id" element={<Home />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/register-admin" element={<AdminRegister />} />
            <Route path="/register-doctor" element={<DoctorRegister />} />
            <Route path="/new-register" element={<NewRegister />} />
            {(user?.role === 'admin' || user?.role === 'doctor') && (
              <Route path="/dashboard" element={<Dashboard />} />
            )}
            <Route path="/login" element={<Login />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
