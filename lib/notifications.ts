import { db } from './firebase';
import { 
  collection, addDoc, getDocs, doc, updateDoc, 
  query, where, serverTimestamp, onSnapshot, orderBy
} from 'firebase/firestore';

export const createNotification = async (userId: string, type: string, message: string, projectId: string | null = null) => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      userId,
      type, // 'request_accepted', 'request_rejected', 'new_request'
      message,
      projectId,
      read: false,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding notification: ', e);
    throw e;
  }
};

export const subscribeToNotifications = (userId: string, callback: any) => {
  if (!userId) return () => {};
  
  const q = query(
    collection(db, 'notifications'), 
    where('userId', '==', userId),
    // orderBy('createdAt', 'desc') // Need index for this if combining where and orderBy, so skipping orderBy for simpler setup
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const notifications: any[] = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    // Process local sort since we omitted orderBy
    notifications.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeB - timeA;
    });
    
    callback(notifications);
  }, (error) => {
    console.error('Error listening to notifications: ', error);
  });

  return unsubscribe;
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        read: true
      });
    } catch (e) {
      console.error('Error marking notification as read: ', e);
      throw e;
    }
  };

export const markAllNotificationsAsRead = async (userId: string, notifications: any[]) => {
  try {
    const unread = notifications.filter(n => !n.read);
    const promises = unread.map(n => {
        const notifRef = doc(db, 'notifications', n.id);
        return updateDoc(notifRef, { read: true });
    });
    await Promise.all(promises);
  } catch (e) {
    console.error('Error marking all as read: ', e);
  }
};
