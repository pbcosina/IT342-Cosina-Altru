import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { authApi, usersApi } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      usersApi.me()
        .then(response => {
          setUser(response);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const newToken = response.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);

      const userResponse = await usersApi.me();
      setUser(userResponse);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authApi.register(name, email, password);
      const newToken = response.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      const userResponse = await usersApi.me();
      setUser(userResponse);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const contextValue = useMemo(
    () => ({ user, token, login, register, logout, loading }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);