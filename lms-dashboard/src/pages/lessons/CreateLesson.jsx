import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaPlus, FaTrash } from 'react-icons/fa';
import Card from '../../components/common/Card';

export default function CreateLesson() {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoFile: null,
    duration: '',
    resources: []
  });

  const [newResource, setNewResource] = useState({
    title: '',
    type: 'pdf',
    url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        videoFile: file
      }));
    }
  };

  const addResource = () => {
    if (!newResource.title || !newResource.url) {
      toast.error('Please fill all resource fields');
      return;
    }

    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { ...newResource, id: Date.now() }]
    }));

    setNewResource({
      title: '',
      type: 'pdf',
      url: ''
    });
  };

  const removeResource = (id) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      toast.success('Lesson created successfully!');
      navigate(`/courses/${courseId}`);
    } catch (error) {
      toast.error('Failed to create lesson');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Lesson</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Basic Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title
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
          </div>
        </Card>

        <Card title="Video Content">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
              />
              {formData.videoFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {formData.videoFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (e.g., "45:00")
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
                pattern="^\d{1,2}:\d{2}$"
                placeholder="MM:SS"
              />
            </div>
          </div>
        </Card>

        <Card title="Resources">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newResource.title}
                  onChange={handleResourceChange}
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={newResource.type}
                  onChange={handleResourceChange}
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                >
                  <option value="pdf">PDF</option>
                  <option value="code">Code</option>
                  <option value="link">Link</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={newResource.url}
                  onChange={handleResourceChange}
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addResource}
              className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              <FaPlus className="mr-2" />
              Add Resource
            </button>

            {formData.resources.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.resources.map(resource => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-gray-500">{resource.type}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResource(resource.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Create Lesson
          </button>
        </div>
      </form>
    </div>
  );
}