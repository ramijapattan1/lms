import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaGithub, FaUpload, FaLink, FaFileAlt } from 'react-icons/fa';
import { api } from '../../services/api';

export default function SubmitAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    githubUrl: '',
    websiteUrl: ''
  });

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await api.getAssessmentById(id);
        setAssessment(response.data);
        
        // Check if already submitted
        if (response.data.submissions && response.data.submissions.length > 0) {
          toast.info('You have already submitted this assessment');
          navigate('/assessments');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load assessment';
        toast.error(errorMessage);
        navigate('/assessments');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssessment();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (assessment.maxFileSize && file.size > assessment.maxFileSize * 1024 * 1024) {
        toast.error(`File size must be less than ${assessment.maxFileSize}MB`);
        return;
      }

      // Check file type
      if (assessment.allowedFileTypes && assessment.allowedFileTypes.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!assessment.allowedFileTypes.includes(fileExtension)) {
          toast.error(`File type not allowed. Allowed types: ${assessment.allowedFileTypes.join(', ')}`);
          return;
        }
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate based on submission type
    if (assessment.submissionType === 'file' && !selectedFile) {
      toast.error('Please upload a file');
      return;
    }
    
    if (assessment.submissionType === 'text' && !formData.text.trim()) {
      toast.error('Please enter your text submission');
      return;
    }
    
    if (assessment.submissionType === 'url' && !formData.websiteUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    if (assessment.submissionType === 'github' && !formData.githubUrl.trim()) {
      toast.error('Please enter a GitHub repository URL');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      
      if (assessment.submissionType === 'file') {
        submitData.append('file', selectedFile);
      } else if (assessment.submissionType === 'text') {
        submitData.append('text', formData.text);
      } else if (assessment.submissionType === 'url') {
        submitData.append('websiteUrl', formData.websiteUrl);
      } else if (assessment.submissionType === 'github') {
        submitData.append('githubUrl', formData.githubUrl);
      }

      await api.submitAssessment(id, submitData);
      toast.success('Assessment submitted successfully!');
      navigate('/assessments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit assessment';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 md:p-6 text-center">Loading assessment...</div>;
  }

  if (!assessment) {
    return <div className="p-4 md:p-6 text-center">Assessment not found</div>;
  }

  const isLate = new Date() > new Date(assessment.dueDate);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 md:p-6 border-b">
          <h1 className="text-xl md:text-2xl font-bold mb-2">{assessment.title}</h1>
          <p className="text-gray-600 mb-4">{assessment.description}</p>
          <div className="space-y-2 text-sm">
            <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${isLate ? 'text-red-600' : 'text-gray-500'}`}>
              <span className="font-medium">Due:</span>
              <span>{new Date(assessment.dueDate).toLocaleString()}</span>
              {isLate && (
                <span className="text-red-600 font-medium">(Late Submission)</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-500">
              <span className="font-medium">Max Points:</span>
              <span>{assessment.maxPoints}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-500">
              <span className="font-medium">Type:</span>
              <span className="capitalize">{assessment.type}</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Instructions</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{assessment.instructions}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {assessment.submissionType === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFileAlt className="inline mr-2" />
                  Your Submission
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows="10"
                  className="w-full p-3 border rounded focus:ring-primary focus:border-primary"
                  placeholder="Enter your submission here..."
                  required
                />
              </div>
            )}

            {assessment.submissionType === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUpload className="inline mr-2" />
                  Upload File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="sr-only"
                          accept={assessment.allowedFileTypes?.join(',')}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {assessment.allowedFileTypes?.join(', ')} up to {assessment.maxFileSize}MB
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {assessment.submissionType === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLink className="inline mr-2" />
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full p-3 border rounded focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            )}

            {assessment.submissionType === 'github' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGithub className="inline mr-2" />
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repository"
                  className="w-full p-3 border rounded focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            )}

            {isLate && assessment.allowLateSubmission && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Late Submission Notice:</strong> This submission is past the due date. 
                  A {assessment.latePenalty}% penalty per day may be applied.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => navigate('/assessments')}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}