import { db } from './firebase';
import { 
  collection, addDoc, getDocs, doc, getDoc, updateDoc, 
  query, where, serverTimestamp, arrayUnion, arrayRemove, setDoc, deleteDoc, onSnapshot
} from 'firebase/firestore';

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
    const docRef = await addDoc(collection(db, 'projects'), {
      title,
      description,
      skills,
      creatorId,
      creatorName,
      projectType,
      commitmentLevel,
      teamSize,
      deadline,
      githubUrl,
      figmaUrl,
      members: [creatorId], // leader is a member by default
      memberNames: {
        [creatorId]: creatorName
      },
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding project: ', e);
    throw e;
  }
};

export const fetchProjectById = async (projectId: string) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Project not found");
    }
  } catch (e) {
    console.error('Error fetching project by ID: ', e);
    throw e;
  }
};

export const fetchAllProjects = async () => {
  try {
    const q = query(collection(db, 'projects'));
    const querySnapshot = await getDocs(q);
    const projects: any[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (e) {
    console.error('Error fetching projects: ', e);
    throw e;
  }
};

export const fetchProjectsByUser = async (userId: string) => {
  try {
    // Projects created by user OR user is a member
    const q = query(collection(db, 'projects'), where('members', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    const projects: any[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (e) {
    console.error('Error fetching user projects: ', e);
    throw e;
  }
};

// JOIN REQUEST FUNCTIONS
export const requestToJoinProject = async (projectId: string, userId: string, userName: string, projectTitle: string, leaderId: string) => {
  try {
    // Check if request already exists
    const q = query(collection(db, 'joinRequests'), 
      where('projectId', '==', projectId), 
      where('userId', '==', userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error('You have already requested to join this project.');
    }

    const docRef = await addDoc(collection(db, 'joinRequests'), {
      projectId,
      userId,
      userName,
      projectTitle,
      leaderId,
      status: 'pending', // pending, accepted, rejected
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error('Error requesting to join: ', e);
    throw e;
  }
};

export const fetchJoinRequestsForLeader = async (leaderId: string) => {
  try {
    const q = query(collection(db, 'joinRequests'), 
      where('leaderId', '==', leaderId),
      where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const requests: any[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    return requests;
  } catch (e) {
    console.error('Error fetching join requests: ', e);
    throw e;
  }
};

export const handleJoinRequest = async (requestId: string, projectId: string, userId: string, userName: string, status: string) => {
  try {
    // Update request status
    const requestRef = doc(db, 'joinRequests', requestId);
    await updateDoc(requestRef, {
      status: status
    });

    if (status === 'accepted') {
      // Add user to project members and track their name
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        members: arrayUnion(userId),
        [`memberNames.${userId}`]: userName
      });
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
    await addDoc(collection(db, `projects/${projectId}/messages`), {
      senderId,
      senderName,
      text,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error sending message: ', e);
    throw e;
  }
};

export const subscribeToProjectChat = (projectId: string, callback: any) => {
  if (!projectId) return () => {};
  
  const q = query(collection(db, `projects/${projectId}/messages`));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: any[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    messages.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeA - timeB; // Ascending order (oldest to newest)
    });
    
    callback(messages);
  });

  return unsubscribe;
};
