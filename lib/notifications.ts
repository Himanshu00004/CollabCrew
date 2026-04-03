import { supabase } from './supabase';

export const createNotification = async (userId: string, type: string, message: string, projectId: string | null = null) => {
  try {
    const { data, error } = await supabase.from('notifications').insert([{
      user_id: userId,
      type, // 'request_accepted', 'request_rejected', 'new_request'
      message,
      project_id: projectId,
      read: false
    }]).select('id').single();

    if (error) throw error;
    return data.id;
  } catch (e) {
    console.error('Error adding notification: ', e);
    throw e;
  }
};

export const subscribeToNotifications = (userId: string, callback: any) => {
  if (!userId) return () => {};
  
  let currentNotifs: any[] = [];

  // Query initial
  supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) {
        currentNotifs = data.map(n => ({ ...n, userId: n.user_id, projectId: n.project_id }));
        callback([...currentNotifs]);
      }
    });

  // Setup Realtime
  const channel = supabase.channel(`public:notifications:user_id=eq.${userId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      const newN = payload.new;
      currentNotifs.unshift({
        ...newN,
        userId: newN.user_id,
        projectId: newN.project_id
      }); // Insert at top since descending
      callback([...currentNotifs]);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
    } catch (e) {
      console.error('Error marking notification as read: ', e);
      throw e;
    }
  };

export const markAllNotificationsAsRead = async (userId: string, notifications: any[]) => {
  try {
    const unread = notifications.filter(n => !n.read);
    const promises = unread.map(n => {
        return supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', n.id);
    });
    await Promise.all(promises);
  } catch (e) {
    console.error('Error marking all as read: ', e);
  }
};
