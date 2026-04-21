import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, register, getSecurityQuestion, resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot_username', 'forgot_answer'
  
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    securityQuestion: 'What is your favorite childhood pet?',
    securityAnswer: '',
    newPassword: ''
  });
  
  const [fetchedQuestion, setFetchedQuestion] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData.id, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(formData.id, formData.password, formData.securityQuestion, formData.securityAnswer);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const handleForgotUsernameSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const q = await getSecurityQuestion(formData.id);
      setFetchedQuestion(q);
      setView('forgot_answer');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const handleForgotAnswerSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await resetPassword(formData.id, formData.securityAnswer, formData.newPassword);
      setView('login');
      setFormData({ ...formData, password: '', securityAnswer: '', newPassword: '' });
      setError('Password reset successfully! Please login with your new password.');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const renderIcon = () => (
    <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
      <Shield size={32} className="text-white" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        {view === 'login' && (
          <>
            <div className="text-center mb-8">
              {renderIcon()}
              <h1 className="text-3xl font-bold">Family Vault</h1>
              <p className="text-slate-400 mt-2">Sign in to your secure storage</p>
            </div>

            {error && <div className="mb-4 text-red-400 text-sm font-medium text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Family ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    name="id"
                    required
                    value={formData.id}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Daksh215"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <button type="button" onClick={() => { setView('forgot_username'); setError(''); }} className="text-xs text-indigo-400 hover:text-indigo-300">Forgot Password?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-500" />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/25 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <button onClick={() => { setView('register'); setError(''); }} className="text-indigo-400 font-medium hover:text-indigo-300">Register</button>
            </div>
          </>
        )}

        {view === 'register' && (
          <>
            <div className="text-center mb-8">
              {renderIcon()}
              <h1 className="text-3xl font-bold">Register Family</h1>
              <p className="text-slate-400 mt-2">Create a family vault with a unique ID and admin password</p>
            </div>

            {error && <div className="mb-4 text-red-400 text-sm font-medium text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Choose a Family ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-slate-500" /></div>
                  <input type="text" name="id" required value={formData.id} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Daksh215" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Create Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-slate-500" /></div>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. 123" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Recovery Security Question</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HelpCircle size={18} className="text-slate-500" /></div>
                  <select name="securityQuestion" value={formData.securityQuestion} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                    <option>What changed your life?</option>
                    <option>What is your favorite childhood pet?</option>
                    <option>In what city were you born?</option>
                    <option>What is your mother's maiden name?</option>
                    <option>What was the name of your first school?</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Security Answer</label>
                <input type="text" name="securityAnswer" required value={formData.securityAnswer} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Answer used for recovery" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25 mt-2 disabled:opacity-70 disabled:hover:translate-y-0">
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have a Family ID?{' '}
              <button onClick={() => { setView('login'); setError(''); }} className="text-indigo-400 font-medium hover:text-indigo-300">Sign In</button>
            </div>
          </>
        )}

        {view === 'forgot_username' && (
          <>
            <button onClick={() => { setView('login'); setError(''); }} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </button>
            
            <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
            <p className="text-slate-400 mb-6 font-medium text-sm">Enter your Family ID to retrieve your security question.</p>

            {error && <div className="mb-4 text-red-400 text-sm font-medium text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

            <form onSubmit={handleForgotUsernameSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Family ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-slate-500" /></div>
                  <input type="text" name="id" required value={formData.id} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Daksh215" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-70">
                {isLoading ? 'Searching...' : 'Continue'}
              </button>
            </form>
          </>
        )}

        {view === 'forgot_answer' && (
          <>
            <button onClick={() => { setView('forgot_username'); setError(''); }} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            
            <h2 className="text-2xl font-bold mb-2">Security Question</h2>
            <p className="text-slate-400 mb-6 font-medium text-sm">Answer your security question to reset your password.</p>

            {error && <div className="mb-4 text-red-400 text-sm font-medium text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

            <form onSubmit={handleForgotAnswerSubmit} className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 mb-4">
                <p className="text-sm text-slate-300 font-medium">Question for {formData.id}:</p>
                <p className="text-lg text-white font-semibold mt-1">{fetchedQuestion}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Your Answer</label>
                <input type="text" name="securityAnswer" required value={formData.securityAnswer} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Enter answer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-slate-500" /></div>
                  <input type="password" name="newPassword" required value={formData.newPassword} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Enter new password" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 shadow-lg shadow-emerald-500/25 mt-2 disabled:opacity-70">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
