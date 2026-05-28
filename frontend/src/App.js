// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import FindLabour   from './pages/FindLabour';
import WorkerDetail from './pages/WorkerDetail';
import Register     from './pages/Register';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import About        from './pages/About';
import Pricing      from './pages/Pricing';
import PostJob      from './pages/PostJob';
import Payment      from './pages/Payment';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontSize:'1.1rem', color:'#7A6652', fontFamily:"'Sora',sans-serif" }}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/find"       element={<FindLabour />} />
        <Route path="/worker/:id" element={<WorkerDetail />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/about"      element={<About />} />
        <Route path="/pricing"    element={<Pricing />} />
        <Route path="/pay"        element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/post-job"   element={<PrivateRoute><PostJob /></PrivateRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
