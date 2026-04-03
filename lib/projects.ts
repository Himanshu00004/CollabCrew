import { supabase } from './supabase';

// PROJECT FUNCTIONS
export const createProject = async (
  title: string, 
  description: string, 
  skills: string[], 
  creatorId: string, 
  creatorName: string, 
  projectType: string = '', 
  commitmentLevel: string = '', 
  teamSize: string = '', 
  deadline: string = '', 
  githubUrl: string = '', 
  figmaUrl: string = ''
) => {
  try {
    const { data, error } = await supabase.from('projects').insert([{
      title,
      description,
      skills,
      creator_id: creatorId,
      creator_name: creatorName,
      project_type: projectType,
      commitment_level: commitmentLevel,
      team_size: teamSize,
      deadline,
      github_url: githubUrl,
      figma_url: figmaUrl,
      members: [creatorId], // leader is a member by default
      member_names: { [creatorId]: creatorName }
    }]).select('id').single();

    if (error) throw error;
    return data.id;
  } catch (e) {
    console.error('Error adding project: ', e);
    throw e;
  }
};

export const fetchProjectById = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (error) throw error;
    
    // Convert snake_case back to camelCase for the frontend UI compatibility
    return {
      ...data,
      creatorId: data.creator_id,
      creatorName: data.creator_name,
      projectType: data.project_type,
      commitmentLevel: data.commitment_level,
      teamSize: data.team_size,
      githubUrl: data.github_url,
      figmaUrl: data.figma_url,
      memberNames: data.member_names,
      createdAt: data.created_at
    };
  } catch (e) {
    console.error('Error fetching project by ID: ', e);
    throw e;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Error deleting project: ', e);
    throw e;
  }
};

export const fetchAllProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(p => ({
      ...p,
      creatorId: p.creator_id,
      creatorName: p.creator_name,
      projectType: p.project_type,
      commitmentLevel: p.commitment_level,
      teamSize: p.team_size,
      githubUrl: p.github_url,
      figmaUrl: p.figma_url,
      memberNames: p.member_names
    }));
  } catch (e) {
    console.error('Error fetching projects: ', e);
    throw e;
  }
};

export const fetchProjectsByUser = async (userId: string) => {
  try {
    // Projects where user is in members array
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .contains('members', [userId])
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(p => ({
      ...p,
      creatorId: p.creator_id,
      creatorName: p.creator_name,
      projectType: p.project_type,
      commitmentLevel: p.commitment_level,
      teamSize: p.team_size,
      githubUrl: p.github_url,
      figmaUrl: p.figma_url,
      memberNames: p.member_names
    }));
  } catch (e) {
    console.error('Error fetching user projects: ', e);
    throw e;
  }
};

// JOIN REQUEST FUNCTIONS
export const requestToJoinProject = async (projectId: string, userId: string, userName: string, projectTitle: string, leaderId: string) => {
  try {
    // Check if request already exists
    const { data: existing, error: checkError } = await supabase
      .from('join_requests')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId);
      
    if (checkError) throw checkError;
    if (existing && existing.length > 0) {
      throw new Error('You have already requested to join this project.');
    }

    const { data, error } = await supabase.from('join_requests').insert([{
      project_id: projectId,
      user_id: userId,
      user_name: userName,
      project_title: projectTitle,
      leader_id: leaderId
    }]).select('id').single();

    if (error) throw error;
    return data.id;
  } catch (e) {
    console.error('Error requesting to join: ', e);
    throw e;
  }
};

export const fetchJoinRequestsForLeader = async (leaderId: string) => {
  try {
    const { data, error } = await supabase
      .from('join_requests')
      .select('*')
      .eq('leader_id', leaderId)
      .eq('status', 'pending');
      
    if (error) throw error;
    
    return data.map(r => ({
      ...r,
      projectId: r.project_id,
      userId: r.user_id,
      userName: r.user_name,
      projectTitle: r.project_title,
      leaderId: r.leader_id
    }));
  } catch (e) {
    console.error('Error fetching join requests: ', e);
    throw e;
  }
};

export const handleJoinRequest = async (requestId: string, projectId: string, userId: string, userName: string, status: string) => {
  try {
    // Update request status
    const { error: updateReqErr } = await supabase
      .from('join_requests')
      .update({ status: status })
      .eq('id', requestId);
      
    if (updateReqErr) throw updateReqErr;

    if (status === 'accepted') {
      // First fetch current project to get arrays
      const { data: proj, error: fetchErr } = await supabase
        .from('projects')
        .select('members, member_names')
        .eq('id', projectId)
        .single();
        
      if (fetchErr) throw fetchErr;
      
      const newMembers = [...proj.members, userId];
      const newMemberNames = { ...proj.member_names, [userId]: userName };
      
      const { error: updateProjErr } = await supabase
        .from('projects')
        .update({
          members: newMembers,
          member_names: newMemberNames
        })
        .eq('id', projectId);
        
      if (updateProjErr) throw updateProjErr;
    }
    
    return true;
  } catch (e) {
    console.error('Error handling join request: ', e);
    throw e;
  }
};

// CHAT FUNCTIONS
export const sendMessage = async (projectId: string, senderId: string, senderName: string, text: string) => {
  try {
    const { error } = await supabase.from('messages').insert([{
      project_id: projectId,
      sender_id: senderId,
      sender_name: senderName,
      text: text
    }]);
    if (error) throw error;
  } catch (e) {
    console.error('Error sending message: ', e);
    throw e;
  }
};

export const subscribeToProjectChat = (projectId: string, callback: any) => {
  if (!projectId) return () => {};
  
  let currentMessages: any[] = [];
  
  // 1. Fetch initial messages
  supabase
    .from('messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
    .then(({ data }) => {
      if (data) {
        currentMessages = data.map(m => ({ ...m, senderId: m.sender_id, senderName: m.sender_name }));
        callback([...currentMessages]);
      }
    });

  // 2. Setup realtime listener for new inserts
  const channel = supabase.channel(`public:messages:project_id=eq.${projectId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages',
      filter: `project_id=eq.${projectId}`
    }, (payload) => {
      const newMsg = payload.new;
      currentMessages.push({
        ...newMsg,
        senderId: newMsg.sender_id,
        senderName: newMsg.sender_name
      });
      callback([...currentMessages]);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
