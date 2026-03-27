'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/NotificationBell';
import { fetchProjectById, requestToJoinProject, sendMessage, subscribeToProjectChat, fetchJoinRequestsForLeader, handleJoinRequest } from '@/lib/projects';
import { createNotification } from '@/lib/notifications';

export default function ProjectDetails({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.id;
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white font-poppins pb-10">
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
        <div className="bg-[#111113]/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-3xl -mr-20 -mt-20 rounded-full z-0"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex gap-3 mb-3">
                {project.projectType && <span className="bg-blue-900/50 text-blue-300 border border-blue-700/50 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">{project.projectType}</span>}
                {project.commitmentLevel && <span className="bg-white/10 text-gray-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase">{project.commitmentLevel}</span>}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">{project.title}</h1>
              <p className="text-xl text-gray-400 max-w-2xl">{project.description}</p>
            </div>
            
            <div className="flex border border-white/10 bg-black/50 rounded-xl p-4 flex-col gap-2 min-w-[200px]">
              <div className="text-sm text-gray-400">Project Leader</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold">{memberNames[project.creatorId]?.charAt(0) || 'U'}</div>
                <div className="font-semibold">{memberNames[project.creatorId] || 'User'} 👑</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 sticky top-[73px] bg-[#0a0a0c]/80 backdrop-blur-lg z-40 px-2 pt-2">
          {['overview', 'team'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 font-semibold text-lg capitalize transition-colors ${activeTab === tab ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
          {isAdmin && (
            <button onClick={() => setActiveTab('requests')} className={`px-6 py-4 font-semibold text-lg flex items-center gap-2 capitalize transition-colors ${activeTab === 'requests' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}>
              Requests {joinRequests.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{joinRequests.length}</span>}
            </button>
          )}
          {isMember && (
            <button onClick={() => setActiveTab('chat')} className={`px-6 py-4 font-semibold text-lg capitalize transition-colors ${activeTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}>
              Chat
            </button>
          )}
        </div>

        {/* Tab Content Rendering */}
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold mb-4">About the Project</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
              
              <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold mb-4">Tech Stack & Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {project.skills?.map(skill => (
                    <span key={skill} className="bg-[#1e1e20] text-gray-300 border border-white/10 px-4 py-2 rounded-lg font-medium">{skill}</span>
                  ))}
                  {(!project.skills || project.skills.length === 0) && <span className="text-gray-500 italic">No specific skills listed.</span>}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#111113]/80 rounded-2xl border border-white/10 p-6 flex flex-col gap-4">
                <h3 className="text-xl font-bold mb-2">Details</h3>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span>Team Size: <strong className="text-white">{project.teamSize || 'Flexible'}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>Deadline: <strong className="text-white">{project.deadline || 'No deadline'}</strong></span>
                </div>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-400 hover:text-blue-300 break-all">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                    GitHub Repo
                  </a>
                )}
                {project.figmaUrl && (
                  <a href={project.figmaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-pink-400 hover:text-pink-300 break-all">
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21C9.79086 21 8 19.2091 8 17C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H12L12 21Z" fill="#0ACF83"/><path d="M8 9H12V13H8C5.79086 13 4 11.2091 4 9C4 6.79086 5.79086 5 8 5V9Z" fill="#A259FF"/><path d="M8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13V9H8Z" fill="#F24E1E"/><path d="M20 9C20 6.79086 18.2091 5 16 5V9H20Z" fill="#FF7262"/><path d="M20 9H16V13C18.2091 13 20 11.2091 20 9Z" fill="#1ABCFE"/>
                    </svg>
                    Figma Link
                  </a>
                )}
              </div>

              {/* Action Button */}
              <div className="sticky top-24 pt-4">
                {!isMember && (
                  <button 
                    onClick={handleRequestJoin}
                    disabled={isRequesting || hasRequested}
                    className={`w-full py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${hasRequested ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' : 'bg-green-500 hover:bg-green-400 text-black shadow-green-900/50'}`}
                  >
                    {hasRequested ? 'Request Pending' : 'Request to Join Project'}
                  </button>
                )}
                {isMember && (
                  <div className="w-full py-5 rounded-2xl text-xl font-bold bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center gap-3 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    You are a Member
                  </div>
                )}
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
