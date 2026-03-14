'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SpaceBackground } from '@/components/animate-ui/components/backgrounds/space';

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
  const [showSearch, setShowSearch] = useState(false);
  const [searchTab, setSearchTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Retrieve login state from localStorage on load
    const loggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('currentUser');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      if (user) setCurrentUser(user);
    }

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
          {isLoggedIn ? (
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
          ) : (
            <button onClick={() => setShowLogin(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xl hover:bg-blue-600 transition-colors">Login</button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find The Perfect Crew<br />
          For Your{' '}
          <span className="text-purple-400 inline-block w-40 text-center" style={{ opacity, transition: 'opacity 0.5s ease-in-out' }}>
            {words[currentWordIndex]}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Connect with like-minded individuals to bring your ideas to life.
        </p>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg">
            <button onClick={() => setShowLogin(false)} className="absolute top-2 right-2 text-gray-500 text-2xl">&times;</button>
            <h2 className="text-4xl mb-6 text-black text-center">Login</h2>
            <div className="mb-4">
              <label className="block text-lg mb-1 text-black">Email:</label>
              <input type="email" placeholder="Enter Email" className="w-full p-3 border text-black text-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-lg mb-1 text-black">Password:</label>
              <input type="password" placeholder="Enter Password" className="w-full p-3 border text-black text-lg" />
            </div>
            <button
              onClick={() => {
                const user = emailInput ? emailInput.split('@')[0] : 'User';
                setIsLoggedIn(true);
                setCurrentUser(user);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', user);
                setShowLogin(false);
              }}
              className="w-full bg-blue-500 text-white p-3 rounded text-lg mb-4 hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            <p className="text-base text-center text-gray-600">Don't have account? <a href="#" onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-blue-500">Register now</a></p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg">
            <button onClick={() => setShowRegister(false)} className="absolute top-2 right-2 text-gray-500 text-2xl">&times;</button>
            <h2 className="text-4xl mb-6 text-black text-center">Register</h2>
            <div className="mb-4">
              <label className="block text-lg mb-1 text-black">Username:</label>
              <input type="text" placeholder="Enter Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full p-3 border text-black text-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-1 text-black">Email:</label>
              <input type="email" placeholder="Enter Email" className="w-full p-3 border text-black text-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-lg mb-1 text-black">Password:</label>
              <input type="password" placeholder="Enter Password" className="w-full p-3 border text-black text-lg" />
            </div>
            <button
              onClick={() => {
                const user = usernameInput || 'User';
                setIsLoggedIn(true);
                setCurrentUser(user);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', user);
                setShowRegister(false);
              }}
              className="w-full bg-blue-500 text-white p-3 rounded text-lg mb-4 hover:bg-blue-600 transition-colors"
            >
              Register
            </button>
            <p className="text-base text-center text-gray-600">Already have account? <a href="#" onClick={() => { setShowRegister(false); setShowLogin(true); }} className="text-blue-500">Login now</a></p>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg flex flex-col justify-center">
            <button onClick={() => setShowLogoutConfirm(false)} className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-800 transition-colors">&times;</button>
            <h2 className="text-4xl mb-6 text-black text-center">Logout</h2>
            <p className="text-xl text-black text-center mb-8">Are you sure you want to logout?</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  localStorage.removeItem('isLoggedIn');
                  localStorage.removeItem('currentUser');
                  setShowLogoutConfirm(false);
                }}
                className="w-full bg-blue-500 text-white p-3 rounded text-lg hover:bg-blue-600 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-gray-500 text-white p-3 rounded text-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg w-full max-w-xl min-h-[500px] relative shadow-black shadow-lg flex flex-col font-poppins">
            <button onClick={() => setShowSearch(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl transition-colors">&times;</button>
            <h2 className="text-3xl mb-6 text-black text-center font-bold">Search</h2>

            {/* Tabs */}
            <div className="flex w-full mb-6 border-b border-gray-300">
              <button
                onClick={() => setSearchTab('projects')}
                className={`flex-1 py-3 text-lg font-semibold transition-colors border-b-2 ${searchTab === 'projects' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Find Projects
              </button>
              <button
                onClick={() => setSearchTab('friends')}
                className={`flex-1 py-3 text-lg font-semibold transition-colors border-b-2 ${searchTab === 'friends' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Find Friends
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchTab === 'projects' ? "Search for projects..." : "Search for users..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 pl-12 border text-black text-lg rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50"
                />
                <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Results Placeholder */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 text-center px-4">
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
