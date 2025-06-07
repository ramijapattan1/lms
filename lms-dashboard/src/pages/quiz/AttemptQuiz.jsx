import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaClock } from 'react-icons/fa';

export default function AttemptQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, fetch quiz data from API
    const mockQuiz = {
      id,
      title: 'JavaScript Fundamentals Quiz',
      duration: 30, // minutes
      questions: [
        {
          id: '1',
          question: 'What is JavaScript?',
          options: [
            'A programming language',
            'A markup language',
            'A styling language',
            'A database'
          ],
          isMultiple: false
        },
        {
          id: '2',
          question: 'Which of these are valid JavaScript data types?',
          options: [
            'String',
            'Number',
            'Boolean',
            'All of the above'
          ],
          isMultiple: true
        }
      ]
    };

    setQuiz(mockQuiz);
    setTimeLeft(mockQuiz.duration * 60);
    setLoading(false);
  }, [id]);

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

  const handleAnswerChange = (questionId, optionIndex, isMultiple) => {
    if (isMultiple) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [optionIndex]: !prev[questionId]?.[optionIndex]
        }
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: { [optionIndex]: true }
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // In a real implementation, submit answers to API
      toast.success('Quiz submitted successfully!');
      navigate('/quiz');
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
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
        </div>

        <div className="p-6 space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <p className="font-medium">
                {index + 1}. {question.question}
              </p>
              <div className="space-y-2 pl-6">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type={question.isMultiple ? "checkbox" : "radio"}
                      name={`question-${question.id}`}
                      checked={answers[question.id]?.[optionIndex] || false}
                      onChange={() => handleAnswerChange(question.id, optionIndex, question.isMultiple)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}