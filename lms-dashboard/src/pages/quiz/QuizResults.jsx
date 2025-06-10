import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function QuizResults() {
  const { id } = useParams();
  const location = useLocation();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Check if results were passed from the attempt page
        if (location.state?.result) {
          const { result, quiz } = location.state;
          setResults({
            title: quiz.title,
            score: result.percentage,
            totalQuestions: quiz.questions.length,
            correctAnswers: Math.round((result.percentage / 100) * quiz.questions.length),
            timeTaken: formatTime(result.timeSpent),
            passingScore: quiz.passingScore || 70,
            showResults: result.showResults
          });
        } else {
          // Fetch results from API
          const response = await api.getQuizResults(id);
          const userAttempts = response.data;
          
          if (userAttempts.length > 0) {
            const latestAttempt = userAttempts[userAttempts.length - 1];
            setResults({
              title: 'Quiz Results',
              score: latestAttempt.percentage,
              totalQuestions: latestAttempt.answers?.length || 0,
              correctAnswers: latestAttempt.answers?.filter(a => a.isCorrect).length || 0,
              timeTaken: formatTime(latestAttempt.timeSpent),
              passingScore: 70,
              showResults: true
            });
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load results';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, location.state]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading results...</div>;
  }

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No quiz results found.</p>
        </div>
      </div>
    );
  }

  const isPassed = results.score >= results.passingScore;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-2">{results.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Total Questions: {results.totalQuestions}</span>
            <span>Correct Answers: {results.correctAnswers}</span>
            <span>Time Taken: {results.timeTaken}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Score</h2>
              <div className={`text-3xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(results.score)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${isPassed ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${results.score}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>0%</span>
              <span className="text-primary">Passing: {results.passingScore}%</span>
              <span>100%</span>
            </div>
            <div className={`text-center mt-4 p-4 rounded-lg ${
              isPassed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {isPassed ? (
                <div className="flex items-center justify-center">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">Congratulations! You passed the quiz!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaTimesCircle className="mr-2" />
                  <span className="font-medium">You did not meet the passing score. Keep practicing!</span>
                </div>
              )}
            </div>
          </div>

          {!results.showResults && (
            <div className="text-center py-8">
              <p className="text-gray-500">Detailed results are not available for this quiz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}