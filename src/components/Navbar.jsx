import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, User, LogOut, LayoutDashboard, KeyRound, Menu, X, Package } from 'lucide-react';

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
    <nav className="bg-[#000000] border-b border-[#3c3c3c] sticky top-0 z-50">
      {/* M Stripe */}
      <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Branding */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[#1a1a1a] border border-[#3c3c3c] flex items-center justify-center group-hover:border-[#ffffff] transition-colors">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">
                MOTOR<span className="text-[#1c69d4]">MATRIX</span>
              </span>
              <span className="text-[10px] text-[#7e7e7e] block -mt-1 font-normal uppercase tracking-[1.5px]">
                PERFORMANCE INVENTORY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 text-[14px] font-normal uppercase tracking-[0.5px] transition-colors ${
                isActive('/dashboard')
                  ? 'text-white'
                  : 'text-[#bbbbbb] hover:text-white'
              }`}
            >
              VEHICLES
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                className={`px-4 py-2 text-[14px] font-normal uppercase tracking-[0.5px] transition-colors ${
                  isActive('/orders')
                    ? 'text-white'
                    : 'text-[#bbbbbb] hover:text-white'
                }`}
              >
                MY ORDERS
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-4 py-2 text-[14px] font-normal uppercase tracking-[0.5px] transition-colors ${
                  isActive('/admin')
                    ? 'text-[#1c69d4]'
                    : 'text-[#bbbbbb] hover:text-[#1c69d4]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ADMIN</span>
              </Link>
            )}
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-[#1a1a1a] border border-[#3c3c3c] px-4 py-2">
                  <div className="w-8 h-8 bg-[#1c69d4] flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-white block leading-none uppercase tracking-wider">
                      {user?.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#7e7e7e]">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#000000] border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-3 text-[14px] font-bold text-[#bbbbbb] hover:text-white uppercase tracking-[1.5px] transition-colors"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-[#000000] border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#bbbbbb] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#000000] border-t border-[#3c3c3c] px-6 pt-4 pb-6 space-y-3">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 text-[14px] font-bold text-white uppercase tracking-[1.5px] bg-[#1a1a1a]"
          >
            VEHICLES
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-[14px] font-bold text-white uppercase tracking-[1.5px] bg-[#1a1a1a]"
            >
              MY ORDERS
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-3 text-[14px] font-bold text-[#1c69d4] uppercase tracking-[1.5px] bg-[#1a1a1a]"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>ADMIN PANEL</span>
            </Link>
          )}

          <div className="pt-4 border-t border-[#3c3c3c]">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-4 py-2 text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px]">
                  SIGNED IN AS <span className="text-white font-bold">{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 text-[14px] font-bold text-white uppercase tracking-[1.5px] bg-[#1a1a1a]"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px]"
                >
                  REGISTER
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
