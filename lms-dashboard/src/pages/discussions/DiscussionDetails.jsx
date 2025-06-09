import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaClock, FaReply } from 'react-icons/fa';
import { format } from 'date-fns';
import { api } from '../../services/api';

export default function DiscussionDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getDiscussionById(id);
        setDiscussion(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load discussion';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSubmittingReply(true);
    try {
      await api.addReply(id, { content: reply });
      toast.success('Reply added successfully!');
      setReply('');
      
      // Refresh discussion
      const response = await api.getDiscussionById(id);
      setDiscussion(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add reply';
      toast.error(errorMessage);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading discussion...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!discussion) return <div className="p-6 text-center">Discussion not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{discussion.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm capitalize">
                {discussion.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <FaClock className="mr-1" />
                {format(new Date(discussion.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          </div>
          
          {discussion.course && (
            <div className="text-sm text-gray-600 mb-4">
              Course: {discussion.course.title}
            </div>
          )}
          
          <p className="text-gray-700 mb-4">{discussion.content}</p>
          <div className="flex items-center text-sm text-gray-500">
            <FaUser className="mr-1" />
            {discussion.author?.name || 'Unknown'}
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-medium mb-4">
            Replies ({discussion.replies?.length || 0})
          </h2>
          
          {discussion.replies && discussion.replies.length > 0 ? (
            <div className="space-y-4 mb-6">
              {discussion.replies.map(reply => (
                <div key={reply._id} className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700 mb-2">{reply.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      {reply.author?.name || 'Unknown'}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {format(new Date(reply.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 mb-6">
              No replies yet. Be the first to reply!
            </div>
          )}

          {!discussion.isLocked && (
            <form onSubmit={handleReply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a Reply
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  rows="3"
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  <FaReply className="mr-2" />
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}