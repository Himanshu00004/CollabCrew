'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white font-poppins flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 flex-none border-b border-gray-800">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-white hover:text-purple-400 text-xl font-semibold border-b-2 border-purple-500 pb-1">Dashboard</Link>
          <Link href="/projects" className="text-white hover:text-purple-400 text-xl">Projects</Link>
          <Link href="/livechat" className="text-white hover:text-purple-400 text-xl">Livechat</Link>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button onClick={() => setShowSearch(true)} className="text-white text-xl p-2 hover:text-purple-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Main Dashboard Content */}
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Sidebar (40%) - User Profile */}
        <div className="w-2/5 md:w-[40%] bg-black/40 border-r border-white/10 p-8 flex flex-col items-center overflow-y-auto">
          {/* Profile Picture & Info */}
          <div className="flex flex-col items-center mt-8 mb-10 w-full">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-6xl font-bold uppercase shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-6 border-4 border-black/50">
              {currentUser ? currentUser.charAt(0) : 'U'}
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-wide">{currentUser || 'User Profile'}</h2>
            <p className="text-gray-400 text-lg">Full Stack Developer</p>
          </div>

          {/* User Details Box */}
          <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-purple-300 border-b border-white/10 pb-2">Work Period</h3>
            <div className="flex items-center text-gray-300 gap-3 mb-2 text-lg">
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Member since Sept 2024</span>
            </div>
            <div className="flex items-center text-gray-300 gap-3 text-lg">
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>Available 20 hrs/week</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-5 text-purple-300 border-b border-white/10 pb-2 flex justify-between items-center">
              Top Skills
              <button className="text-sm text-gray-400 hover:text-white transition-colors">Edit</button>
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-purple-900/50 text-purple-200 px-4 py-2 rounded-full text-base font-medium border border-purple-500/30">React.js</span>
              <span className="bg-blue-900/50 text-blue-200 px-4 py-2 rounded-full text-base font-medium border border-blue-500/30">Node.js</span>
              <span className="bg-gray-800 text-gray-200 px-4 py-2 rounded-full text-base font-medium border border-gray-600">TypeScript</span>
              <span className="bg-cyan-900/50 text-cyan-200 px-4 py-2 rounded-full text-base font-medium border border-cyan-500/30">Tailwind CSS</span>
              <span className="bg-green-900/50 text-green-200 px-4 py-2 rounded-full text-base font-medium border border-green-500/30">MongoDB</span>
              <button className="bg-white/5 text-gray-400 px-4 py-2 rounded-full text-base font-medium border border-white/10 border-dashed hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                + Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane (60%) - User Projects */}
        <div className="w-3/5 md:w-[60%] p-10 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">My Projects</h2>
            <Link href="/projects" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Project
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
            {/* Project Card 1 */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group flex flex-col h-full hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -z-10 group-hover:bg-blue-500/20 transition-all"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">E-Commerce API</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/20">Active</span>
              </div>
              
              <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                A highly scalable backend architecture for an upcoming e-commerce platform using microservices.
              </p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-5 border-t border-white/10 pt-4">
                  <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded text-gray-300">Node.js</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded text-gray-300">Express</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded text-gray-300">PostgreSQL</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-black flex items-center justify-center text-xs font-bold text-white z-20">A</div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-black flex items-center justify-center text-xs font-bold text-white z-10 uppercase">{currentUser ? currentUser.charAt(0) : 'U'}</div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs font-bold text-gray-300 z-0">+2</div>
                  </div>
                  <span>Updated 2 days ago</span>
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group flex flex-col h-full hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -z-10 group-hover:bg-purple-500/20 transition-all"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">Task Management App</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/20">Planning</span>
              </div>
              
              <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                A collaborative task board with real-time updates using WebSockets and a clean drag-and-drop UI.
              </p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-5 border-t border-white/10 pt-4">
                  <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded text-gray-300">React</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded text-gray-300">Tailwind</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-white/5 rounded text-gray-300">Socket.io</span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-black flex items-center justify-center text-xs font-bold text-white z-20 uppercase">{currentUser ? currentUser.charAt(0) : 'U'}</div>
                  </div>
                  <span>Created 1 week ago</span>
                </div>
              </div>
            </div>

            {/* Empty State / Add Project card */}
            <Link href="/projects" className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-white/10 transition-all min-h-[250px] group">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Join a New Project</h3>
              <p className="text-sm text-center max-w-xs">Discover more projects to collaborate on from the community.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg">
            <button onClick={() => setShowLogin(false)} className="absolute top-2 right-2 text-gray-500 text-2xl">&times;</button>
            <h2 className="text-4xl mb-6 text-black text-center">Login</h2>
            <div className="mb-4">
              <label className="block text-lg mb-1 text-black">Email:</label>
              <input type="email" placeholder="Enter Email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full p-3 border text-black text-lg" />
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
  );
}
