import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter(n => !n.read)
        .map(n => markAsRead(n.id));
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const deleteAll = async () => {
    try {
      const promises = notifications.map(n => deleteNotification(n.id));
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};