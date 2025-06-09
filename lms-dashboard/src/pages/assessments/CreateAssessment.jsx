import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaGithub } from 'react-icons/fa';
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create Assessment</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
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
              <select
                name="submissionType"
                value={formData.submissionType}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              >
                <option value="file">File Upload</option>
                <option value="text">Text Entry</option>
                <option value="url">URL Submission</option>
                <option value="github">GitHub Repository</option>
              </select>
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
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Late Penalty (% per day)
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

        <div className="mt-6 flex justify-end space-x-4">
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