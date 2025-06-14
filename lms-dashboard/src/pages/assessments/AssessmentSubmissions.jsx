import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaDownload, FaGithub, FaCheck, FaTimes, FaLink, FaFileAlt } from 'react-icons/fa';
import Card from '../../components/common/Card';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function AssessmentSubmissions() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ points: '', feedback: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assessment details
        const assessmentResponse = await api.getAssessmentById(id);
        setAssessment(assessmentResponse.data);

        // Fetch submissions
        const submissionsResponse = await api.getAssessmentSubmissions(id);
        setSubmissions(submissionsResponse.data.submissions || []);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleGrade = async (submissionId) => {
    if (!gradeData.points || gradeData.points < 0 || gradeData.points > assessment.maxPoints) {
      toast.error(`Points must be between 0 and ${assessment.maxPoints}`);
      return;
    }

    try {
      await api.gradeSubmission(id, submissionId, gradeData);
      toast.success('Submission graded successfully!');
      
      // Refresh submissions
      const submissionsResponse = await api.getAssessmentSubmissions(id);
      setSubmissions(submissionsResponse.data.submissions || []);
      
      setGradingSubmission(null);
      setGradeData({ points: '', feedback: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to grade submission';
      toast.error(errorMessage);
    }
  };

  const renderSubmissionContent = (submission) => {
    const { content } = submission;
    
    if (content.text) {
      return (
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex items-center mb-2">
            <FaFileAlt className="mr-2 text-gray-500" />
            <span className="font-medium">Text Submission</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{content.text}</p>
        </div>
      );
    }
    
    if (content.fileUrl && content.fileName) {
      return (
        <div className="flex items-center space-x-2">
          <FaDownload className="text-primary" />
          <a
            href={content.fileUrl}
            download={content.fileName}
            className="text-primary hover:text-primary/90"
          >
            {content.fileName}
          </a>
        </div>
      );
    }
    
    if (content.githubUrl) {
      return (
        <div className="flex items-center space-x-2">
          <FaGithub className="text-primary" />
          <a
            href={content.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/90"
          >
            View Repository
          </a>
        </div>
      );
    }
    
    if (content.websiteUrl) {
      return (
        <div className="flex items-center space-x-2">
          <FaLink className="text-primary" />
          <a
            href={content.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/90"
          >
            View Website
          </a>
        </div>
      );
    }
    
    return <span className="text-gray-500">No content available</span>;
  };

  if (loading) {
    return <div className="p-4 md:p-6 text-center">Loading submissions...</div>;
  }

  if (!assessment) {
    return <div className="p-4 md:p-6 text-center">Assessment not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">{assessment.title} - Submissions</h1>
        <p className="text-gray-600">Total Submissions: {submissions.length}</p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No submissions yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map(submission => (
            <Card key={submission._id}>
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{submission.student?.name || 'Unknown Student'}</h3>
                    <p className="text-sm text-gray-500">
                      {submission.student?.email || 'No email'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                    {submission.isLate && (
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded mt-1">
                        Late Submission
                      </span>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.status === 'graded'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {submission.status === 'graded' ? 'Graded' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Submission Content:</h4>
                  {renderSubmissionContent(submission)}
                </div>

                {submission.status === 'graded' && submission.grade ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Grade:</span>
                      <span className="text-lg font-bold text-green-600">
                        {submission.grade.points}/{assessment.maxPoints}
                      </span>
                    </div>
                    {submission.grade.feedback && (
                      <div>
                        <span className="font-medium">Feedback:</span>
                        <p className="text-gray-700 mt-1">{submission.grade.feedback}</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Graded on: {new Date(submission.grade.gradedAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {gradingSubmission === submission._id ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Grade Submission</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Points (out of {assessment.maxPoints})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={assessment.maxPoints}
                              value={gradeData.points}
                              onChange={(e) => setGradeData(prev => ({ ...prev, points: e.target.value }))}
                              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Feedback (optional)
                            </label>
                            <textarea
                              value={gradeData.feedback}
                              onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                              rows="3"
                              placeholder="Provide feedback to the student..."
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <button
                            onClick={() => handleGrade(submission._id)}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                          >
                            Submit Grade
                          </button>
                          <button
                            onClick={() => {
                              setGradingSubmission(null);
                              setGradeData({ points: '', feedback: '' });
                            }}
                            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setGradingSubmission(submission._id)}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                      >
                        Grade Submission
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}