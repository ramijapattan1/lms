import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Card from '../../components/common/Card';
import { api } from '../../services/api';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    startDate: '',
    endDate: '',
    courseId: '',
    questions: [],
    settings: {
      allowMultipleAttempts: false,
      maxAttempts: 1,
      showResults: true,
      shuffleQuestions: false,
      shuffleOptions: false
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: '',
    points: 1
  });

  const handleQuizDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      setQuizData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setQuizData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? { ...opt, text: value } : opt)
    }));
  };

  const handleCorrectAnswerToggle = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index ? !opt.isCorrect : false // Only one correct answer
      }))
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt.text)) {
      toast.error('Please fill all question fields');
      return;
    }

    if (!currentQuestion.options.some(opt => opt.isCorrect)) {
      toast.error('Please select at least one correct answer');
      return;
    }

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      question: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      explanation: '',
      points: 1
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

    setLoading(true);
    try {
      await api.createQuiz(quizData);
      toast.success('Quiz created successfully!');
      navigate('/quiz');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create quiz';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>
      
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
                Time Limit (minutes)
              </label>
              <input
                type="number"
                name="timeLimit"
                value={quizData.timeLimit}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
                min="1"
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
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={quizData.description}
                onChange={handleQuizDataChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                rows="3"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Quiz Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.allowMultipleAttempts"
                  checked={quizData.settings.allowMultipleAttempts}
                  onChange={handleQuizDataChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Allow Multiple Attempts
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.showResults"
                  checked={quizData.settings.showResults}
                  onChange={handleQuizDataChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Show Results After Submission
                </label>
              </div>

              {quizData.settings.allowMultipleAttempts && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Attempts
                  </label>
                  <input
                    type="number"
                    name="settings.maxAttempts"
                    value={quizData.settings.maxAttempts}
                    onChange={handleQuizDataChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    min="1"
                  />
                </div>
              )}
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
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Options (click to mark as correct)
              </label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectAnswerToggle(index)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 p-2 border rounded focus:ring-primary focus:border-primary"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation (optional)
                </label>
                <textarea
                  name="explanation"
                  value={currentQuestion.explanation}
                  onChange={handleQuestionChange}
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  rows="2"
                  placeholder="Explain the correct answer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  name="points"
                  value={currentQuestion.points}
                  onChange={handleQuestionChange}
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  min="1"
                />
              </div>
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
                    <div className="flex-1">
                      <p className="font-medium mb-2">{q.question}</p>
                      <ul className="space-y-1">
                        {q.options.map((opt, i) => (
                          <li key={i} className={`flex items-center ${opt.isCorrect ? 'text-green-600 font-medium' : ''}`}>
                            {opt.isCorrect ? '✓' : '•'} {opt.text}
                          </li>
                        ))}
                      </ul>
                      {q.explanation && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Points: {q.points}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-700 ml-4"
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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}