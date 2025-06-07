import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

export default function DiscussionDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState({
    id: '1',
    title: 'Understanding React Hooks',
    content: 'Can someone explain how useEffect works?',
    author: 'John Doe',
    createdAt: '2025-03-15T10:00:00Z',
    replies: [
      {
        id: '1',
        content: 'useEffect runs after every render by default...',
        author: 'Jane Smith',
        createdAt: '2025-03-15T10:30:00Z'
      }
    ]
  });
  const [reply, setReply] = useState('');

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const newReply = {
      id: Date.now().toString(),
      content: reply,
      author: user.name,
      createdAt: new Date().toISOString()
    };

    setDiscussion(prev => ({
      ...prev,
      replies: [...prev.replies, newReply]
    }));
    setReply('');
    toast.success('Reply added successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{discussion.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-1" />
              {format(new Date(discussion.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
          <p className="text-gray-700 mb-4">{discussion.content}</p>
          <div className="flex items-center text-sm text-gray-500">
            <FaUser className="mr-1" />
            {discussion.author}
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-medium mb-4">
            Replies ({discussion.replies.length})
          </h2>
          <div className="space-y-4">
            {discussion.replies.map(reply => (
              <div key={reply.id} className="bg-gray-50 p-4 rounded">
                <p className="text-gray-700 mb-2">{reply.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaUser className="mr-1" />
                    {reply.author}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    {format(new Date(reply.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleReply} className="mt-6">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              rows="3"
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Post Reply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}