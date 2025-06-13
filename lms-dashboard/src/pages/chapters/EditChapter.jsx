import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import { api } from '../../services/api';

export default function EditChapter() {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orderIndex: 1
  });

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await api.getChapterById(chapterId);
        const chapter = response.data;
        setFormData({
          title: chapter.title,
          description: chapter.description,
          orderIndex: chapter.orderIndex
        });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load chapter';
        toast.error(errorMessage);
        navigate(`/courses/${courseId}`);
      } finally {
        setFetchLoading(false);
      }
    };

    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId, courseId, navigate]);

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
      const chapterData = {
        ...formData,
        orderIndex: parseInt(formData.orderIndex)
      };

      await api.updateChapter(chapterId, chapterData);
      toast.success('Chapter updated successfully!');
      navigate(`/courses/${courseId}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update chapter';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="p-6 text-center">Loading chapter...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Chapter</h1>
      
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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Chapter'}
          </button>
        </div>
      </form>
    </div>
  );
}