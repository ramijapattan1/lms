import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function QuizResults() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [results, setResults] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Check if results were passed from the attempt page
        if (location.state?.result) {
          const { result, quiz, isMockAttempt } = location.state;
          setResults({
            title: quiz.title,
            score: result.percentage,
            totalQuestions: quiz.questions.length,
            correctAnswers: result.answers ? result.answers.filter(a => a.isCorrect).length : Math.round((result.percentage / 100) * quiz.questions.length),
            timeTaken: formatTime(result.timeSpent),
            passingScore: quiz.passingScore || 70,
            showResults: result.showResults,
            answers: result.answers || null,
            isMockAttempt: isMockAttempt || false
          });
          setShowDetailedResults(result.answers && result.answers.length > 0);
        } else {
          // Fetch results from API
          const response = await api.getQuizResults(id);
          const userAttempts = response.data;
          
          if (user?.role === 'instructor') {
            // For instructors, show all student results
            setAllResults(userAttempts);
          } else if (userAttempts.length > 0) {
            // For students, show their latest attempt
            const latestAttempt = userAttempts[userAttempts.length - 1];
            setResults({
              title: 'Quiz Results',
              score: latestAttempt.percentage,
              totalQuestions: latestAttempt.answers?.length || 0,
              correctAnswers: latestAttempt.answers?.filter(a => a.isCorrect).length || 0,
              timeTaken: formatTime(latestAttempt.timeSpent),
              passingScore: 70,
              showResults: true,
              answers: latestAttempt.answers || null
            });
            setShowDetailedResults(latestAttempt.answers && latestAttempt.answers.length > 0);
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
  }, [id, location.state, user?.role]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading results...</div>;
  }

  // Instructor view - show all student results
  if (user?.role === 'instructor' && allResults.length > 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold mb-2">Quiz Results - All Students</h1>
            <p className="text-gray-600">Total Submissions: {allResults.length}</p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allResults.map((result, index) => {
                    const isPassed = result.percentage >= 70;
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {result.student?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.student?.email || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.score}/{result.totalPoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {Math.round(result.percentage)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(result.timeSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(result.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isPassed ? (
                            <span className="inline-flex items-center text-green-600">
                              <FaCheckCircle className="mr-1" />
                              Passed
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600">
                              <FaTimesCircle className="mr-1" />
                              Failed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
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
          {results.isMockAttempt && (
            <p className="text-blue-600 mb-2">🧪 Test Results (Not Saved)</p>
          )}
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

          {showDetailedResults && results.answers && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Detailed Results</h3>
              <div className="space-y-6">
                {results.answers.map((answer, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <span className={`flex items-center ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.isCorrect ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      Your answer: Option {answer.selectedOption + 1}
                    </div>
                    
                    {!answer.isCorrect && answer.correctAnswer !== undefined && (
                      <div className="text-sm text-green-600 mb-2">
                        Correct answer: Option {answer.correctAnswer + 1}
                      </div>
                    )}
                    
                    {answer.explanation && (
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        <strong>Explanation:</strong> {answer.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!results.showResults && !showDetailedResults && (
            <div className="text-center py-8">
              <p className="text-gray-500">Detailed results are not available for this quiz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}