'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Projects() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  
  const [showCreateProject, setShowCreateProject] = useState(false);
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

  const skills = [
    "Java", "Python", "C", "C++", "Tailwind CSS", "JavaScript", 
    "TypeScript", "React.js", "Node.js", "Next.js", "Express", 
    "MongoDB", "PostgreSQL", "Firebase"
  ];
  
  const [selectedSkills, setSelectedSkills] = useState([]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white font-poppins">
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
          {isLoggedIn && (
            <button 
              onClick={() => setShowCreateProject(true)} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-lg hover:bg-purple-500 transition-colors flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Project
            </button>
          )}
          
          {/* Search */}
          <button onClick={() => setShowSearch(true)} className="text-white text-xl p-2 hover:text-purple-400 transition-colors z-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {isLoggedIn ? (
            <div className="relative z-40">
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

      <main className="flex flex-col items-center justify-start pt-16 min-h-[80vh] px-4 font-poppins text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Projects</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12">
          Explore innovative projects, join brilliant teams, or launch your own disruptive ideas.
        </p>
        
        {/* Placeholder for projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all text-left">
            <h3 className="text-2xl font-bold mb-2">AI Content Generator</h3>
            <p className="text-gray-300 mb-4 h-20 overflow-hidden">Building a next-gen tool that helps creators generate posts, blogs and scripts using OpenAI.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">Next.js</span>
              <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm">Python</span>
            </div>
          </div>
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all text-left">
            <h3 className="text-2xl font-bold mb-2">Crypto Portfolio Tracker</h3>
            <p className="text-gray-300 mb-4 h-20 overflow-hidden">An open-source dashboard to track multi-chain crypto assets securely in one place.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">React.js</span>
              <span className="bg-green-600 px-3 py-1 rounded-full text-sm">Node.js</span>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg">
            <button onClick={() => setShowLogin(false)} className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-800">&times;</button>
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
            <p className="text-base text-center text-gray-600">Don't have account? <button onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-blue-500 hover:underline">Register now</button></p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg">
            <button onClick={() => setShowRegister(false)} className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-800">&times;</button>
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
            <p className="text-base text-center text-gray-600">Already have account? <button onClick={() => { setShowRegister(false); setShowLogin(true); }} className="text-blue-500 hover:underline">Login now</button></p>
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

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black p-8 rounded-xl w-[32rem] max-h-[90vh] overflow-y-auto relative shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-500/30 font-poppins text-white">
            <button onClick={() => setShowCreateProject(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-light">&times;</button>
            <h2 className="text-3xl mb-8 font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Create Project</h2>
            
            <div className="mb-5">
              <label className="block text-lg mb-2 text-gray-200">Project title</label>
              <input type="text" placeholder="Enter project title" className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:border-purple-500 focus:outline-none text-white text-lg transition-colors" />
            </div>
            
            <div className="mb-5">
              <label className="block text-lg mb-2 text-gray-200">Project Description</label>
              <textarea placeholder="Describe your project" rows="4" className="w-full p-3 bg-gray-900 border border-gray-700 rounded focus:border-purple-500 focus:outline-none text-white text-lg transition-colors resize-none"></textarea>
            </div>
            
            <div className="mb-8">
              <label className="block text-lg mb-3 text-gray-200">Skills required</label>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedSkills.includes(skill) 
                        ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)] border border-purple-400' 
                        : 'bg-gray-800 text-gray-300 border border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={() => setShowCreateProject(false)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg text-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg active:scale-[0.98]">
              Create Project
            </button>
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
                  className="w-full p-4 pl-12 border text-black text-lg rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-gray-50 text-black" 
                />
                <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Results Placeholder */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 shadow-inner">
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
