import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/privateRoute';
import Landing from './pages/landing';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Causes from './pages/causes';
import CauseDetails from './pages/causeDetails';
import Fundraise from './pages/fundraise';
import Settings from './pages/settings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={(
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            )}
          />
          <Route
            path="/causes"
            element={(
              <PrivateRoute>
                <Causes />
              </PrivateRoute>
            )}
          />
          <Route
            path="/causes/:id"
            element={(
              <PrivateRoute>
                <CauseDetails />
              </PrivateRoute>
            )}
          />
          <Route
            path="/fundraise"
            element={(
              <PrivateRoute>
                <Fundraise />
              </PrivateRoute>
            )}
          />
          <Route
            path="/settings"
            element={(
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
