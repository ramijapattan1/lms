import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Card from '../../components/common/Card';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    duration: '',
    category: '',
    price: '',
    level: 'beginner'
  });
  const [content, setContent] = useState('');

  useEffect(() => {
    // Mock data fetch
    setFormData({
      title: 'Complete Web Development Bootcamp',
      description: 'Learn web development from scratch to advanced level',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      duration: '40',
      category: 'programming',
      price: '99.99',
      level: 'beginner'
    });
    setContent('Detailed course content...');
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      toast.success('Course updated successfully!');
      navigate('/courses');
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
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
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
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
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
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
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
}