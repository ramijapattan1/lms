import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaComment, FaUser, FaClock, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import { api } from '../../services/api';

export default function DiscussionForum() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ 
    title: '', 
    content: '', 
    courseId: '',
    category: 'general'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch discussions
        const discussionParams = selectedCourse ? { courseId: selectedCourse } : {};
        const discussionResponse = await api.getDiscussions(discussionParams);
        setDiscussions(discussionResponse.data.discussions || []);

        // Fetch courses for filter
        let coursesData = [];
        if (user?.role === 'instructor') {
          const coursesResponse = await api.getMyCourses();
          coursesData = coursesResponse.data.courses || [];
        } else {
          const coursesResponse = await api.getEnrolledCourses();
          coursesData = coursesResponse.data.courses || [];
        }
        setCourses(coursesData);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load discussions';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse, user?.role]);

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const discussionData = {
        title: newDiscussion.title,
        content: newDiscussion.content,
        category: newDiscussion.category
      };

      // Only add courseId if it's selected and not empty
      if (newDiscussion.courseId && newDiscussion.courseId.trim() !== '') {
        discussionData.courseId = newDiscussion.courseId;
      }

      await api.createDiscussion(discussionData);
      toast.success('Discussion created successfully!');
      setShowCreateModal(false);
      setNewDiscussion({ title: '', content: '', courseId: '', category: 'general' });
      
      // Refresh discussions
      const discussionParams = selectedCourse ? { courseId: selectedCourse } : {};
      const discussionResponse = await api.getDiscussions(discussionParams);
      setDiscussions(discussionResponse.data.discussions || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create discussion';
      toast.error(errorMessage);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) {
      return;
    }

    try {
      await api.deleteDiscussion(discussionId);
      toast.success('Discussion deleted successfully!');
      
      // Refresh discussions
      const discussionParams = selectedCourse ? { courseId: selectedCourse } : {};
      const discussionResponse = await api.getDiscussions(discussionParams);
      setDiscussions(discussionResponse.data.discussions || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete discussion';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading discussions...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discussion Forum</h1>
        <div className="flex items-center space-x-4">
          {courses.length > 0 && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border rounded focus:ring-primary focus:border-primary"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            <FaPlus className="mr-2" />
            New Discussion
          </button>
        </div>
      </div>

      {discussions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No discussions available. Start a new discussion!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {discussions.map(discussion => (
            <div key={discussion._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link to={`/discussions/${discussion._id}`}>
                      <h2 className="text-xl font-semibold mb-2 hover:text-primary">{discussion.title}</h2>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaUser className="mr-1" />
                        {discussion.author?.name || 'Unknown'}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {format(new Date(discussion.createdAt), 'MMM d, yyyy')}
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                        {discussion.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaComment className="mr-1" />
                      {discussion.replies?.length || 0} replies
                    </div>
                    {(user?.role === 'admin' || discussion.author?._id === user?._id) && (
                      <div className="flex space-x-2">
                        <Link
                          to={`/discussions/${discussion._id}/edit`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteDiscussion(discussion._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {discussion.course && (
                  <div className="text-sm text-gray-600 mb-2">
                    Course: {discussion.course.title}
                  </div>
                )}
                
                <p className="text-gray-700 line-clamp-2">{discussion.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Create New Discussion</h2>
            <form onSubmit={handleCreateDiscussion}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course (Optional)
                  </label>
                  <select
                    value={newDiscussion.courseId}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">General Discussion</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newDiscussion.category}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="general">General</option>
                    <option value="question">Question</option>
                    <option value="announcement">Announcement</option>
                    <option value="assignment">Assignment</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

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
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Create Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}