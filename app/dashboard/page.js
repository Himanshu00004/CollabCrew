'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjectsByUser, fetchJoinRequestsForLeader, handleJoinRequest } from '@/lib/projects';
import { createNotification } from '@/lib/notifications';

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTab, setSearchTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoggedIn = !!user;
  const currentUser = user?.displayName || user?.email?.split('@')[0] || '';

  useEffect(() => {
    if (user?.uid) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsData, requestsData] = await Promise.all([
        fetchProjectsByUser(user.uid),
        fetchJoinRequestsForLeader(user.uid)
      ]);
      setMyProjects(projectsData);
      setJoinRequests(requestsData);
    } catch (e) {
      console.error(e);
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-poppins flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 flex-none border-b border-gray-800">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-white hover:text-gray-300 text-xl font-semibold border-b-2 border-white pb-1">Dashboard</Link>
          <Link href="/projects" className="text-gray-400 hover:text-white text-xl">Projects</Link>
          <Link href="/livechat" className="text-gray-400 hover:text-white text-xl">Livechat</Link>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button onClick={() => setShowSearch(true)} className="text-gray-400 text-xl p-2 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {authLoading ? (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
          ) : isLoggedIn ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-xl hover:bg-gray-200 transition-colors focus:outline-none uppercase"
                >
                {currentUser ? currentUser.charAt(0) : 'U'}
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-3 bg-black bg-opacity-90 rounded-lg shadow-lg w-48 border border-gray-700 z-50 overflow-hidden">
                  <button className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-purple-600 transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.572c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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

      {/* Main Dashboard Content */}
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Sidebar (40%) - User Profile */}
        <div className="w-2/5 md:w-[40%] bg-black/40 border-r border-white/10 p-8 flex flex-col items-center overflow-y-auto">
          {/* Profile Picture & Info */}
          <div className="flex flex-col items-center mt-8 mb-10 w-full">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-gray-800 to-black flex items-center justify-center text-6xl font-bold uppercase shadow-[0_0_30px_rgba(255,255,255,0.05)] mb-6 border-4 border-white/20 text-white">
              {currentUser ? currentUser.charAt(0) : 'U'}
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-wide">{currentUser || 'User Profile'}</h2>
            <p className="text-gray-400 text-lg">Full Stack Developer</p>
          </div>

          {/* User Details Box */}
          <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-white border-b border-white/10 pb-2">Work Period</h3>
            <div className="flex items-center text-gray-300 gap-3 mb-2 text-lg">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Member since Sept 2024</span>
            </div>
            <div className="flex items-center text-gray-300 gap-3 text-lg">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>Available 20 hrs/week</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-5 text-white border-b border-white/10 pb-2 flex justify-between items-center">
              Top Skills
              <button className="text-sm text-gray-400 hover:text-white transition-colors">Edit</button>
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/10 text-gray-200 px-4 py-2 rounded-full text-base font-medium border border-white/20">React.js</span>
              <span className="bg-white/10 text-gray-200 px-4 py-2 rounded-full text-base font-medium border border-white/20">Node.js</span>
              <span className="bg-white/10 text-gray-200 px-4 py-2 rounded-full text-base font-medium border border-white/20">TypeScript</span>
              <span className="bg-white/10 text-gray-200 px-4 py-2 rounded-full text-base font-medium border border-white/20">Tailwind CSS</span>
              <span className="bg-white/10 text-gray-200 px-4 py-2 rounded-full text-base font-medium border border-white/20">MongoDB</span>
              <button className="bg-white/5 text-gray-400 px-4 py-2 rounded-full text-base font-medium border border-white/10 border-dashed hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                + Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane (60%) - User Projects */}
        <div className="w-3/5 md:w-[60%] p-10 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">My Projects</h2>
            <Link href="/projects" className="bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Project
            </Link>
          </div>

          {fetchError && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 p-6 rounded-xl max-w-2xl mb-8">
              <h3 className="text-xl font-bold mb-2">Failed to load Dashboard</h3>
              <p className="font-mono text-sm">{fetchError}</p>
              <p className="mt-4 text-sm text-red-300">If you see a 'Could not find the table' error, you need to run the Supabase SQL Setup Script in your Supabase Dashboard -&gt; SQL Editor!</p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6">
            {loading ? (
              <p className="text-gray-400">Loading projects...</p>
            ) : myProjects.map(project => (
              <Link href={`/projects/${project.id}`} key={project.id} className="bg-black/40 p-6 rounded-2xl border border-white/10 hover:border-white/40 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white truncate group-hover:text-gray-300 transition-colors">{project.title}</h3>
                  <div className="flex flex-col gap-2 items-end">
                    {project.creatorId === user?.uid && <span className="px-2 py-1 bg-white/10 text-white rounded text-xs font-semibold border border-white/20">👑 Owner</span>}
                    {project.projectType && <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs font-semibold border border-white/20">{project.projectType}</span>}
                  </div>
                </div>
                <p className="text-gray-400 mb-4 flex-grow leading-relaxed line-clamp-2 text-sm">{project.description}</p>
                
                {(project.teamSize || project.deadline) && (
                  <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400 border-y border-white/5 py-3">
                    {project.teamSize && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        <span>Size: <strong>{project.teamSize}</strong></span>
                      </div>
                    )}
                    {project.commitmentLevel && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Commitment: <strong>{project.commitmentLevel}</strong></span>
                      </div>
                    )}
                    {project.deadline && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>Deadline: <strong>{project.deadline}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2 border-t border-transparent">
                  {project.skills?.map(skill => (
                    <span key={skill} className="text-xs font-medium px-2 py-1 bg-white/5 border border-white/10 rounded text-gray-300">{skill}</span>
                  ))}
                </div>
              </Link>
            ))}
            
            <Link href="/projects" className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all min-h-[200px] group">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Join a New Project</h3>
              <p className="text-sm text-center max-w-xs">Discover more projects to collaborate on from the community.</p>
            </Link>
          </div>

          {joinRequests.length > 0 && (
            <div className="mt-8 pb-20">
              <h2 className="text-3xl font-bold mb-6 text-white border-b border-white/10 pb-4">Join Requests</h2>
              <div className="grid grid-cols-1 gap-4">
                {joinRequests.map(req => (
                  <div key={req.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{req.userName} <span className="text-gray-400 font-normal">wants to join</span> {req.projectTitle}</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={async () => {
                          try {
                            await handleJoinRequest(req.id, req.projectId, req.userId, req.userName, 'accepted');
                            await createNotification(req.userId, 'request_accepted', `Your request to join ${req.projectTitle} was accepted!`, req.projectId);
                            setJoinRequests(prev => prev.filter(r => r.id !== req.id));
                          } catch (e) { alert(e.message); }
                        }}
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={async () => {
                          const reason = window.prompt("Reason for rejection (mandatory):");
                          if (reason === null || reason.trim() === "") return alert("Rejection reason is mandatory.");
                          try {
                            await handleJoinRequest(req.id, req.projectId, req.userId, req.userName, 'rejected');
                            await createNotification(req.userId, 'request_rejected', `Your request to join ${req.projectTitle} was rejected.\nReason: ${reason}`, req.projectId);
                            setJoinRequests(prev => prev.filter(r => r.id !== req.id));
                          } catch (e) { alert(e.message); }
                        }}
                        className="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
