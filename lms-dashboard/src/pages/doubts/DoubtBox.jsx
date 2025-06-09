import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaClock, FaReply, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function DoubtBox() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showAskDoubtModal, setShowAskDoubtModal] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [newDoubt, setNewDoubt] = useState({
    title: '',
    description: '',
    courseId: '',
    category: 'general',
    priority: 'medium'
  });
  const [reply, setReply] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch doubts
        const doubtParams = selectedCourse ? { courseId: selectedCourse } : {};
        const doubtResponse = await api.getDoubts(doubtParams);
        setDoubts(doubtResponse.data.doubts || []);

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
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load doubts';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse, user?.role]);

  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    if (!newDoubt.title.trim() || !newDoubt.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.createDoubt(newDoubt);
      toast.success('Doubt submitted successfully!');
      setShowAskDoubtModal(false);
      setNewDoubt({
        title: '',
        description: '',
        courseId: '',
        category: 'general',
        priority: 'medium'
      });
      
      // Refresh doubts
      const doubtParams = selectedCourse ? { courseId: selectedCourse } : {};
      const doubtResponse = await api.getDoubts(doubtParams);
      setDoubts(doubtResponse.data.doubts || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit doubt';
      toast.error(errorMessage);
    }
  };

  const handleSubmitReply = async (doubtId) => {
    if (!reply.trim()) return;

    try {
      await api.addResponse(doubtId, { content: reply });
      toast.success('Response added successfully!');
      setReply('');
      
      // Refresh doubts
      const doubtParams = selectedCourse ? { courseId: selectedCourse } : {};
      const doubtResponse = await api.getDoubts(doubtParams);
      setDoubts(doubtResponse.data.doubts || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add response';
      toast.error(errorMessage);
    }
  };

  const handleResolveDoubt = async (doubtId) => {
    try {
      await api.resolveDoubt(doubtId);
      toast.success('Doubt marked as resolved!');
      
      // Refresh doubts
      const doubtParams = selectedCourse ? { courseId: selectedCourse } : {};
      const doubtResponse = await api.getDoubts(doubtParams);
      setDoubts(doubtResponse.data.doubts || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resolve doubt';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading doubts...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doubt Box</h1>
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
          <Button onClick={() => setShowAskDoubtModal(true)}>
            <FaPlus className="mr-2" />
            Ask a Doubt
          </Button>
        </div>
      </div>

      {doubts.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No doubts have been posted yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {doubts.map(doubt => (
            <Card key={doubt._id}>
              <div 
                className="cursor-pointer"
                onClick={() => setSelectedDoubt(selectedDoubt?._id === doubt._id ? null : doubt)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{doubt.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center">
                        <FaUser className="mr-1" />
                        {doubt.student?.name || 'Unknown'}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {format(new Date(doubt.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                        {doubt.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        doubt.priority === 'high' ? 'bg-red-100 text-red-800' :
                        doubt.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {doubt.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      doubt.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      doubt.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      doubt.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doubt.status === 'in-progress' ? 'In Progress' : doubt.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedDoubt?._id === doubt._id && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-700 mb-4">{doubt.description}</p>

                  {doubt.course && (
                    <div className="text-sm text-gray-600 mb-4">
                      Course: {doubt.course.title}
                    </div>
                  )}

                  {doubt.responses && doubt.responses.length > 0 && (
                    <div className="space-y-4 mb-4">
                      <h4 className="font-medium">Responses:</h4>
                      {doubt.responses.map(response => (
                        <div key={response._id} className="bg-gray-50 p-4 rounded">
                          <p className="text-gray-800">{response.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <div className="flex items-center">
                              <FaUser className="mr-1" />
                              {response.responder?.name || 'Unknown'}
                              {response.isInstructor && (
                                <span className="ml-1 px-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  Instructor
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <FaClock className="mr-1" />
                              {format(new Date(response.createdAt), 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {doubt.status !== 'resolved' && doubt.status !== 'closed' && (
                    <div className="space-y-4">
                      <div>
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Write your response..."
                          className="w-full p-3 border rounded focus:ring-primary focus:border-primary"
                          rows="3"
                        />
                      </div>
                      <div className="flex justify-between">
                        <div>
                          {(user?.role === 'instructor' || user?.role === 'admin' || 
                            doubt.student?._id === user?._id) && doubt.status !== 'resolved' && (
                            <Button
                              variant="secondary"
                              onClick={() => handleResolveDoubt(doubt._id)}
                            >
                              Mark as Resolved
                            </Button>
                          )}
                        </div>
                        <Button onClick={() => handleSubmitReply(doubt._id)}>
                          <FaReply className="mr-2" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Ask Doubt Modal */}
      {showAskDoubtModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Ask a Doubt</h2>
            <form onSubmit={handleSubmitDoubt}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course (Optional)
                  </label>
                  <select
                    value={newDoubt.courseId}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  >
                    <option value="">General Doubt</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newDoubt.category}
                      onChange={(e) => setNewDoubt(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    >
                      <option value="general">General</option>
                      <option value="concept">Concept</option>
                      <option value="technical">Technical</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newDoubt.priority}
                      onChange={(e) => setNewDoubt(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newDoubt.title}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newDoubt.description}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    rows="4"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowAskDoubtModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}