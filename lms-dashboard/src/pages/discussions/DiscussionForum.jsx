import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaComment, FaUser, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

export default function DiscussionForum() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([
    {
      id: '1',
      title: 'Understanding React Hooks',
      content: 'Can someone explain how useEffect works?',
      author: 'John Doe',
      createdAt: '2025-03-15T10:00:00Z',
      replies: 2
    }
  ]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });

  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    const discussion = {
      id: Date.now().toString(),
      ...newDiscussion,
      author: user.name,
      createdAt: new Date().toISOString(),
      replies: 0
    };
    setDiscussions(prev => [discussion, ...prev]);
    setNewDiscussion({ title: '', content: '' });
    toast.success('Discussion created successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Discussion Forum</h1>
        <form onSubmit={handleCreateDiscussion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
              rows="4"
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Create Discussion
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {discussions.map(discussion => (
          <Link 
            key={discussion.id} 
            to={`/discussions/${discussion.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{discussion.title}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1" />
                  {format(new Date(discussion.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  {discussion.author}
                </div>
                <div className="flex items-center">
                  <FaComment className="mr-1" />
                  {discussion.replies} replies
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}