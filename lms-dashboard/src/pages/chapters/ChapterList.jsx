import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaVideo, FaFile, FaQuestionCircle, FaTasks, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function ChapterList() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getChapters({ courseId });
        setChapters(response.data.chapters || []);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load chapters';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchChapters();
    }
  }, [courseId]);

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Are you sure you want to delete this chapter? This will also delete all lessons in this chapter.')) {
      return;
    }

    try {
      await api.deleteChapter(chapterId);
      toast.success('Chapter deleted successfully!');
      
      // Refresh chapters
      const response = await api.getChapters({ courseId });
      setChapters(response.data.chapters || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete chapter';
      toast.error(errorMessage);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo />;
      case 'resource':
        return <FaFile />;
      case 'quiz':
        return <FaQuestionCircle />;
      case 'assessment':
        return <FaTasks />;
      default:
        return <FaFile />;
    }
  };

  if (loading) return <div className="p-6 text-center">Loading chapters...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Chapters</h1>
        {user?.role === 'instructor' && (
          <Link
            to={`/courses/${courseId}/chapters/create`}
            className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            <FaPlus className="mr-2" />
            Add Chapter
          </Link>
        )}
      </div>
      
      {chapters.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No chapters available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {chapters.map((chapter, index) => (
            <div key={chapter._id} className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Chapter {index + 1}: {chapter.title}
                    </h2>
                    <p className="text-gray-600">{chapter.description}</p>
                  </div>
                  {user?.role === 'instructor' && (
                    <div className="flex space-x-2">
                      <Link
                        to={`/chapters/${chapter._id}/edit`}
                        className="text-primary hover:text-primary/90"
                      >
                        <FaEdit />
                      </Link>
                      <Link
                        to={`/lessons/create?chapterId=${chapter._id}`}
                        className="text-primary hover:text-primary/90"
                      >
                        <FaPlus />
                      </Link>
                      <button
                        onClick={() => handleDeleteChapter(chapter._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="divide-y">
                {chapter.lessons && chapter.lessons.length > 0 ? (
                  chapter.lessons.map(lesson => (
                    <Link
                      key={lesson._id}
                      to={`/lessons/${lesson._id}`}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 block"
                    >
                      <div className="flex items-center">
                        <span className="text-primary mr-3">
                          <FaVideo />
                        </span>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          {lesson.duration && (
                            <span className="text-sm text-gray-500">
                              Duration: {lesson.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {user?.role === 'instructor' && (
                          <Link
                            to={`/lessons/${lesson._id}/edit`}
                            className="text-primary hover:text-primary/90 mr-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEdit />
                          </Link>
                        )}
                        <span className="text-primary">View</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No lessons in this chapter yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}