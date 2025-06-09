import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';

export default function CreateChapter() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orderIndex: 1
  });

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
      toast.success('Chapter created successfully!');
      navigate(`/courses/${courseId}`);
    } catch (error) {
      toast.error('Failed to create chapter');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Chapter</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Chapter Details">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Title
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                name="orderIndex"
                value={formData.orderIndex}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                required
              />
            </div>
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
            Create Chapter
          </button>
        </div>
      </form>
    </div>
  );
}