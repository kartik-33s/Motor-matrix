import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Temporary placeholder components for Milestone 6 until Milestones 7 & 8 assemble full views
const DashboardPlaceholder = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-400">
    <h2 className="text-2xl font-bold text-white mb-2">Catalog Dashboard</h2>
    <p>Dashboard UI & inventory search filter bar being assembled in Milestone 7...</p>
  </div>
);

const AdminPanelPlaceholder = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-400">
    <h2 className="text-2xl font-bold text-purple-400 mb-2">Admin Management Panel</h2>
    <p>Admin management table & restock controls being assembled in Milestone 8...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPlaceholder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanelPlaceholder />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
