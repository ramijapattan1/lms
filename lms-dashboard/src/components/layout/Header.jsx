import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import NotificationList from '../notifications/NotificationList';

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState([
    {
      id: '1',
      title: 'New Reply',
      message: 'Someone replied to your question',
      type: 'discussion',
      referenceId: '1',
      createdAt: new Date().toISOString(),
      read: false
    }
  ]);

  const handleMarkRead = (id) => {
    // Implementation
  };

  const handleDelete = (id) => {
    // Implementation
  };

  const handleMarkAllRead = () => {
    // Implementation
  };

  const handleDeleteAll = () => {
    // Implementation
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">LMN TECH</span>
            </Link>
          </div>

          <div className="flex items-center">
            <NotificationList
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              onMarkAllRead={handleMarkAllRead}
              onDeleteAll={handleDeleteAll}
            />

            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
                >
                  <FaUserCircle className="h-8 w-8 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </button>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}