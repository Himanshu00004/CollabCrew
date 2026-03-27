'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjectsByUser, sendMessage, subscribeToProjectChat } from '@/lib/projects';

export default function Livechat() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTab, setSearchTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  
  const isLoggedIn = !!user;
  const currentUser = user?.displayName || user?.email?.split('@')[0] || '';

  // Chat Data States
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(true);

  const messagesEndRef = useRef(null);

  // Load User Projects
  useEffect(() => {
    if (user?.uid) {
      loadProjects();
    } else {
      setLoadingProjects(false);
    }
  }, [user]);

  // Load Messages for Active Project
  useEffect(() => {
    let unsubscribe = () => {};
    if (activeProjectId) {
      unsubscribe = subscribeToProjectChat(activeProjectId, (newMsgs) => {
        setMessages(newMsgs);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    } else {
      setMessages([]);
    }
    return () => unsubscribe();
  }, [activeProjectId]);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const projects = await fetchProjectsByUser(user.uid);
      setJoinedProjects(projects);
      if (projects.length > 0 && !activeProjectId) {
        setActiveProjectId(projects[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProjects(false);
    }
  };

  const activeProjectData = joinedProjects.find(p => p.id === activeProjectId);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeProjectId || !user) return;
    
    try {
      const text = messageInput;
      setMessageInput('');
      await sendMessage(activeProjectId, user.uid, currentUser, text);
    } catch (e) {
      alert("Error sending message: " + e.message);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white font-poppins flex flex-col overflow-hidden">
      {/* Navbar Minimalist */}
      <nav className="flex items-center justify-between p-4 flex-none border-b border-gray-800 bg-black/40 z-10 backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-white hover:text-purple-400 text-xl">Dashboard</Link>
          <Link href="/projects" className="text-white hover:text-purple-400 text-xl">Projects</Link>
          <Link href="/livechat" className="text-white hover:text-purple-400 text-xl font-semibold border-b-2 border-purple-500 pb-1">Livechat</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setShowSearch(true)} className="text-white text-xl p-2 hover:text-purple-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          
          {isLoggedIn ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl hover:bg-purple-500 transition-colors uppercase"
                >
                  {currentUser ? currentUser.charAt(0) : 'U'}
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 bg-black bg-opacity-90 rounded-lg shadow-lg w-48 border border-gray-700 z-50 overflow-hidden">
                    <button className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-purple-600 transition-colors">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </button>
                    <button onClick={() => { setShowProfileMenu(false); setShowLogoutConfirm(true); }} className="flex items-center w-full px-4 py-3 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xl hover:bg-blue-600 transition-colors">Login</Link>
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
              <input type="text" placeholder="Search conversations..." className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all text-sm" />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full">
            {!isLoggedIn ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Please login to access live chat.
              </div>
            ) : loadingProjects ? (
              <div className="p-8 text-center text-gray-500">Loading your projects...</div>
            ) : joinedProjects.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                </div>
                <p className="text-gray-400 font-medium">No active chats.</p>
                <p className="text-sm text-gray-500">Join a project to start communicating with your team.</p>
                <Link href="/projects" className="mt-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded font-semibold text-sm hover:bg-purple-600 hover:text-white transition-colors">
                  Explore Projects
                </Link>
              </div>
            ) : (
              joinedProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setActiveProjectId(project.id)}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-4 ${activeProjectId === project.id ? 'bg-purple-900/40 border-l-4 border-l-purple-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl font-bold shadow-lg ${activeProjectId === project.id ? 'bg-gradient-to-tr from-purple-600 to-blue-500' : 'bg-gray-800'}`}>
                    {project.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-white font-semibold truncate pr-2 text-sm">{project.title}</h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate pr-2 text-gray-400`}>
                        {project.members?.length} Members
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane (70%) - Chat Area */}
        <div className="w-[70%] flex flex-col h-full bg-black/20">
          
          {/* Chat Header */}
          {activeProjectData ? (
            <div className="h-20 px-6 border-b border-white/10 flex items-center justify-between flex-none bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg bg-gradient-to-tr from-purple-600 to-blue-500`}>
                  {activeProjectData.title.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white hover:text-purple-400 transition-colors cursor-pointer">
                    <Link href={`/projects/${activeProjectData.id}`}>{activeProjectData.title}</Link>
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                    <span className="text-gray-400">{activeProjectData.members?.length || 1} members</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/projects/${activeProjectData.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                  Detailed View <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-20 px-6 border-b border-white/10 flex items-center flex-none bg-black/40">
              <h2 className="text-xl font-bold text-gray-500">No project selected</h2>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!activeProjectId && isLoggedIn && joinedProjects.length > 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p>Select a project from the left to view messages.</p>
              </div>
            ) : messages.length === 0 && activeProjectId ? (
               <div className="text-center text-gray-500 my-10 bg-black/30 p-8 rounded-2xl border border-white/5 inline-block mx-auto">
                 <p className="text-lg font-medium text-gray-300 mb-2">Welcome to the project chat!</p>
                 <p className="text-sm">Be the first to say hello to the team.</p>
               </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.uid;
                
                // Format the timestamp locally
                const timeString = msg.createdAt ? 
                  new Date(msg.createdAt.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                  'Just now';

                return (
                  <div key={msg.id} className={`flex w-full animate-fade-in-up ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm mt-auto shadow-md ${isMe ? 'bg-purple-600' : 'bg-gray-700'}`}>
                        {msg.senderName?.charAt(0) || 'U'}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Sender Name & Info */}
                        {!isMe && (
                          <div className="flex items-baseline gap-2 mb-1 ml-1">
                            <span className="text-sm font-semibold text-gray-300">{msg.senderName}</span>
                            <span className="text-xs text-gray-500">{timeString}</span>
                          </div>
                        )}
                        {isMe && (
                          <div className="flex items-baseline gap-2 mb-1 mr-1">
                            <span className="text-xs text-gray-500">{timeString}</span>
                          </div>
                        )}
                        
                        {/* Bubble */}
                        <div 
                          className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed break-words ${
                            isMe 
                              ? 'bg-purple-600 text-white rounded-br-sm shadow-purple-900/40' 
                              : 'bg-[#1e1e20] text-gray-200 rounded-bl-sm border border-white/5'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-black/60 border-t border-white/10 flex-none pb-6 backdrop-blur-md">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-5xl mx-auto">
              <button disabled type="button" className="p-3 text-gray-600 cursor-not-allowed bg-white/5 rounded-xl mb-1">
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
                  disabled={!activeProjectId || !isLoggedIn}
                  placeholder={activeProjectId ? "Type a message to your team..." : "Select a project first"} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors resize-none overflow-hidden min-h-[50px] max-h-32 disabled:bg-transparent disabled:cursor-not-allowed"
                  rows={1}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={!messageInput.trim() || !activeProjectId}
                className={`p-3 rounded-xl flex items-center justify-center transition-all mb-1 min-h-[50px] min-w-[50px] ${messageInput.trim() && activeProjectId ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/50 hover:-translate-y-0.5' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
              >
                <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg flex flex-col justify-center">
            <button onClick={() => setShowLogoutConfirm(false)} className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-800 transition-colors">&times;</button>
            <h2 className="text-4xl mb-6 text-black text-center">Logout</h2>
            <p className="text-xl text-black text-center mb-8">Are you sure you want to logout?</p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={async () => {
                  await logout();
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
    </div>
  );
}
