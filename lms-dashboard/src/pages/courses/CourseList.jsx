import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus } from 'react-icons/fa';
import CourseCard from '../../components/courses/CourseCard';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function CourseList() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getCourses();
        setCourses(response.data.courses || []);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load courses';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading courses...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        {user?.role === 'instructor' && (
          <Link
            to="/courses/create"
            className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            <FaPlus className="mr-2" />
            Create Course
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}