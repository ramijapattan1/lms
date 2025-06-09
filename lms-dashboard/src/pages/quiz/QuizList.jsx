import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaClock, FaCheck } from 'react-icons/fa';
import Card from '../../components/common/Card';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function QuizList() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch quizzes
        const quizParams = selectedCourse ? { courseId: selectedCourse } : {};
        const quizResponse = await api.getQuizzes(quizParams);
        setQuizzes(quizResponse.data.quizzes || []);

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
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse, user?.role]);

  if (loading) return <div className="p-6 text-center">Loading quizzes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>
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
          {user?.role === 'instructor' && (
            <Link
              to="/quiz/create"
              className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              <FaPlus className="mr-2" />
              Create Quiz
            </Link>
          )}
        </div>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No quizzes available.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <Card key={quiz.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  <span className={`px-2 py-1 text-sm rounded ${
                    quiz.isEnabled 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {quiz.isEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600">{quiz.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-gray-500" />
                    <span>{quiz.duration} mins</span>
                  </div>
                  <div className="flex items-center">
                    <FaCheck className="mr-2 text-gray-500" />
                    <span>{quiz.questions} questions</span>
                  </div>
                </div>

                {quiz.course && (
                  <div className="text-sm text-gray-600">
                    Course: {quiz.course.title}
                  </div>
                )}

                {user?.role === 'instructor' ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <div>Total Attempts: {quiz.attempts}</div>
                      <div>Average Score: {Math.round(quiz.avgScore)}%</div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/quiz/${quiz.id}/edit`}
                        className="flex-1 text-center py-2 text-primary border border-primary rounded hover:bg-primary/10"
                      >
                        Edit Quiz
                      </Link>
                      <Link
                        to={`/quiz/${quiz.id}/results`}
                        className="flex-1 text-center py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Results
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="block w-full text-center py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Start Quiz
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}