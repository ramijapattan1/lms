import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaClock, FaReply } from 'react-icons/fa';
import { format } from 'date-fns';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function DoubtBox() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [showAskDoubtModal, setShowAskDoubtModal] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [newDoubt, setNewDoubt] = useState({
    title: '',
    content: '',
    courseId: '',
    lessonId: ''
  });
  const [reply, setReply] = useState('');

  // Mock enrolled courses for the student
  const enrolledCourses = [
    { id: '1', title: 'Complete Web Development Bootcamp', instructor: 'John Doe' },
    { id: '2', title: 'Advanced React Patterns', instructor: 'Jane Smith' }
  ];

  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    // Add the new doubt to the list
    const doubt = {
      id: Date.now().toString(),
      ...newDoubt,
      student: user.name,
      createdAt: new Date().toISOString(),
      status: 'pending',
      replies: []
    };
    setDoubts(prev => [doubt, ...prev]);
    setShowAskDoubtModal(false);
    setNewDoubt({ title: '', content: '', courseId: '', lessonId: '' });
  };

  const handleSubmitReply = (doubtId) => {
    if (!reply.trim()) return;

    setDoubts(prev => prev.map(doubt => {
      if (doubt.id === doubtId) {
        return {
          ...doubt,
          status: 'answered',
          replies: [...doubt.replies, {
            id: Date.now().toString(),
            content: reply,
            author: user.name,
            createdAt: new Date().toISOString()
          }]
        };
      }
      return doubt;
    }));
    setReply('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doubt Box</h1>
        {user?.role === 'student' && (
          <Button onClick={() => setShowAskDoubtModal(true)}>
            Ask a Doubt
          </Button>
        )}
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
            <Card key={doubt.id}>
              <div 
                className="cursor-pointer"
                onClick={() => setSelectedDoubt(selectedDoubt?.id === doubt.id ? null : doubt)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{doubt.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center">
                        <FaUser className="mr-1" />
                        {doubt.student}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {format(new Date(doubt.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    doubt.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {doubt.status === 'pending' ? 'Pending' : 'Answered'}
                  </span>
                </div>
              </div>

              {selectedDoubt?.id === doubt.id && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-700 mb-4">{doubt.content}</p>

                  {doubt.replies.length > 0 && (
                    <div className="space-y-4 mb-4">
                      {doubt.replies.map(reply => (
                        <div key={reply.id} className="bg-gray-50 p-4 rounded">
                          <p className="text-gray-800">{reply.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <div className="flex items-center">
                              <FaUser className="mr-1" />
                              {reply.author}
                            </div>
                            <div className="flex items-center">
                              <FaClock className="mr-1" />
                              {format(new Date(reply.createdAt), 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {((user?.role === 'instructor') || 
                   (user?.role === 'student' && doubt.student === user.name)) && (
                    <div className="mt-4">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full p-3 border rounded focus:ring-primary focus:border-primary"
                        rows="3"
                      />
                      <div className="flex justify-end mt-2">
                        <Button onClick={() => handleSubmitReply(doubt.id)}>
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

      {showAskDoubtModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Ask a Doubt</h2>
            <form onSubmit={handleSubmitDoubt}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select
                    value={newDoubt.courseId}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select a course</option>
                    {enrolledCourses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
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
                    value={newDoubt.content}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, content: e.target.value }))}
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