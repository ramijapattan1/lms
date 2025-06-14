import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlay, FaFile, FaQuestionCircle, FaTasks, FaEdit, FaPlus, FaUserPlus, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  // Progress state
  const [progress, setProgress] = useState({
    lessonsCompleted: 0,
    totalLessons: 0,
    quizzesCompleted: 0,
    totalQuizzes: 0,
    assessmentsCompleted: 0,
    totalAssessments: 0,
  });

  const isInstructor = user?.role === 'instructor';
  const isOwner = course && user && course.instructorId === user._id;

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

    if (id) {
      fetchCourse();
    }
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
    if (!user || !course || !course.isEnrolled) return;

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
    if (enrolling) return;
    
    setEnrolling(true);
    try {
      await api.enrollInCourse(id);
      toast.success('Successfully enrolled in course!');
      
      // Refresh course data to update enrollment status
      const response = await api.getCourseById(id);
      setCourse(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to enroll';
      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This will also delete all chapters, lessons, quizzes, and assessments associated with it.')) {
      return;
    }

    try {
      await api.deleteCourse(id);
      toast.success('Course deleted successfully!');
      navigate('/courses');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete course';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-4 md:p-6 text-center">Loading course details...</div>;
  if (error) return <div className="p-4 md:p-6 text-center text-red-500">Error: {error}</div>;
  if (!course) return <div className="p-4 md:p-6 text-center">Course not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600 mb-4">
              <span>By {course.instructor}</span>
              <span className="hidden sm:inline">•</span>
              <span>{course.duration}</span>
              <span className="hidden sm:inline">•</span>
              <span>{course.lessons} lessons</span>
              <span className="hidden sm:inline">•</span>
              <span>{course.enrolled} students</span>
              <span className="hidden sm:inline">•</span>
              <span className="capitalize">{course.level}</span>
            </div>
            
            {/* Enrollment Status */}
            {user && !isOwner && (
              <div className="mb-4">
                {course.isEnrolled ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FaCheckCircle className="mr-2" />
                    Enrolled
                  </span>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="inline-flex items-center px-4 md:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <FaUserPlus className="mr-2" />
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            )}
          </div>
          
          {isOwner && (
            <div className="flex gap-2">
              <Link
                to={`/courses/${id}/edit`}
                className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 whitespace-nowrap"
              >
                <FaEdit className="mr-2" />
                Edit Course
              </Link>
              <button
                onClick={handleDeleteCourse}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
              >
                <FaTrash className="mr-2" />
                Delete Course
              </button>
            </div>
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
                  className={`px-4 py-2 font-medium text-sm md:text-base ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-4 py-2 font-medium text-sm md:text-base ${
                    activeTab === 'curriculum'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  Curriculum
                </button>
              </nav>
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'overview' ? (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-4">Course Description</h2>
                  <div 
                    className="text-gray-600 prose max-w-none text-sm md:text-base"
                    dangerouslySetInnerHTML={{ __html: course.content || course.description }}
                  />
                  
                  {course.price > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Course Price</h3>
                      <p className="text-xl md:text-2xl font-bold text-primary">${course.price}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h2 className="text-lg md:text-xl font-semibold">Chapters</h2>
                    {isOwner && (
                      <button
                        onClick={handleAddChapter}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
                      >
                        <FaPlus className="mr-2" />
                        Add Chapter
                      </button>
                    )}
                  </div>
                  {chapters.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No chapters available yet.</p>
                      {isOwner && (
                        <button
                          onClick={handleAddChapter}
                          className="text-primary hover:underline"
                        >
                          Create your first chapter
                        </button>
                      )}
                    </div>
                  ) : (
                    chapters.map((chapter) => (
                      <div key={chapter._id} className="border rounded-lg">
                        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <h3 className="font-medium">{chapter.title}</h3>
                          {isOwner && (
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
                          {chapter.lessons?.length > 0 ? (
                            chapter.lessons.map((lesson) => (
                              <div
                                key={lesson._id}
                                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-gray-50"
                              >
                                <Link
                                  to={`/lessons/${lesson._id}`}
                                  className="flex items-center flex-1"
                                >
                                  <FaPlay className="text-primary mr-3 flex-shrink-0" />
                                  <span className="text-sm md:text-base">{lesson.title}</span>
                                </Link>
                                <div className="flex items-center justify-between sm:justify-end space-x-4">
                                  {lesson.duration && (
                                    <span className="text-xs md:text-sm text-gray-500">{lesson.duration}</span>
                                  )}
                                  {isOwner && (
                                    <Link
                                      to={`/lessons/${lesson._id}/edit`}
                                      className="text-primary hover:text-primary/90"
                                    >
                                      <FaEdit />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No lessons in this chapter yet.
                              {isOwner && (
                                <Link
                                  to={`/lessons/create?chapterId=${chapter._id}`}
                                  className="block mt-2 text-primary hover:underline"
                                >
                                  Add a lesson
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 h-fit">
          {course.isEnrolled || isOwner ? (
            <>
              <h2 className="text-lg md:text-xl font-semibold mb-4">Course Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion</span>
                    <span>{completionPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FaPlay className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>
                      {progress.lessonsCompleted}/{progress.totalLessons} lessons completed
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaQuestionCircle className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>
                      {progress.quizzesCompleted}/{progress.totalQuizzes} quizzes completed
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaTasks className="mr-2 text-gray-500 flex-shrink-0" />
                    <span>
                      {progress.assessmentsCompleted}/{progress.totalAssessments} assignments
                      submitted
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg md:text-xl font-semibold mb-4">Course Info</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons:</span>
                  <span className="font-medium">{course.lessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{course.enrolled}</span>
                </div>
                {course.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-primary">${course.price}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}