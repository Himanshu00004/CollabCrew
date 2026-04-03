'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';
import { createProject, fetchAllProjects, requestToJoinProject } from '@/lib/projects';
import { createNotification } from '@/lib/notifications';

export default function Projects() {
  const { user, loading: authLoading, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchTab, setSearchTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoggedIn = !!user;
  const currentUser = user?.displayName || user?.email?.split('@')[0] || '';

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const data = await fetchAllProjects();
      setProjectsList(data);
    } catch (e) {
      console.error(e);
      setFetchError(e.message);
    } finally {
      setLoadingProjects(false);
    }
  };



  return (
    <div className="min-h-screen text-white font-poppins">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 font-poppins">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-xl">Dashboard</Link>
          <Link href="/projects" className="text-white hover:text-gray-300 text-xl font-semibold border-b-2 border-white pb-1">Projects</Link>
          <Link href="/livechat" className="text-gray-400 hover:text-white text-xl">Livechat</Link>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <Link 
              href="/projects/new" 
              className="bg-white text-black px-4 py-2 rounded-lg text-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-semibold shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Project
            </Link>
          )}
          
          {/* Search */}
          <button onClick={() => setShowSearch(true)} className="text-gray-400 text-xl p-2 hover:text-white transition-colors z-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {authLoading ? (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
          ) : isLoggedIn ? (
            <>
              <NotificationBell />
              <div className="relative z-40">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-xl hover:bg-gray-200 transition-colors focus:outline-none uppercase"
                >
                {currentUser ? currentUser.charAt(0) : 'U'}
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-3 bg-black bg-opacity-90 rounded-lg shadow-lg w-48 border border-gray-700 z-50 overflow-hidden">
                  <button className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
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
            <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xl hover:bg-blue-600 transition-colors">Login</Link>
          )}
        </div>
      </nav>

      <main className="flex flex-col items-center justify-start pt-16 min-h-[80vh] px-4 font-poppins text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Projects</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12">
          Explore innovative projects, join brilliant teams, or launch your own disruptive ideas.
        </p>
        
        {fetchError && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-6 rounded-xl max-w-2xl mb-8">
            <h3 className="text-xl font-bold mb-2">Failed to load projects</h3>
            <p className="font-mono text-sm">{fetchError}</p>
            <p className="mt-4 text-sm text-red-300">If you see a 'Could not find the table' error, you need to run the Supabase SQL Setup Script in your Supabase Dashboard -&gt; SQL Editor!</p>
          </div>
        )}
        
        {loadingProjects ? (
          <p className="text-xl text-gray-400">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {projectsList.map(project => (
              <Link href={`/projects/${project.id}`} key={project.id} className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/5 hover:bg-black/40 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl shadow-black/50 p-6 transition-all duration-300 text-left flex flex-col group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold truncate text-white group-hover:text-gray-300 transition-colors">{project.title}</h3>
                  {project.projectType && (
                    <span className="bg-white/10 text-white border border-white/10 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                      {project.projectType}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 mb-4 h-16 overflow-hidden line-clamp-3 text-sm leading-relaxed">{project.description}</p>
                
                {(project.teamSize || project.deadline) && (
                  <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-400 border-y border-white/5 py-3">
                    {project.teamSize && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        <span>Size: <strong className="text-gray-300">{project.teamSize}</strong></span>
                      </div>
                    )}
                    {project.commitmentLevel && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Commitment: <strong className="text-gray-300">{project.commitmentLevel}</strong></span>
                      </div>
                    )}
                    {project.deadline && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>Deadline: <strong className="text-gray-300">{project.deadline}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-2 flex-grow content-start">
                  {project.skills?.map(skill => (
                    <span key={skill} className="bg-black/40 border border-white/10 px-2 py-1 rounded text-xs text-gray-300">{skill}</span>
                  ))}
                </div>
              </Link>
            ))}
            {projectsList.length === 0 && (
              <p className="col-span-3 text-center text-gray-400">No projects found. Be the first to create one!</p>
            )}
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
          <div className="bg-white p-8 rounded-lg w-full max-w-xl min-h-[500px] relative shadow-black shadow-lg flex flex-col font-poppins">
            <button onClick={() => setShowSearch(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl transition-colors">&times;</button>
            <h2 className="text-3xl mb-6 text-black text-center font-bold">Search</h2>
            
            {/* Tabs */}
            <div className="flex w-full mb-6 border-b border-gray-300">
              <button 
                onClick={() => setSearchTab('projects')}
                className={`flex-1 py-3 text-lg font-semibold transition-colors border-b-2 ${searchTab === 'projects' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Find Projects
              </button>
              <button 
                onClick={() => setSearchTab('friends')}
                className={`flex-1 py-3 text-lg font-semibold transition-colors border-b-2 ${searchTab === 'friends' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
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
                  className="w-full p-4 pl-12 border border-gray-300 text-black text-lg rounded-lg focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 bg-gray-50" 
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
