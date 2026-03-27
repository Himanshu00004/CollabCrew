'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/notifications';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to notifications
    const unsubscribe = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleDropdown = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    // Mark all as read when opened
    if (nextState && unreadCount > 0) {
      await markAllNotificationsAsRead(user.uid, notifications);
    }
  };

  return (
    <div className="relative z-50 mr-4" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown} 
        className="relative text-white p-2 hover:text-purple-400 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[10px] items-center justify-center text-white"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-black bg-opacity-95 rounded-lg shadow-xl shadow-purple-900/20 border border-gray-700 overflow-hidden font-poppins text-left backdrop-blur-md">
          <div className="p-4 border-b border-gray-700 border-opacity-50">
            <h3 className="text-white font-semibold flex justify-between items-center">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-purple-600 px-2 py-1 rounded-full text-white">
                  {unreadCount} new
                </span>
              )}
            </h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-gray-800 hover:bg-white/5 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-purple-900/10'}`}
                  onClick={() => !notif.read && markNotificationAsRead(notif.id)}
                >
                  <p className="text-sm text-gray-200">{notif.message}</p>
                  {notif.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">
                        {new Date(notif.createdAt.toMillis()).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
