import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaClock, FaCheck } from 'react-icons/fa';
import Card from '../../components/common/Card';

export default function QuizList() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([
    {
      id: '1',
      title: 'JavaScript Fundamentals Quiz',
      description: 'Test your knowledge of JavaScript basics',
      duration: 30,
      questions: 10,
      startDate: '2025-03-20T10:00:00Z',
      endDate: '2025-03-20T18:00:00Z',
      isEnabled: true,
      attempts: 45,
      avgScore: 75
    },
    {
      id: '2',
      title: 'React Hooks Quiz',
      description: 'Advanced quiz on React Hooks',
      duration: 45,
      questions: 15,
      startDate: '2025-03-22T10:00:00Z',
      endDate: '2025-03-22T18:00:00Z',
      isEnabled: false,
      attempts: 30,
      avgScore: 82
    }
  ]);

  useEffect(() => {
    // API fetch would go here to get quizzes
    // const fetchQuizzes = async () => {
    //   try {
    //     const response = await fetch('/api/quizzes');
    //     const data = await response.json();
    //     setQuizzes(data);
    //   } catch (error) {
    //     console.error('Failed to fetch quizzes:', error);
    //   }
    // };
    // fetchQuizzes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>
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

              {user?.role === 'instructor' ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <div>Total Attempts: {quiz.attempts}</div>
                    <div>Average Score: {quiz.avgScore}%</div>
                  </div>
                  <Link
                    to={`/quiz/${quiz.id}/edit`}
                    className="block w-full text-center py-2 text-primary border border-primary rounded hover:bg-primary/10"
                  >
                    Edit Quiz
                  </Link>
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
    </div>
  );
}