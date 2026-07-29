import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, User, ShieldCheck, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { hasSqlInjectionPattern } from '../utils/sqlSanitizer';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error: serverError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (hasSqlInjectionPattern(name)) {
      newErrors.name = 'Invalid characters or potential SQL injection detected';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (hasSqlInjectionPattern(confirmPassword)) {
      newErrors.confirmPassword = 'Invalid characters or potential SQL injection detected';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
    if (errors.confirmPassword && confirmPassword && e.target.value === confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
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
              CREATE ACCOUNT
            </h1>
            <p className="text-[12px] text-[#7e7e7e] font-light text-center uppercase tracking-[1.5px]">
              JOIN MOTOR MATRIX PLATFORM
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 bg-[#e22718] border border-[#e22718] text-white text-[12px] font-bold uppercase tracking-[1.5px] flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                FULL NAME
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-[#7e7e7e] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="ALEX MORGAN"
                  className={`w-full bg-[#0d0d0d] border pl-12 pr-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all font-light uppercase ${
                    errors.name
                      ? 'border-[#e22718] focus:border-[#e22718]'
                      : 'border-[#3c3c3c] focus:border-[#ffffff]'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[12px] text-[#e22718] font-bold uppercase tracking-[1.5px] mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

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
                  placeholder="alex@example.com"
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
                  placeholder="MINIMUM 6 CHARACTERS"
                  className={`w-full bg-[#0d0d0d] border pl-12 pr-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all font-light uppercase ${
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

            <div>
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#7e7e7e] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="RE-ENTER PASSWORD"
                  className={`w-full bg-[#0d0d0d] border pl-12 pr-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all font-light uppercase ${
                    errors.confirmPassword
                      ? 'border-[#e22718] focus:border-[#e22718]'
                      : 'border-[#3c3c3c] focus:border-[#ffffff]'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[12px] text-[#e22718] font-bold uppercase tracking-[1.5px] mt-2 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Account Role Selection */}
            <div>
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-3">
                ACCOUNT ROLE
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex items-center justify-center space-x-2 py-3 px-3 border text-[12px] font-bold uppercase tracking-[1.5px] transition-all ${
                    role === 'user'
                      ? 'bg-[#000000] border-[#ffffff] text-white'
                      : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e] hover:text-white hover:border-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>USER</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center space-x-2 py-3 px-3 border text-[12px] font-bold uppercase tracking-[1.5px] transition-all ${
                    role === 'admin'
                      ? 'bg-[#1c69d4] border-[#1c69d4] text-white'
                      : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e] hover:text-[#1c69d4] hover:border-[#1c69d4]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ADMIN</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-[#000000] border border-[#ffffff] text-white font-bold py-4 px-6 text-[14px] uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>REGISTER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#3c3c3c] text-center">
            <p className="text-[12px] text-[#7e7e7e] font-light">
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link to="/login" className="text-white font-bold hover:text-[#1c69d4] transition-colors uppercase tracking-[1.5px]">
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
