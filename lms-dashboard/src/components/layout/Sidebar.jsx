import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaTasks,
  FaComments,
  FaCode,
  FaCommentDots
} from 'react-icons/fa';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

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

  return (
    <div className="h-full bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}