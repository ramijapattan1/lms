import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaGithub } from 'react-icons/fa';

export default function CreateAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100,
    allowGithub: true,
    allowFile: true,
    fileTypes: '.pdf,.zip,.ppt',
    maxFileSize: 10 // MB
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real implementation, this would submit to an API
      toast.success('Assessment created successfully!');
      navigate('/assessments');
    } catch (error) {
      toast.error('Failed to create assessment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create Assessment</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Maximum Score
              </label>
              <input
                type="number"
                name="maxScore"
                value={formData.maxScore}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowGithub"
                  checked={formData.allowGithub}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Allow GitHub submission
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowFile"
                  checked={formData.allowFile}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Allow file upload
                </label>
              </div>
            </div>

            {formData.allowFile && (
              <div className="pl-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed File Types
                  </label>
                  <input
                    type="text"
                    name="fileTypes"
                    value={formData.fileTypes}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                    placeholder=".pdf,.zip,.ppt"
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
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
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
            Create Assessment
          </button>
        </div>
      </form>
    </div>
  );
}