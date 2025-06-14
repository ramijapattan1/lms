import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaGithub, FaLink, FaFileAlt } from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CreateAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    courseId: '',
    type: 'assignment',
    dueDate: '',
    maxPoints: 100,
    allowLateSubmission: false,
    latePenalty: 10,
    submissionType: 'file',
    allowedFileTypes: ['.pdf', '.zip', '.doc', '.docx'],
    maxFileSize: 10 // MB
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.getMyCourses();
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    if (user?.role === 'instructor') {
      fetchCourses();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileTypesChange = (e) => {
    const value = e.target.value;
    const fileTypes = value.split(',').map(type => type.trim());
    setFormData(prev => ({
      ...prev,
      allowedFileTypes: fileTypes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId) {
      toast.error('Please select a course');
      return;
    }

    setLoading(true);
    try {
      await api.createAssessment(formData);
      toast.success('Assessment created successfully!');
      navigate('/assessments');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create assessment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionTypeIcon = (type) => {
    switch (type) {
      case 'file':
        return <FaUpload className="inline mr-2" />;
      case 'text':
        return <FaFileAlt className="inline mr-2" />;
      case 'url':
        return <FaLink className="inline mr-2" />;
      case 'github':
        return <FaGithub className="inline mr-2" />;
      default:
        return <FaFileAlt className="inline mr-2" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Create Assessment</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              >
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
                <option value="essay">Essay</option>
                <option value="coding">Coding</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Points
              </label>
              <input
                type="number"
                name="maxPoints"
                value={formData.maxPoints}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
                min="1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Submission Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { value: 'file', label: 'File Upload', icon: FaUpload },
                  { value: 'text', label: 'Text Entry', icon: FaFileAlt },
                  { value: 'url', label: 'URL/Link', icon: FaLink },
                  { value: 'github', label: 'GitHub Repository', icon: FaGithub }
                ].map(option => (
                  <label key={option.value} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="submissionType"
                      value={option.value}
                      checked={formData.submissionType === option.value}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <option.icon className="mr-2 text-primary" />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.submissionType === 'file' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed File Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.allowedFileTypes.join(', ')}
                    onChange={handleFileTypesChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    placeholder=".pdf, .zip, .doc, .docx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: .pdf, .zip, .doc, .docx, .txt
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum File Size (MB)
                  </label>
                  <input
                    type="number"
                    name="maxFileSize"
                    value={formData.maxFileSize}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            )}

            {formData.submissionType === 'url' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">URL Submission Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Students can submit links to their work (websites, portfolios, etc.)</li>
                  <li>• Ensure the URL is publicly accessible</li>
                  <li>• Consider providing specific URL format requirements</li>
                </ul>
              </div>
            )}

            {formData.submissionType === 'github' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">GitHub Repository Guidelines</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Students must submit a GitHub repository URL</li>
                  <li>• Repository should be public or accessible to instructors</li>
                  <li>• Include specific requirements for README, documentation, etc.</li>
                  <li>• Consider requiring specific branch or commit hash</li>
                </ul>
              </div>
            )}

            {formData.submissionType === 'text' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Text Entry Guidelines</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Students will type their response directly</li>
                  <li>• Good for essays, short answers, or code snippets</li>
                  <li>• Consider setting word/character limits in instructions</li>
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowLateSubmission"
                  checked={formData.allowLateSubmission}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Allow Late Submission
                </label>
              </div>

              {formData.allowLateSubmission && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Late Penalty (% per day):
                  </label>
                  <input
                    type="number"
                    name="latePenalty"
                    value={formData.latePenalty}
                    onChange={handleChange}
                    className="w-20 p-2 border rounded focus:ring-primary focus:border-primary"
                    min="0"
                    max="100"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={() => navigate('/assessments')}
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
            {loading ? 'Creating...' : 'Create Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}