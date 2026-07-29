import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, User, LogOut, LayoutDashboard, KeyRound, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#111827]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Branding */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                MOTOR<span className="text-blue-500 font-extrabold">MATRIX</span>
              </span>
              <span className="text-[10px] text-gray-400 block -mt-1 font-mono uppercase tracking-widest">
                Dealership Inventory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Catalog Dashboard</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30'
                    : 'text-purple-300/80 hover:text-purple-300 hover:bg-purple-950/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Management</span>
              </Link>
            )}
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800/80 border border-gray-700/60 px-3 py-1.5 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-white block leading-none">
                      {user?.name}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${user?.role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-gray-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
          >
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span>Catalog Dashboard</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-purple-300 hover:bg-purple-900/30"
            >
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="pt-2 border-t border-gray-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-gray-400">
                  Signed in as <span className="text-white font-semibold">{user?.email}</span> ({user?.role})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 text-left font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
