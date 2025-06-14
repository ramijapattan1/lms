import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Card from '../../components/common/Card';
import { api } from '../../services/api';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    duration: '',
    category: '',
    price: '',
    level: 'Beginner' // Fixed: Use capital B
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const courseData = {
        ...formData,
        content,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price) || 0,
        isPublished: false // Initially create as draft
      };

      const response = await api.createCourse(courseData);
      setCreatedCourseId(response.data._id);
      setShowPublishModal(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create course';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishDecision = async (shouldPublish) => {
    try {
      if (shouldPublish && createdCourseId) {
        await api.updateCourse(createdCourseId, { isPublished: true });
        toast.success('Course created and published successfully!');
      } else {
        toast.success('Course created as draft successfully!');
      }
      navigate('/courses');
    } catch (error) {
      toast.error('Course created but failed to publish. You can publish it later.');
      navigate('/courses');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Basic Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
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
                Short Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Content
              </label>
              <ReactQuill 
                value={content} 
                onChange={setContent}
                className="h-64 mb-12"
              />
            </div>
          </div>
        </Card>

        <Card title="Course Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (in hours)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
                <option value="web-development">Web Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
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
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Course Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Would you like to publish this course now or keep it as a draft?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handlePublishDecision(false)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Keep as Draft
              </button>
              <button
                onClick={() => handlePublishDecision(true)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}