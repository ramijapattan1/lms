import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaGithub, FaUpload } from 'react-icons/fa';

export default function SubmitAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    submissionType: 'file',
    githubUrl: '',
    file: null,
    comments: ''
  });

  // Mock assessment data
  const assessment = {
    id,
    title: 'Final Project Submission',
    description: 'Submit your capstone project',
    dueDate: '2025-03-25T23:59:59Z',
    maxScore: 100,
    allowGithub: true,
    allowFile: true,
    fileTypes: '.pdf,.zip,.ppt',
    maxFileSize: 10 // MB
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real implementation, this would submit to an API
      toast.success('Assessment submitted successfully!');
      navigate('/assessments');
    } catch (error) {
      toast.error('Failed to submit assessment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
          <p className="text-gray-600">{assessment.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            Due: {new Date(assessment.dueDate).toLocaleString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission Type
            </label>
            <div className="space-y-2">
              {assessment.allowFile && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="submissionType"
                    value="file"
                    checked={formData.submissionType === 'file'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2">File Upload</span>
                </label>
              )}
              {assessment.allowGithub && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="submissionType"
                    value="github"
                    checked={formData.submissionType === 'github'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2">GitHub Repository</span>
                </label>
              )}
            </div>
          </div>

          {formData.submissionType === 'github' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository URL
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <FaGithub />
                </span>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repository"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border focus:ring-primary focus:border-primary"
                  required={formData.submissionType === 'github'}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        name="file"
                        accept={assessment.fileTypes}
                        onChange={handleChange}
                        className="sr-only"
                        required={formData.submissionType === 'file'}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {assessment.fileTypes} up to {assessment.maxFileSize}MB
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              placeholder="Any additional information about your submission..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/assessments')}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Submit Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}