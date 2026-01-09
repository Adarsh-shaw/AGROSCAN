
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock "Database" in localStorage to simulate real account registration
  const getUsersFromDB = (): any[] => {
    const users = localStorage.getItem('agrosan_mock_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUserToDB = (user: any) => {
    const users = getUsersFromDB();
    users.push(user);
    localStorage.setItem('agrosan_mock_users', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate database delay
    setTimeout(() => {
      const db = getUsersFromDB();
      const lowerEmail = email.toLowerCase().trim();
      
      if (isLogin) {
        // STRICT LOGIN: User must exist in mock DB
        const user = db.find(u => u.email.toLowerCase() === lowerEmail);
        if (user && user.password === password) {
          const authenticatedUser: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          onLogin(authenticatedUser);
        } else {
          setError("Account not found or password incorrect. Please sign up if you're new.");
          setLoading(false);
        }
      } else {
        // REGISTRATION: Check for duplicates
        const exists = db.find(u => u.email.toLowerCase() === lowerEmail);
        if (exists) {
          setError("This email is already registered. Please sign in instead.");
          setLoading(false);
        } else {
          const newUser = {
            uid: 'user_' + Math.random().toString(36).substr(2, 9),
            email: email,
            password: password,
            displayName: email.split('@')[0],
            photoURL: 'standard'
          };
          saveUserToDB(newUser);
          onLogin({
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            photoURL: newUser.photoURL
          });
        }
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
    
    // Simulate Google Sign-in Auth Flow
    setTimeout(() => {
      const googleEmail = "google_user@gmail.com";
      const db = getUsersFromDB();
      let user = db.find(u => u.email === googleEmail);
      
      if (!user) {
        user = {
          uid: 'google_id_9921',
          email: googleEmail,
          displayName: "Verified Google User",
          photoURL: "google",
          password: "mock_google_password"
        };
        saveUserToDB(user);
      }
      
      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 overflow-hidden animate-in slide-up duration-500">
        <div className="bg-emerald-600 p-10 text-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 group">
            <i className="fas fa-leaf text-emerald-600 text-2xl group-hover:scale-110 transition"></i>
          </div>
          <h2 className="text-2xl font-black">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-emerald-100 text-sm opacity-80 mt-1">Professional Agronomic Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-xs text-rose-600 font-bold flex items-center animate-in fade-in">
              <i className="fas fa-circle-exclamation mr-2 text-sm"></i>
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 tracking-wider">Email Address</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
              <input
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition outline-none text-gray-700 font-medium"
                placeholder="agronomist@farm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 tracking-wider">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
              <input
                type="password"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition outline-none text-gray-700 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                <i className="fas fa-arrow-right text-sm"></i>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm font-bold text-emerald-600 hover:underline"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-300 tracking-widest"><span className="bg-white px-3 italic">Verified Auth</span></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-100 py-3.5 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center space-x-3 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
