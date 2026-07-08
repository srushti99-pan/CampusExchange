import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseProducts from './pages/BrowseProducts';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard';
import ProductForm from './pages/ProductForm';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper for Students
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Protected Route Wrapper for Administrators
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
};

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <ThemeProvider theme={getTheme(darkMode ? 'dark' : 'light')}>
      <CssBaseline />
      <BrowserRouter>
        <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<BrowseProducts />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Student Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <PrivateRoute>
                  <ProductForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <PrivateRoute>
                  <ProductForm />
                </PrivateRoute>
              }
            />

            {/* Admin-only Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
