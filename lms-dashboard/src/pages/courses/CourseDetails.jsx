import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlay, FaFile, FaQuestionCircle, FaTasks, FaEdit, FaPlus } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const isInstructor = user?.role === 'instructor';
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Progress state
  const [progress, setProgress] = useState({
    lessonsCompleted: 0,
    totalLessons: 0,
    quizzesCompleted: 0,
    totalQuizzes: 0,
    assessmentsCompleted: 0,
    totalAssessments: 0,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getCourseById(id);
        setCourse(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load course';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.getChapters({ courseId: id });
        setChapters(response.data.chapters || []);
      } catch (err) {
        console.error('Failed to fetch chapters:', err);
      }
    };

    if (id) {
      fetchChapters();
    }
  }, [id]);

  // Fetch progress info from backend
  useEffect(() => {
    if (!user || !course) return;

    const fetchProgress = async () => {
      try {
        const response = await api.getCourseProgress(id);
        const { lessons, quizzes, assessments } = response.data;

        setProgress({
          lessonsCompleted: lessons.completed,
          totalLessons: lessons.total,
          quizzesCompleted: quizzes.completed,
          totalQuizzes: quizzes.total,
          assessmentsCompleted: assessments.completed,
          totalAssessments: assessments.total,
        });
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      }
    };

    fetchProgress();
  }, [id, user, course]);

  // Calculate overall completion percentage
  const totalItems =
    progress.totalLessons + progress.totalQuizzes + progress.totalAssessments;
  const totalCompleted =
    progress.lessonsCompleted + progress.quizzesCompleted + progress.assessmentsCompleted;
  const completionPercent =
    totalItems === 0 ? 0 : Math.round((totalCompleted / totalItems) * 100);

  const handleAddChapter = () => {
    navigate(`/courses/${id}/chapters/create`);
  };

  const handleEnroll = async () => {
    try {
      await api.enrollInCourse(id);
      toast.success('Successfully enrolled in course!');
      // Refresh course data
      const response = await api.getCourseById(id);
      setCourse(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to enroll';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading course details...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!course) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>By {course.instructor}</span>
              <span>•</span>
              <span>{course.duration}</span>
              <span>•</span>
              <span>{course.lessons} lessons</span>
              <span>•</span>
              <span>{course.enrolled} students</span>
            </div>
            {!isInstructor && (
              <button
                onClick={handleEnroll}
                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Enroll Now
              </button>
            )}
          </div>
          {isInstructor && (
            <Link
              to={`/courses/${id}/edit`}
              className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              <FaEdit className="mr-2" />
              Edit Course
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'curriculum'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  Curriculum
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                  <div 
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: course.content || course.description }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Chapters</h2>
                    {isInstructor && (
                      <button
                        onClick={handleAddChapter}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                      >
                        <FaPlus className="mr-2" />
                        Add Chapter
                      </button>
                    )}
                  </div>
                  {chapters.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No chapters available yet.</p>
                    </div>
                  ) : (
                    chapters.map((chapter) => (
                      <div key={chapter._id} className="border rounded-lg">
                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                          <h3 className="font-medium">{chapter.title}</h3>
                          {isInstructor && (
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
                            </div>
                          )}
                        </div>
                        <div className="divide-y">
                          {chapter.lessons?.map((lesson) => (
                            <div
                              key={lesson._id}
                              className="p-4 flex items-center justify-between hover:bg-gray-50"
                            >
                              <Link
                                to={`/lessons/${lesson._id}`}
                                className="flex items-center flex-1"
                              >
                                <FaPlay className="text-primary mr-3" />
                                <span>{lesson.title}</span>
                              </Link>
                              <div className="flex items-center space-x-4">
                                {lesson.duration && (
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                )}
                                {isInstructor && (
                                  <Link
                                    to={`/lessons/${lesson._id}/edit`}
                                    className="text-primary hover:text-primary/90"
                                  >
                                    <FaEdit />
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completion</span>
                <span>{completionPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <FaPlay className="mr-2 text-gray-500" />
                <span>
                  {progress.lessonsCompleted}/{progress.totalLessons} lessons completed
                </span>
              </div>
              <div className="flex items-center text-sm">
                <FaQuestionCircle className="mr-2 text-gray-500" />
                <span>
                  {progress.quizzesCompleted}/{progress.totalQuizzes} quizzes completed
                </span>
              </div>
              <div className="flex items-center text-sm">
                <FaTasks className="mr-2 text-gray-500" />
                <span>
                  {progress.assessmentsCompleted}/{progress.totalAssessments} assignments
                  submitted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}