import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaList, FaQuestion } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAskDoubtModal, setShowAskDoubtModal] = useState(false);
  const [doubt, setDoubt] = useState('');
  const [upcomingLessons, setUpcomingLessons] = useState([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await api.getLessonById(lessonId);
        setLesson(response.data);
        
        // Fetch other lessons from the same chapter
        if (response.data.chapter) {
          const chaptersResponse = await api.getChapters({ courseId: response.data.course._id });
          const chapters = chaptersResponse.data.chapters || [];
          const currentChapter = chapters.find(c => c._id === response.data.chapter._id);
          
          if (currentChapter && currentChapter.lessons) {
            const otherLessons = currentChapter.lessons.filter(l => l._id !== lessonId);
            setUpcomingLessons(otherLessons);
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load lesson';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    if (!doubt.trim()) return;

    try {
      const doubtData = {
        title: `Question about: ${lesson.title}`,
        description: doubt,
        courseId: lesson.course._id,
        category: 'concept'
      };

      await api.createDoubt(doubtData);
      toast.success('Doubt submitted successfully!');
      setShowAskDoubtModal(false);
      setDoubt('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit doubt';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading lesson...</div>;
  }

  if (!lesson) {
    return <div className="p-6 text-center">Lesson not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              {lesson.videoUrl ? (
                <ReactPlayer
                  url={lesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-100">
                  <p className="text-gray-500">No video available for this lesson</p>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{lesson.title}</h1>
                <div className="flex space-x-4">
                  {user?.role === 'student' && (
                    <button
                      onClick={() => setShowAskDoubtModal(true)}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      <FaQuestion className="mr-2" />
                      Ask Doubt
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4">{lesson.description}</p>

              {lesson.course && (
                <div className="mb-4 text-sm text-gray-600">
                  Course: {lesson.course.title}
                </div>
              )}

              {lesson.chapter && (
                <div className="mb-4 text-sm text-gray-600">
                  Chapter: {lesson.chapter.title}
                </div>
              )}

              {lesson.duration && (
                <div className="mb-6 text-sm text-gray-600">
                  Duration: {lesson.duration}
                </div>
              )}

              {lesson.resources && lesson.resources.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Resources</h2>
                  <div className="space-y-2">
                    {lesson.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded hover:bg-gray-50"
                      >
                        <span className="text-primary mr-2">
                          {resource.type === 'pdf' ? '📄' : resource.type === 'code' ? '💻' : '🔗'}
                        </span>
                        <span>{resource.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FaList className="text-primary mr-2" />
            <h2 className="text-lg font-semibold">Other Lessons</h2>
          </div>

          <div className="space-y-3">
            {upcomingLessons.length > 0 ? (
              upcomingLessons.map(lessonItem => (
                <a
                  key={lessonItem._id}
                  href={`/lessons/${lessonItem._id}`}
                  className="block p-3 border rounded hover:bg-gray-50"
                >
                  <h3 className="font-medium">{lessonItem.title}</h3>
                  {lessonItem.duration && (
                    <p className="text-sm text-gray-500">Duration: {lessonItem.duration}</p>
                  )}
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No other lessons available</p>
            )}
          </div>
        </div>
      </div>

      {showAskDoubtModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Ask a Doubt</h2>
            <form onSubmit={handleSubmitDoubt}>
              <textarea
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
                placeholder="Type your question here..."
                className="w-full p-3 border rounded mb-4 h-32"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAskDoubtModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}