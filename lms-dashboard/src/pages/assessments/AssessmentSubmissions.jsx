import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaDownload, FaGithub, FaCheck, FaTimes } from 'react-icons/fa';
import Card from '../../components/common/Card';

export default function AssessmentSubmissions() {
  const { id } = useParams();
  const [submissions] = useState([
    {
      id: '1',
      student: 'John Doe',
      submittedAt: '2025-03-15T10:00:00Z',
      type: 'file',
      fileName: 'project.zip',
      status: 'pending',
      score: null
    },
    {
      id: '2',
      student: 'Jane Smith',
      submittedAt: '2025-03-14T15:30:00Z',
      type: 'github',
      repoUrl: 'https://github.com/janesmith/project',
      status: 'graded',
      score: 85
    }
  ]);

  const handleGrade = (submissionId, score) => {
    // Implementation for grading
    console.log('Grading submission:', submissionId, score);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Assessment Submissions</h1>

      <div className="space-y-6">
        {submissions.map(submission => (
          <Card key={submission.id}>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{submission.student}</h3>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    submission.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {submission.status === 'pending' ? 'Pending' : 'Graded'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {submission.type === 'file' ? (
                  <button className="flex items-center text-primary hover:text-primary/90">
                    <FaDownload className="mr-2" />
                    {submission.fileName}
                  </button>
                ) : (
                  <a
                    href={submission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary/90"
                  >
                    <FaGithub className="mr-2" />
                    View Repository
                  </a>
                )}
              </div>

              {submission.status === 'pending' ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Score (out of 100)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-24 p-2 border rounded focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={() => handleGrade(submission.id, 85)}
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                    >
                      Submit Grade
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-lg">
                  <span className="font-medium">Score:</span>
                  <span className="text-primary">{submission.score}/100</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}