import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext';
import PrivateRoute from './core/components/privateRoute';
import Landing from './features/auth/pages/landing';
import Login from './features/auth/pages/login';
import Register from './features/auth/pages/register';
import Dashboard from './features/dashboard/pages/dashboard';
import Causes from './features/campaigns/pages/causes';
import CauseDetails from './features/campaigns/pages/causeDetails';
import Fundraise from './features/campaigns/pages/fundraise';
import Settings from './features/settings/pages/settings';
import History from './features/settings/pages/history';
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
            path="/campaigns"
            element={(
              <PrivateRoute>
                <Causes />
              </PrivateRoute>
            )}
          />
          <Route
            path="/campaigns/:id"
            element={(
              <PrivateRoute>
                <CauseDetails />
              </PrivateRoute>
            )}
          />
          <Route path="/causes" element={<Navigate to="/campaigns" replace />} />
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
          <Route
            path="/history"
            element={(
              <PrivateRoute>
                <History />
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
