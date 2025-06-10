import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaClock } from 'react-icons/fa';
import { api } from '../../services/api';

export default function AttemptQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(new Date());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.getQuizById(id);
        const quizData = response.data;
        setQuiz(quizData);
        setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load quiz';
        toast.error(errorMessage);
        navigate('/quiz');
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const endTime = new Date();
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const attemptData = {
        answers: formattedAnswers,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      const response = await api.submitQuizAttempt(id, attemptData);
      toast.success('Quiz submitted successfully!');
      
      // Navigate to results page with the result data
      navigate(`/quiz/${id}/results`, { 
        state: { 
          result: response.data,
          quiz: quiz
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit quiz';
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="flex justify-center items-center h-96">Quiz not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <div className="flex items-center text-lg font-medium text-primary">
              <FaClock className="mr-2" />
              {formatTime(timeLeft)}
            </div>
          </div>
          {quiz.description && (
            <p className="text-gray-600 mt-2">{quiz.description}</p>
          )}
        </div>

        <div className="p-6 space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <p className="font-medium text-lg">
                {index + 1}. {question.question}
              </p>
              <div className="space-y-2 pl-6">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => handleAnswerChange(question.id, optionIndex)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Questions answered: {Object.keys(answers).length} / {quiz.questions.length}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}