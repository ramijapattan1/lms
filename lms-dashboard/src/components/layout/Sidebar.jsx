import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaTasks,
  FaComments,
  FaCode,
  FaCommentDots,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <FaHome />,
      path: '/',
    },
    {
      name: 'Courses',
      icon: <FaBook />,
      path: '/courses',
    },
    {
      name: 'Quiz',
      icon: <FaQuestionCircle />,
      path: '/quiz',
    },
    {
      name: 'Assessments',
      icon: <FaTasks />,
      path: '/assessments',
    },
    {
      name: 'Discussions',
      icon: <FaComments />,
      path: '/discussions',
    },
    {
      name: 'Programming',
      icon: <FaCode />,
      path: '/programming',
    },
    {
      name: 'Doubt Box',
      icon: <FaCommentDots />,
      path: '/doubts',
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        style={{ marginLeft: '4px' }}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:flex-shrink-0
      `}>
        <div className="p-4">
          {/* Mobile logo */}
          <div className="lg:hidden mb-6 pt-12">
            <h2 className="text-xl font-bold text-center">LMN TECH</h2>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}