'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SpaceBackground } from '@/components/animate-ui/components/backgrounds/space';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import NotificationBell from '@/components/NotificationBell';

export default function Home() {
  const words = ['Projects', 'Ideas', 'Startups', 'Future'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchTab, setSearchTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const { user, loading, signInWithGoogle, logout, loginWithEmail, registerWithEmail } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      const name = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
      setCurrentUser(name);
    } else if (!loading) {
      setIsLoggedIn(false);
      setCurrentUser('');
    }
  }, [user, loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setOpacity(1);
      }, 250);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <SpaceBackground className="w-full h-full" />
      </div>
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between p-4 font-poppins">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-white hover:text-purple-400 text-xl">Dashboard</Link>
          <Link href="/projects" className="text-white hover:text-purple-400 text-xl">Projects</Link>
          <Link href="/livechat" className="text-white hover:text-purple-400 text-xl">Livechat</Link>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button onClick={() => setShowSearch(true)} className="text-white text-xl p-2 hover:text-purple-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
          ) : isLoggedIn ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl hover:bg-purple-500 transition-colors focus:outline-none uppercase"
                >
                  {currentUser ? currentUser.charAt(0) : 'U'}
                </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-3 bg-black bg-opacity-90 rounded-lg shadow-lg w-48 border border-gray-700 z-50 overflow-hidden">
                  <button className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-purple-600 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex items-center w-full px-4 py-3 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xl hover:bg-blue-600 transition-colors shadow-none border-none outline-none">Login</button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find The Perfect Crew<br />
          For Your{' '}
          <span className="text-cyan-400 inline-block w-40 text-center" style={{ opacity, transition: 'opacity 0.5s ease-in-out' }}>
            {words[currentWordIndex]}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Connect with like-minded individuals to bring your ideas to life.
        </p>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 shadow-none backdrop-blur-xl">
            <button onClick={() => { setShowLogin(false); setAuthError(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
            <h2 className="text-3xl mb-8 text-white font-bold text-center tracking-tight">Welcome Back</h2>
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input type="email" placeholder="Enter your email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <input type="password" placeholder="••••••••" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>
            {authError && <p className="text-red-400 text-sm mb-4 text-center bg-red-500/10 p-2 rounded border border-red-500/20">{authError}</p>}
            <button
              onClick={async () => {
                setAuthError('');
                try {
                  await loginWithEmail(emailInput, passwordInput);
                  setShowLogin(false);
                  setEmailInput('');
                  setPasswordInput('');
                } catch (error) {
                  const errorCode = error.code;
                  if (errorCode === 'auth/invalid-credential') {
                    setAuthError('Wrong email or password.');
                  } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
                    setAuthError('Wrong email address.');
                  } else if (errorCode === 'auth/wrong-password') {
                    setAuthError('Wrong password.');
                  } else {
                    setAuthError('Failed to login. Please try again.');
                  }
                }
              }}
              className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold mb-6 hover:bg-purple-700 transition-colors shadow-none"
            >
              Sign In
            </button>

            <div className="relative mb-6 flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="shrink-0 px-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  setShowLogin(false);
                } catch (e) {
                  console.error(e);
                }
              }}
              className="w-full bg-white/5 text-white border border-white/10 p-3 rounded-lg font-medium mb-6 hover:bg-white/10 flex items-center justify-center gap-3 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <p className="text-sm text-center text-gray-400">Don't have an account? <button onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-purple-400 hover:text-purple-300 font-medium">Sign up</button></p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 shadow-none backdrop-blur-xl">
            <button onClick={() => { setShowRegister(false); setAuthError(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
            <h2 className="text-3xl mb-8 text-white font-bold text-center tracking-tight">Create Account</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
              <input type="text" placeholder="Choose a username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input type="email" placeholder="Enter your email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <input type="password" placeholder="Create a password (min. 6 chars)" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full p-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>
            {authError && <p className="text-red-400 text-sm mb-4 text-center bg-red-500/10 p-2 rounded border border-red-500/20">{authError}</p>}
            <button
              onClick={async () => {
                setAuthError('');
                try {
                  const userCredential = await registerWithEmail(emailInput, passwordInput);
                  if (userCredential.user && usernameInput) {
                    await updateProfile(userCredential.user, { displayName: usernameInput });
                  }
                  setShowRegister(false);
                  setEmailInput('');
                  setPasswordInput('');
                  setUsernameInput('');
                } catch (error) {
                  setAuthError(error.message);
                }
              }}
              className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold mb-6 hover:bg-purple-700 transition-colors shadow-none"
            >
              Sign Up
            </button>

            <div className="relative mb-6 flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="shrink-0 px-4 text-gray-500 text-sm">Or sign up with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  setShowRegister(false);
                } catch (e) {
                  console.error(e);
                }
              }}
              className="w-full bg-white/5 text-white border border-white/10 p-3 rounded-lg font-medium mb-6 hover:bg-white/10 flex items-center justify-center gap-3 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <p className="text-sm text-center text-gray-400">Already have an account? <button onClick={() => { setShowRegister(false); setShowLogin(true); }} className="text-purple-400 hover:text-purple-300 font-medium">Log in</button></p>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 p-8 shadow-none backdrop-blur-xl flex flex-col justify-center">
            <button onClick={() => setShowLogoutConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
            <h2 className="text-3xl mb-4 text-white font-bold text-center tracking-tight">Sign Out</h2>
            <p className="text-base text-gray-300 text-center mb-8">Are you sure you want to end your session?</p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={async () => {
                  try {
                    await logout();
                  } catch (e) {
                    console.error("Logout failed", e);
                  }
                  setIsLoggedIn(false);
                  setShowLogoutConfirm(false);
                }}
                className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-none"
              >
                Yes, Sign out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-white/10 text-white p-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="relative z-10 w-full max-w-xl min-h-[500px] rounded-2xl border border-white/10 bg-black/40 p-8 shadow-none backdrop-blur-xl flex flex-col font-poppins">
            <button onClick={() => setShowSearch(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
            <h2 className="text-3xl mb-8 text-white text-center font-bold tracking-tight">Search</h2>

            {/* Tabs */}
            <div className="flex w-full mb-8 border-b border-white/10">
              <button
                onClick={() => setSearchTab('projects')}
                className={`flex-1 py-3 text-lg font-medium transition-colors border-b-2 ${searchTab === 'projects' ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                Find Projects
              </button>
              <button
                onClick={() => setSearchTab('friends')}
                className={`flex-1 py-3 text-lg font-medium transition-colors border-b-2 ${searchTab === 'friends' ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                Find Friends
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchTab === 'projects' ? "Search for projects..." : "Search for users..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 pl-12 rounded-xl border border-white/10 bg-white/5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500"
                />
                <svg className="w-6 h-6 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Results Placeholder */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center border border-white/10 rounded-xl bg-white/[0.02]">
              <p className="text-gray-500 text-center px-4 font-medium">
                {searchQuery
                  ? `Searching for ${searchTab === 'projects' ? 'projects' : 'friends'} matching "${searchQuery}"...`
                  : `Start typing to search ${searchTab === 'projects' ? 'projects' : 'friends'}...`
                }
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
