'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/NotificationBell';
import { createProject } from '@/lib/projects';

export default function NewProject() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const currentUser = user?.displayName || user?.email?.split('@')[0] || '';
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('Select type');
  const [commitment, setCommitment] = useState('Flexible');
  
  const [skillSearch, setSkillSearch] = useState('');
  const [skills, setSkills] = useState([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [teamSize, setTeamSize] = useState('Fixed Size');
  const [teamSizeNum, setTeamSizeNum] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const commonSkills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", 
    "C++", "C#", "Ruby", "PHP", "Go", "Rust", "Swift", "Kotlin", "Dart", "Flutter",
    "Tailwind CSS", "MongoDB", "PostgreSQL", "MySQL", "Firebase", "AWS", "Docker", "Figma"
  ];
  
  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');

  const isLoggedIn = !!user;

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skillSearch.trim()) {
      e.preventDefault();
      if (!skills.includes(skillSearch.trim())) {
        setSkills([...skills, skillSearch.trim()]);
      }
      setSkillSearch('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Title and description are required.");
    
    try {
      const newProjectId = await createProject(
        title, 
        description, 
        skills, 
        user?.uid, 
        currentUser,
        projectType === 'Select type' ? '' : projectType,
        commitment,
        teamSize === 'Fixed Size' ? teamSizeNum : 'Not Fixed',
        deadline,
        githubUrl,
        figmaUrl
      );
      router.push(`/projects/${newProjectId}`);
    } catch (error) {
      alert("Failed to create project: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-poppins">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-poppins">
        <p className="text-xl mb-4">Please log in to create a project.</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-500 transition-colors">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white font-poppins pb-20 selection:bg-purple-500/30">
      {/* Navbar implementation matching app */}
      <nav className="flex items-center justify-between p-4 font-poppins">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-3xl font-bold">CollabCrew</Link>
          <Link href="/dashboard" className="text-white hover:text-purple-400 text-xl">Dashboard</Link>
          <Link href="/projects" className="text-white hover:text-purple-400 text-xl">Projects</Link>
          <Link href="/livechat" className="text-white hover:text-purple-400 text-xl">Livechat</Link>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell />
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
        </div>
      </nav>

      <main className="max-w-3xl mx-auto pt-10 px-4">
        {/* Box 1: Project Details */}
        <div className="bg-[#111113]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 mb-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h2 className="text-xl font-bold">Project Details</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
            <input 
              type="text" 
              placeholder="e.g., AI Resume Reviewer" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea 
              placeholder="Describe your project idea, what problem it solves, and what you're looking to build..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Type *</label>
              <select 
                value={projectType}
                onChange={e => setProjectType(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white appearance-none focus:outline-none focus:border-purple-500 transition-colors"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.65em auto' }}
              >
                <option value="Select type" disabled>Select type</option>
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Open Source">Open Source</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Commitment Level</label>
              <select 
                value={commitment}
                onChange={e => setCommitment(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white appearance-none focus:outline-none focus:border-purple-500 transition-colors"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.65em auto' }}
              >
                <option value="Flexible">Flexible</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Box 2: Team Requirements */}
        <div className="bg-[#111113]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 mb-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-bold">Team Requirements</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">&lt;&gt; Skills Required *</label>
            <p className="text-xs text-gray-500 mb-2">Add the skills you need for your team (e.g., React, Python, Figma)</p>
            <div className="relative">
              <div 
                className="bg-[#09090b] border border-white/10 rounded-xl p-2 focus-within:border-purple-500 transition-colors flex flex-wrap gap-2 items-center min-h-[56px]"
                onClick={() => setShowSkillDropdown(true)}
              >
                {skills.map(skill => (
                  <span key={skill} className="bg-[#1e1e20] text-gray-300 border border-white/10 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 z-10">
                    {skill}
                    <button onClick={(e) => { e.stopPropagation(); removeSkill(skill); }} className="text-gray-500 hover:text-white transition-colors">&times;</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder={skills.length === 0 ? "Type to search skills... (Press Enter)" : ""}
                  value={skillSearch}
                  onChange={e => {
                    setSkillSearch(e.target.value);
                    setShowSkillDropdown(true);
                  }}
                  onKeyDown={handleSkillAdd}
                  onFocus={() => setShowSkillDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                  className="bg-transparent text-white border-none outline-none p-2 flex-grow min-w-[200px] placeholder-gray-600"
                />
              </div>
              
              {showSkillDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e20] border border-white/10 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto">
                  {commonSkills
                    .filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !skills.includes(s))
                    .map(skill => (
                      <button
                        key={skill}
                        type="button"
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-purple-600 hover:text-white transition-colors border-b border-white/5 last:border-0"
                        onClick={() => {
                          setSkills([...skills, skill]);
                          setSkillSearch('');
                          setShowSkillDropdown(false);
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                    {skillSearch && !commonSkills.some(s => s.toLowerCase() === skillSearch.toLowerCase()) && (
                      <button
                        type="button"
                        className="w-full text-left px-4 py-3 text-sm text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
                        onClick={() => {
                          setSkills([...skills, skillSearch.trim()]);
                          setSkillSearch('');
                          setShowSkillDropdown(false);
                        }}
                      >
                        Add "{skillSearch}"
                      </button>
                    )}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
              <div className="flex bg-[#09090b] border border-white/10 rounded-xl overflow-hidden mb-3 p-1">
                <button 
                  type="button"
                  onClick={() => setTeamSize('Fixed Size')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors rounded-lg ${teamSize === 'Fixed Size' ? 'bg-[#2a2a2c] text-white border border-gray-600 shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Fixed Size
                </button>
                <button 
                  type="button"
                  onClick={() => setTeamSize('Not Fixed')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors rounded-lg ${teamSize === 'Not Fixed' ? 'bg-[#2a2a2c] text-white border border-gray-600 shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Not Fixed
                </button>
              </div>
              {teamSize === 'Fixed Size' && (
                <input 
                  type="number" 
                  placeholder="5" 
                  value={teamSizeNum}
                  onChange={e => setTeamSizeNum(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Deadline
              </label>
              <input 
                type="date" 
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
        
        {/* Box 3: Project Links */}
        <div className="bg-[#111113]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h2 className="text-xl font-bold">Project Links (optional)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                GitHub Repository
              </label>
              <input 
                type="url" 
                placeholder="https://github.com/..." 
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C9.79086 21 8 19.2091 8 17C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H12L12 21Z" fill="#0ACF83"/>
                  <path d="M8 9H12V13H8C5.79086 13 4 11.2091 4 9C4 6.79086 5.79086 5 8 5V9Z" fill="#A259FF"/>
                  <path d="M8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13V9H8Z" fill="#F24E1E"/>
                  <path d="M20 9C20 6.79086 18.2091 5 16 5V9H20Z" fill="#FF7262"/>
                  <path d="M20 9H16V13C18.2091 13 20 11.2091 20 9Z" fill="#1ABCFE"/>
                </svg>
                Figma / Design Link
              </label>
              <input 
                type="url" 
                placeholder="https://figma.com/..." 
                value={figmaUrl}
                onChange={e => setFigmaUrl(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-20">
          <button 
            type="button"
            onClick={() => router.push('/projects')}
            className="flex-1 py-4 text-lg font-semibold rounded-xl bg-transparent border border-white/20 hover:bg-white/5 transition-colors text-white"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-4 text-lg font-semibold rounded-xl bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Create Project
          </button>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 min-h-[400px] relative shadow-black shadow-lg flex flex-col justify-center text-black">
            <button onClick={() => setShowLogoutConfirm(false)} className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-gray-800 transition-colors">&times;</button>
            <h2 className="text-4xl mb-6 text-black text-center font-bold">Logout</h2>
            <p className="text-xl text-black text-center mb-8">Are you sure you want to logout?</p>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={async () => { 
                  await logout();
                  setShowLogoutConfirm(false); 
                }}
                className="w-full bg-blue-500 text-white p-3 rounded text-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Yes
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-gray-500 text-white p-3 rounded text-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
