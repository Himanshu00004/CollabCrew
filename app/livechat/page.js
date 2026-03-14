'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Livechat() {
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
  
  // Chat state
  const [activeProject, setActiveProject] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  
  const joinedProjects = [
    { id: 1, name: 'E-Commerce API', lastMessage: 'Let\'s finalize the schema tomorrow.', time: '10:42 AM', unread: 2, iconBg: 'bg-blue-600' },
    { id: 2, name: 'Task Management App', lastMessage: 'I pushed the new React components.', time: 'Yesterday', unread: 0, iconBg: 'bg-purple-600' },
    { id: 3, name: 'CollabCrew Platform', lastMessage: 'Welcome to the team everyone!', time: 'Monday', unread: 5, iconBg: 'bg-green-600' },
  ];
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alex M.', role: 'Dev', avatar: 'A', isMe: false, text: 'Hey team, I\'ve almost finished the user authentication endpoints.', time: '10:30 AM' },
    { id: 2, sender: 'Sarah J.', role: 'DBA', avatar: 'S', isMe: false, text: 'Great. Have you updated the Swagger documentation?', time: '10:35 AM' },
    { id: 3, sender: 'Alex M.', role: 'Dev', avatar: 'A', isMe: false, text: 'Not yet, I will do that this afternoon.', time: '10:38 AM' },
    { id: 4, sender: 'You', role: 'Full Stack', avatar: 'U', isMe: true, text: 'Sounds good. Let\'s finalize the schema tomorrow so I can start on the frontend integration.', time: '10:42 AM' },
  ]);

  useEffect(() => {
    // Retrieve login state from localStorage on load
    const loggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('currentUser');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      if (user) setCurrentUser(user);
    } else {
      // Force user to login for chat page if feeling strict, 
      // but matching previous behavior for now
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      role: 'Full Stack',
      avatar: currentUser ? currentUser.charAt(0).toUpperCase() : 'U',
      isMe: true,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setMessageInput('');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white font-poppins flex flex-col overflow-hidden">
      {/* Navbar - Fixed height */}
      <nav className="flex items-center justify-between p-4 flex-none border-b border-gray-800 bg-black/40 z-10 backdrop-blur-sm">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-white hover:text-purple-400 text-xl">Dashboard</Link>
          <Link href="/projects" className="text-white hover:text-purple-400 text-xl">Projects</Link>
          <Link href="/livechat" className="text-white hover:text-purple-400 text-xl font-semibold border-b-2 border-purple-500 pb-1">Livechat</Link>
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

      {/* Main Chat Interface */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (30%) - Projects List */}
        <div className="w-[30%] bg-black/50 border-r border-white/10 flex flex-col h-full">
          <div className="p-5 border-b border-white/10 flex-none">
            <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all text-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full">
            {joinedProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-4 ${activeProject === project.id ? 'bg-purple-900/40 border-l-4 border-l-purple-500' : 'border-l-4 border-l-transparent'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl font-bold shadow-lg ${project.iconBg}`}>
                  {project.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-white font-semibold truncate pr-2 text-sm">{project.name}</h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">{project.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate pr-2 ${project.unread && activeProject !== project.id ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {project.lastMessage}
                    </p>
                    {project.unread > 0 && activeProject !== project.id && (
                      <span className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {project.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane (70%) - Chat Area */}
        <div className="w-[70%] flex flex-col h-full bg-black/20">
          
          {/* Chat Header */}
          <div className="h-20 px-6 border-b border-white/10 flex items-center justify-between flex-none bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg bg-blue-600`}>
                {joinedProjects.find(p => p.id === activeProject)?.name.charAt(0) || 'E'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{joinedProjects.find(p => p.id === activeProject)?.name || 'E-Commerce API'}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-gray-400">4 members online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center text-xs text-gray-500 my-4 border-b border-white/10 pb-4 mx-10">
              Today
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm mt-auto ${msg.isMe ? 'bg-purple-600' : 'bg-gray-700'}`}>
                    {msg.avatar}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    {/* Sender Name & Info */}
                    {!msg.isMe && (
                      <div className="flex items-baseline gap-2 mb-1 ml-1">
                        <span className="text-sm font-semibold text-gray-300">{msg.sender}</span>
                        <span className="text-xs text-purple-400">{msg.role}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                    )}
                    {msg.isMe && (
                      <div className="flex items-baseline gap-2 mb-1 mr-1">
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                    )}
                    
                    {/* Bubble */}
                    <div 
                      className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        msg.isMe 
                          ? 'bg-purple-600 text-white rounded-br-sm' 
                          : 'bg-white/10 text-gray-100 rounded-bl-sm border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-black/60 border-t border-white/10 flex-none pb-6">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-5xl mx-auto">
              <button type="button" className="p-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>
              <div className="flex-1 relative">
                <textarea 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors resize-none overflow-hidden min-h-[50px] max-h-32"
                  rows="1"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={!messageInput.trim()}
                className={`p-3 rounded-xl flex items-center justify-center transition-all mb-1 ${messageInput.trim() ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/50' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
              >
                <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg text-black">
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
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg text-black">
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

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg w-full max-w-xl min-h-[500px] relative shadow-black shadow-lg flex flex-col font-poppins text-black">
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
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
    </div>
  );
}
