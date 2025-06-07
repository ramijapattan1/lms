import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlay, FaFile, FaQuestionCircle, FaTasks, FaEdit, FaPlus } from 'react-icons/fa';
import axios from 'axios';

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const isInstructor = user?.role === 'instructor';
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: Progress state
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
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // NEW: Fetch progress info from backend
  useEffect(() => {
    if (!user) return; // no need if no user logged in

    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/${id}/full-progress`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // if your API uses JWT token auth
            },
          }
        );

        const { lessons, quizzes, assessments } = res.data;

        setProgress({
          lessonsCompleted: lessons.completed,
          totalLessons: lessons.total,
          quizzesCompleted: quizzes.completed,
          totalQuizzes: quizzes.total,
          assessmentsCompleted: assessments.completed,
          totalAssessments: assessments.total,
        });
      } catch (err) {
        // Optionally handle error (e.g., console.log or show UI)
        console.error('Failed to fetch progress:', err);
      }
    };

    fetchProgress();
  }, [id, user]);

  // Calculate overall completion percentage (based on lessons, quizzes, assessments)
  const totalItems =
    progress.totalLessons + progress.totalQuizzes + progress.totalAssessments;
  const totalCompleted =
    progress.lessonsCompleted + progress.quizzesCompleted + progress.assessmentsCompleted;
  const completionPercent =
    totalItems === 0 ? 0 : Math.round((totalCompleted / totalItems) * 100);

  const handleAddChapter = (chapterId) => {
    navigate(`/courses/${id}/chapters/${chapterId}/lessons/create`);
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
                  <p className="text-gray-600">{course.description}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Chapters</h2>
                    {isInstructor && (
                      <Link
                        to={`/courses/${id}/chapters/create`}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                      >
                        <FaPlus className="mr-2" />
                        Add Chapter
                      </Link>
                    )}
                  </div>
                  {course.chapters?.map((chapter) => (
                    <div key={chapter.id} className="border rounded-lg">
                      <div className="p-4 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-medium">{chapter.title}</h3>
                        {isInstructor && (
                          <div className="flex space-x-2">
                            <Link
                              to={`/courses/${id}/chapters/${chapter.id}/edit`}
                              className="text-primary hover:text-primary/90"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleAddChapter(chapter.id)}
                              className="text-primary hover:text-primary/90"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="divide-y">
                        {chapter.lessons?.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <Link
                              to={`/courses/${id}/chapters/${chapter.id}/lessons/${lesson.id}`}
                              className="flex items-center flex-1"
                            >
                              {lesson.type === 'video' ? (
                                <FaPlay className="text-primary mr-3" />
                              ) : lesson.type === 'quiz' ? (
                                <FaQuestionCircle className="text-primary mr-3" />
                              ) : (
                                <FaFile className="text-primary mr-3" />
                              )}
                              <span>{lesson.title}</span>
                            </Link>
                            <div className="flex items-center space-x-4">
                              {lesson.duration && (
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              )}
                              {isInstructor && (
                                <Link
                                  to={`/courses/${id}/chapters/${chapter.id}/lessons/${lesson.id}/edit`}
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
                  ))}
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
