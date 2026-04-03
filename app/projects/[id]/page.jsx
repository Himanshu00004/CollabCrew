'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/NotificationBell';
import { fetchProjectById, requestToJoinProject, sendMessage, subscribeToProjectChat, fetchJoinRequestsForLeader, handleJoinRequest, deleteProject } from '@/lib/projects';
import { createNotification } from '@/lib/notifications';

export default function ProjectDetails({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  
  // In Next.js 15+, params is a Promise in page components. We must unwrap it using React.use() if this causes issues, 
  // but to be compatible with both Next 14 and 15 without importing `use`, we can gracefully resolve it in a useEffect.
  // Actually, the simplest fix is to use React.use() if we import it, or just use the unwrapped params property if it's an object.
  // Let's use `React.use` safely.
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const projectId = unwrappedParams?.id || params?.id;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // States specific to tabs
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  
  // UI states
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const isLoggedIn = !!user;
  const currentUser = user?.displayName || user?.email?.split('@')[0] || '';

  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (project && isMember) {
      unsubscribe = subscribeToProjectChat(projectId, (msgs) => setChatMessages(msgs));
    }
    return () => unsubscribe();
  }, [project, user]);

  useEffect(() => {
    if (project && isAdmin) {
      loadJoinRequests();
    }
  }, [project, user]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await fetchProjectById(projectId);
      setProject(data);
    } catch (e) {
      console.error(e);
      setError("Project could not be found.");
    } finally {
      setLoading(false);
    }
  };

  const loadJoinRequests = async () => {
    try {
      const reqs = await fetchJoinRequestsForLeader(user.uid);
      // Filter requests to only show ones for this specific project
      setJoinRequests(reqs.filter(r => r.projectId === projectId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestJoin = async () => {
    if (!isLoggedIn) return router.push('/');
    if (isRequesting) return;
    
    setIsRequesting(true);
    try {
      await requestToJoinProject(project.id, user.uid, currentUser, project.title, project.creatorId);
      
      // Send notification to project leader
      await createNotification(
        project.creatorId,
        'new_request',
        `${currentUser} has requested to join ${project.title}`,
        project.id
      );
      
      setHasRequested(true);
      alert('Join request sent successfully!');
    } catch (error) {
      if (error.message.includes('already requested')) {
        setHasRequested(true);
        alert('You have already requested to join this project.');
      } else {
        alert(error.message);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to completely delete this project? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteProject(projectId);
        router.push('/dashboard');
      } catch (e) {
        alert(e.message);
        setIsDeleting(false);
      }
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !isMember) return;
    try {
      const text = messageInput;
      setMessageInput('');
      await sendMessage(projectId, user.uid, currentUser, text);
    } catch (error) {
      alert("Failed to send message: " + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center font-poppins">Loading project details...</div>;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-poppins">
        <h1 className="text-2xl mb-4 text-red-500">{error || "Project not found"}</h1>
        <Link href="/projects" className="bg-purple-600 px-6 py-2 rounded text-white">Back to Projects</Link>
      </div>
    );
  }

  const isAdmin = isLoggedIn && project.creatorId === user.uid;
  const isMember = isLoggedIn && project.members?.includes(user.uid);
  const memberNames = project.memberNames || {};

  return (
    <div className="min-h-screen text-white font-poppins pb-10">
      {/* Navbar Minimalist */}
      <nav className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-white hover:text-purple-400 text-lg">Dashboard</Link>
          <Link href="/projects" className="text-white hover:text-purple-400 text-lg">Projects</Link>
          <Link href="/livechat" className="text-white hover:text-purple-400 text-lg">Livechat</Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <NotificationBell />
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl hover:bg-purple-500 uppercase">{currentUser ? currentUser.charAt(0) : 'U'}</button>
            </>
          ) : (
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Login</Link>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto mt-10 px-4">
        
        {/* Project Header */}
        <div className="bg-[#111113]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 mb-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-3xl -mr-20 -mt-20 rounded-full z-0 pointer-events-none"></div>
          <div className="relative z-10 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{project.title}</h1>
              {isAdmin && (
                <span className="bg-black/50 text-gray-300 border border-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  👑 Owner
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {project.projectType && <span className="bg-white/10 text-gray-300 px-3 py-1.5 rounded-full font-medium">{project.projectType}</span>}
              {project.commitmentLevel && <span className="bg-white/10 text-gray-300 px-3 py-1.5 rounded-full font-medium">{project.commitmentLevel}</span>}
              <span className="px-2 py-1 text-gray-400 font-medium">{project.members?.length || 1}/{project.teamSize !== 'Not Fixed' ? project.teamSize : '∞'} members</span>
            </div>
          </div>
          
          <div className="relative z-10 mt-6 md:mt-0 flex flex-wrap gap-3">
            {isAdmin && (
              <>
                <button className="flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 px-5 py-2.5 rounded-xl text-white font-medium transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit Project
                </button>
                <button 
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600 px-5 py-2.5 rounded-xl text-red-400 hover:text-white font-medium transition-all shadow-lg shadow-black/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
            {!isMember && (
              <button 
                onClick={handleRequestJoin}
                disabled={isRequesting || hasRequested}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${hasRequested ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50'}`}
              >
                {hasRequested ? 'Request Pending' : 'Request to Join'}
              </button>
            )}
            {isMember && !isAdmin && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-green-600/20 text-green-400 border border-green-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Member
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#111113]/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 mb-6 w-full shadow-lg">
          <button onClick={() => setActiveTab('overview')} className={`flex-1 min-w-[120px] flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Overview
          </button>
          
          {isAdmin && (
            <button onClick={() => setActiveTab('requests')} className={`flex-1 min-w-[120px] flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'requests' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Requests {joinRequests.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{joinRequests.length}</span>}
            </button>
          )}

          <button onClick={() => setActiveTab('team')} className={`flex-1 min-w-[120px] flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'team' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Team
          </button>

          {isMember && (
            <button onClick={() => setActiveTab('chat')} className={`flex-1 min-w-[120px] flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'chat' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Chat
            </button>
          )}
        </div>

        {/* Tab Content Rendering */}
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-white">Description</h3>
                <div className="text-gray-400 leading-relaxed whitespace-pre-wrap">{project.description}</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-white">Project Links</h3>
                <div className="flex flex-col gap-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                      GitHub
                    </a>
                  )}
                  {project.figmaUrl && (
                    <a href={project.figmaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21C9.79086 21 8 19.2091 8 17C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H12L12 21Z" fill="#0ACF83"/><path d="M8 9H12V13H8C5.79086 13 4 11.2091 4 9C4 6.79086 5.79086 5 8 5V9Z" fill="#A259FF"/><path d="M8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13V9H8Z" fill="#F24E1E"/><path d="M20 9C20 6.79086 18.2091 5 16 5V9H20Z" fill="#FF7262"/><path d="M20 9H16V13C18.2091 13 20 11.2091 20 9Z" fill="#1ABCFE"/>
                      </svg>
                      Figma
                    </a>
                  )}
                  {(!project.githubUrl && !project.figmaUrl) && (
                    <p className="text-sm text-gray-500 italic px-2">No links provided</p>
                  )}
                </div>
              </div>

              <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-white">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills?.map(skill => (
                    <span key={skill} className="bg-white/5 text-gray-300 border border-white/10 px-3 py-1.5 rounded-full text-sm font-medium">{skill}</span>
                  ))}
                  {(!project.skills || project.skills.length === 0) && <span className="text-gray-500 text-sm italic px-2">No specific skills listed.</span>}
                </div>
              </div>

              <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-white">Details</h3>
                <div className="flex flex-col gap-4 text-sm text-gray-300">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400">Created By</span>
                    <span className="font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-1 xl:max-w-32 truncate">
                      {memberNames[project.creatorId] || 'User'} <span className="text-white text-xs">👑</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-400">Team Size</span>
                    <span className="font-medium text-white">{project.teamSize || 'Flexible'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Deadline</span>
                    <span className="font-medium text-white">{project.deadline || 'No deadline'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-8 min-h-[400px]">
            <h2 className="text-3xl font-bold mb-6">Project Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.members?.map(memberId => (
                <div key={memberId} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:border-purple-500/50 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold uppercase shadow-lg shadow-purple-900/20">
                    {memberNames[memberId]?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {memberNames[memberId] || 'Unknown User'}
                      {memberId === project.creatorId && <span title="Project Leader" className="text-xl">👑</span>}
                    </h4>
                    <p className="text-sm text-gray-400">{memberId === project.creatorId ? 'Administrator' : 'Member'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REQUESTS TAB (ADMIN ONLY) */}
        {activeTab === 'requests' && isAdmin && (
          <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-8 min-h-[400px]">
            <h2 className="text-3xl font-bold mb-6">Pending Join Requests</h2>
            {joinRequests.length === 0 ? (
              <div className="text-center py-20 text-gray-500 bg-black/30 rounded-xl border border-white/5 border-dashed">
                <p className="text-xl">No pending requests at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {joinRequests.map(req => (
                  <div key={req.id} className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xl uppercase">{req.userName?.charAt(0) || 'U'}</div>
                      <div>
                        <p className="text-xl font-bold text-white">{req.userName}</p>
                        <p className="text-sm text-gray-400">Wants to collaborate on this project</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={async () => {
                          try {
                            await handleJoinRequest(req.id, req.projectId, req.userId, req.userName, 'accepted');
                            await createNotification(req.userId, 'request_accepted', `Your request to join ${req.projectTitle} was accepted!`, req.projectId);
                            setJoinRequests(prev => prev.filter(r => r.id !== req.id));
                            // Optimistically update the local project members so Team tab reflects it immediately
                            setProject(prev => ({
                              ...prev,
                              members: [...(prev.members || []), req.userId],
                              memberNames: { ...prev.memberNames, [req.userId]: req.userName }
                            }));
                          } catch (e) { alert(e.message); }
                        }}
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-colors"
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
                        className="flex-1 md:flex-none bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 px-8 py-3 rounded-lg font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB (MEMBERS ONLY) */}
        {activeTab === 'chat' && isMember && (
          <div className="bg-[#111113]/90 rounded-2xl border border-white/10 flex flex-col h-[700px] shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/40">
              <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
              <h3 className="font-bold text-lg">Project Live Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-black/20">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">No messages yet. Say hello to the team!</div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`flex w-full ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[75%] ${msg.senderId === user.uid ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm mt-auto shadow-md ${msg.senderId === user.uid ? 'bg-purple-600' : 'bg-gray-700'}`}>
                        {msg.senderName?.charAt(0) || 'U'}
                      </div>
                      <div className={`flex flex-col ${msg.senderId === user.uid ? 'items-end' : 'items-start'}`}>
                        {msg.senderId !== user.uid && <div className="text-sm font-semibold text-gray-400 mb-1 ml-1">{msg.senderName}</div>}
                        <div className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed ${msg.senderId === user.uid ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-[#1e1e20] text-gray-200 rounded-bl-sm border border-white/5'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 bg-black/60 border-t border-white/10 backdrop-blur-md">
              <form onSubmit={handleSendChatMessage} className="flex gap-3 max-w-4xl mx-auto items-end">
                <textarea 
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage(e);
                    }
                  }}
                  placeholder="Message team..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none overflow-hidden min-h-[50px] max-h-32"
                  rows={1}
                />
                <button type="submit" disabled={!messageInput.trim()} className={`p-3 rounded-xl flex items-center justify-center transition-all min-h-[50px] min-w-[50px] ${messageInput.trim() ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/40' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}>
                  <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
