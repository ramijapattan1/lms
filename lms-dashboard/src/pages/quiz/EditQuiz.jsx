import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Card from '../../components/common/Card';

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 30,
    startDate: '',
    endDate: '',
    passingScore: 70,
    isEnabled: true,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswers: [],
    isMultiple: false
  });

  useEffect(() => {
    // In a real implementation, fetch quiz data
    setQuizData({
      title: 'JavaScript Fundamentals Quiz',
      description: 'Test your knowledge of JavaScript basics',
      duration: 30,
      startDate: '2025-03-20T10:00',
      endDate: '2025-03-20T18:00',
      passingScore: 70,
      isEnabled: true,
      questions: [
        {
          question: 'What is JavaScript?',
          options: [
            'A programming language',
            'A markup language',
            'A styling language',
            'A database'
          ],
          correctAnswers: [0],
          isMultiple: false
        }
      ]
    });
  }, [id]);

  const handleQuizDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleCorrectAnswerToggle = (index) => {
    setCurrentQuestion(prev => {
      if (prev.isMultiple) {
        const newCorrectAnswers = prev.correctAnswers.includes(index)
          ? prev.correctAnswers.filter(i => i !== index)
          : [...prev.correctAnswers, index];
        return { ...prev, correctAnswers: newCorrectAnswers };
      }
      return { ...prev, correctAnswers: [index] };
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt) || !currentQuestion.correctAnswers.length) {
      toast.error('Please fill all question fields');
      return;
    }

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswers: [],
      isMultiple: false
    });
  };

  const removeQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quizData.questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }

    try {
      // API call would go here
      toast.success('Quiz updated successfully!');
      navigate('/quiz');
    } catch (error) {
      toast.error('Failed to update quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Quiz</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Quiz Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={quizData.duration}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={quizData.startDate}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={quizData.endDate}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                name="passingScore"
                value={quizData.passingScore}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isEnabled"
                checked={quizData.isEnabled}
                onChange={handleQuizDataChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Enable Quiz
              </label>
            </div>
          </div>
        </Card>

        <Card title="Add Question">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isMultiple"
                checked={currentQuestion.isMultiple}
                onChange={handleQuestionChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Multiple correct answers
              </label>
            </div>

            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type={currentQuestion.isMultiple ? "checkbox" : "radio"}
                    checked={currentQuestion.correctAnswers.includes(index)}
                    onChange={() => handleCorrectAnswerToggle(index)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 p-2 border rounded focus:ring-primary focus:border-primary"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              <FaPlus className="mr-2" />
              Add Question
            </button>
          </div>
        </Card>

        {quizData.questions.length > 0 && (
          <Card title={`Questions (${quizData.questions.length})`}>
            <div className="space-y-4">
              {quizData.questions.map((q, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{q.question}</p>
                      <ul className="mt-2 space-y-1">
                        {q.options.map((opt, i) => (
                          <li key={i} className={`flex items-center ${q.correctAnswers.includes(i) ? 'text-green-600' : ''}`}>
                            {q.correctAnswers.includes(i) ? '✓' : '•'} {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/quiz')}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Update Quiz
          </button>
        </div>
      </form>
    </div>
  );
}