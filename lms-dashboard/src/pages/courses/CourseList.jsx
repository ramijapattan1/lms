import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import CourseCard from '../../components/courses/CourseCard';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function CourseList() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [showEnrolledOnly, user?.role]);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (user?.role === 'instructor') {
        response = await api.getMyCourses();
      } else if (showEnrolledOnly) {
        response = await api.getEnrolledCourses();
      } else {
        response = await api.getCourses();
      }
      setCourses(response.data.courses || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load courses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (courseId, currentStatus) => {
    try {
      await api.updateCourse(courseId, { isPublished: !currentStatus });
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      fetchCourses(); // Refresh the list
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update course';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading courses...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex items-center space-x-4">
          {user?.role === 'student' && (
            <button
              onClick={() => setShowEnrolledOnly(!showEnrolledOnly)}
              className={`px-4 py-2 rounded ${
                showEnrolledOnly
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showEnrolledOnly ? 'Show All Courses' : 'Show Enrolled Courses'}
            </button>
          )}
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
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {showEnrolledOnly ? 'No enrolled courses found.' : 'No courses available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={course.thumbnail || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg'} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By {course.instructor}</span>
                  <span>{course.duration} hours</span>
                  <span>{course.lessons} lessons</span>
                </div>
                
                {user?.role === 'instructor' && (
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      course.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => togglePublishStatus(course.id, course.isPublished)}
                      className={`flex items-center px-3 py-1 rounded text-xs ${
                        course.isPublished
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {course.isPublished ? (
                        <>
                          <FaEyeSlash className="mr-1" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <FaEye className="mr-1" />
                          Publish
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <Link 
                  to={`/courses/${course.id}`}
                  className="block w-full text-center py-2 px-4 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}