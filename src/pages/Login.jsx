import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@dealership.com');
    setPassword('admin123');
  };

  const fillDemoUser = () => {
    setEmail('user@dealership.com');
    setPassword('user123');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to access your Motor Matrix portal</p>
        </div>

        {/* Quick Demo Credentials Fill Buttons */}
        <div className="mb-6 bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Quick Demo Login</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono">1-CLICK</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 rounded-lg text-xs font-medium text-purple-300 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Manager</span>
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 rounded-lg text-xs font-medium text-blue-300 transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dealership.com"
                className="w-full bg-gray-900/90 border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900/90 border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-gray-800/80 pt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
