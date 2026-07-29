import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { hasSqlInjectionPattern } from '../utils/sqlSanitizer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: serverError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (hasSqlInjectionPattern(email)) {
      newErrors.email = 'Invalid characters or potential SQL injection detected';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (hasSqlInjectionPattern(password)) {
      newErrors.password = 'Invalid characters or potential SQL injection detected';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
    setErrors({});
  };

  const fillDemoUser = () => {
    setEmail('user@dealership.com');
    setPassword('user123');
    setErrors({});
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          alt="Vehicle"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
      </div>

      <div className="w-full max-w-md bg-[#1a1a1a] relative z-10">
        {/* M Stripe */}
        <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>

        <div className="p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#1c69d4] flex items-center justify-center mx-auto mb-6">
              <Car className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-[32px] font-bold text-white uppercase text-center leading-none mb-2">
              WELCOME BACK
            </h1>
            <p className="text-[12px] text-[#7e7e7e] font-light text-center uppercase tracking-[1.5px]">
              SIGN IN TO ACCESS YOUR ACCOUNT
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="mb-8 bg-[#0d0d0d] border border-[#3c3c3c] p-4">
            <div className="text-[10px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-3">
              DEMO CREDENTIALS
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="flex items-center justify-center space-x-2 py-3 px-3 bg-[#1a1a1a] border border-[#3c3c3c] hover:border-[#1c69d4] text-[12px] font-bold text-[#1c69d4] uppercase tracking-[1.5px] transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ADMIN</span>
              </button>
              <button
                type="button"
                onClick={fillDemoUser}
                className="flex items-center justify-center space-x-2 py-3 px-3 bg-[#1a1a1a] border border-[#3c3c3c] hover:border-white text-[12px] font-bold text-white uppercase tracking-[1.5px] transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>USER</span>
              </button>
            </div>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 bg-[#e22718] border border-[#e22718] text-white text-[12px] font-bold uppercase tracking-[1.5px] flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-[#7e7e7e] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="admin@dealership.com"
                  className={`w-full bg-[#0d0d0d] border pl-12 pr-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all font-light ${
                    errors.email
                      ? 'border-[#e22718] focus:border-[#e22718]'
                      : 'border-[#3c3c3c] focus:border-[#ffffff]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-[#e22718] font-bold uppercase tracking-[1.5px] mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#7e7e7e] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full bg-[#0d0d0d] border pl-12 pr-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all font-light ${
                    errors.password
                      ? 'border-[#e22718] focus:border-[#e22718]'
                      : 'border-[#3c3c3c] focus:border-[#ffffff]'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[12px] text-[#e22718] font-bold uppercase tracking-[1.5px] mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-[#000000] border border-[#ffffff] text-white font-bold py-4 px-6 text-[14px] uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#3c3c3c] text-center">
            <p className="text-[12px] text-[#7e7e7e] font-light">
              DON'T HAVE AN ACCOUNT?{' '}
              <Link to="/register" className="text-white font-bold hover:text-[#1c69d4] transition-colors uppercase tracking-[1.5px]">
                CREATE ACCOUNT
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
