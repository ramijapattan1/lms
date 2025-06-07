import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

export default function NotificationList({ notifications = [], onMarkRead, onDelete, onMarkAllRead, onDeleteAll }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'doubt':
        navigate(`/doubts/${notification.referenceId}`);
        break;
      case 'discussion':
        navigate(`/discussions/${notification.referenceId}`);
        break;
      case 'assessment':
        navigate(`/assessments/${notification.referenceId}`);
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <FaBell className="h-6 w-6 text-gray-500" />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onMarkAllRead();
                    setIsOpen(false);
                  }}
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  <FaCheck className="inline-block mr-1" />
                  Mark all read
                </button>
                <button
                  onClick={() => {
                    onDeleteAll();
                    setIsOpen(false);
                  }}
                  className="text-sm text-gray-600 hover:text-red-500"
                >
                  <FaTrash className="inline-block mr-1" />
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaTrash />
                    </button>
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