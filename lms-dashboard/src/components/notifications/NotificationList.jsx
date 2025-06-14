import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function NotificationList() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.getNotifications({ limit: 20 });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.markNotificationAsRead(notification._id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
      }

      // Navigate based on notification type and data
      if (notification.data) {
        switch (notification.type) {
          case 'course_enrollment':
          case 'course_created':
            if (notification.data.courseId) {
              navigate(`/courses/${notification.data.courseId}`);
            }
            break;
          case 'assignment_due':
          case 'grade_posted':
            if (notification.data.assessmentId) {
              navigate(`/assessments/${notification.data.assessmentId}`);
            }
            break;
          case 'quiz_available':
            if (notification.data.quizId) {
              navigate(`/quiz/${notification.data.quizId}`);
            }
            break;
          case 'discussion_reply':
            if (notification.data.discussionId) {
              navigate(`/discussions/${notification.data.discussionId}`);
            }
            break;
          case 'doubt_response':
            if (notification.data.doubtId) {
              navigate(`/doubts/${notification.data.doubtId}`);
            }
            break;
          case 'chapter_created':
          case 'lesson_created':
            if (notification.data.courseId) {
              navigate(`/courses/${notification.data.courseId}`);
            }
            break;
          default:
            if (notification.data.url) {
              navigate(notification.data.url);
            }
            break;
        }
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to handle notification click:', error);
    }
  };

  const handleMarkRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await api.markNotificationAsRead(notificationId);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await api.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) {
      return;
    }
    
    try {
      await api.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications deleted');
    } catch (error) {
      toast.error('Failed to delete all notifications');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <FaBell className="h-6 w-6 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-gray-600 hover:text-primary"
                  disabled={unreadCount === 0}
                >
                  <FaCheck className="inline-block mr-1" />
                  Mark all read
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="text-sm text-gray-600 hover:text-red-500"
                  disabled={notifications.length === 0}
                >
                  <FaTrash className="inline-block mr-1" />
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => handleMarkRead(notification._id, e)}
                          className="text-gray-400 hover:text-primary"
                          title="Mark as read"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notification._id, e)}
                        className="text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}