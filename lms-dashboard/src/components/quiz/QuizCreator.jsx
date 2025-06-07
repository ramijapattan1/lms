import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Button from '../common/Button';
import Card from '../common/Card';

export default function QuizCreator() {
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
      alert('Please fill all question fields and select correct answer(s)');
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
      alert('Add at least one question');
      return;
    }

    try {
      // API call would go here
      console.log('Quiz data:', quizData);
      navigate('/quiz');
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  return (
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

          <Button
            type="button"
            onClick={addQuestion}
            className="flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Question
          </Button>
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
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/quiz')}
        >
          Cancel
        </Button>
        <Button type="submit">
          Create Quiz
        </Button>
      </div>
    </form>
  );
}