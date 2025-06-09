import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function QuizResults() {
  const { id } = useParams();
  const [results, setResults] = useState({
    title: 'JavaScript Fundamentals Quiz',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    timeTaken: '25:30',
    passingScore: 70,
    questions: [
      {
        question: 'What is JavaScript?',
        userAnswer: 'A programming language',
        correctAnswer: 'A programming language',
        isCorrect: true
      },
      {
        question: 'Which of these are valid JavaScript data types?',
        userAnswer: ['String', 'Number'],
        correctAnswer: ['String', 'Number', 'Boolean'],
        isCorrect: false
      }
    ]
  });

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
              <div className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {results.score}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${isPassed ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${results.score}%` }}
              ></div>
            </div>
            <p className={`text-center mt-2 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {isPassed ? 'Congratulations! You passed!' : 'You did not meet the passing score.'}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Question Review</h2>
            {results.questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        Your Answer:{' '}
                        <span className="text-gray-700">
                          {Array.isArray(question.userAnswer)
                            ? question.userAnswer.join(', ')
                            : question.userAnswer}
                        </span>
                      </p>
                      <p>
                        Correct Answer:{' '}
                        <span className="text-green-600">
                          {Array.isArray(question.correctAnswer)
                            ? question.correctAnswer.join(', ')
                            : question.correctAnswer}
                        </span>
                      </p>
                    </div>
                  </div>
                  {question.isCorrect ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}