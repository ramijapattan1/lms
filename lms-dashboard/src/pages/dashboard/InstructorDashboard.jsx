import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaGraduationCap, FaStar } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeCourses: 0,
    avgRating: 0,
    totalRevenue: 0
  });

  const [recentActivities] = useState([
    {
      id: '1',
      type: 'enrollment',
      student: 'Jane Cooper',
      course: 'Complete Web Development Bootcamp',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'review',
      student: 'Alex Morgan',
      course: 'Advanced React Patterns',
      rating: 5,
      time: '4 hours ago'
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getMyCourses();
        const coursesData = response.data.courses || [];
        setCourses(coursesData);

        // Calculate stats
        const totalStudents = coursesData.reduce((acc, course) => acc + (course.students || 0), 0);
        const totalRevenue = coursesData.reduce((acc, course) => acc + (course.revenue || 0), 0);
        const avgRating = coursesData.length > 0 
          ? coursesData.reduce((acc, course) => acc + (course.rating || 0), 0) / coursesData.length 
          : 0;

        setStats({
          totalCourses: coursesData.length,
          totalStudents,
          activeCourses: coursesData.filter(course => course.isPublished !== false).length,
          avgRating: avgRating.toFixed(1),
          totalRevenue
        });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBook className="text-blue-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Total Courses</h3>
              <p className="text-2xl font-bold text-blue-500">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaUsers className="text-green-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Total Students</h3>
              <p className="text-2xl font-bold text-green-500">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaGraduationCap className="text-purple-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Active Courses</h3>
              <p className="text-2xl font-bold text-purple-500">{stats.activeCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaStar className="text-yellow-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Avg Rating</h3>
              <p className="text-2xl font-bold text-yellow-500">{stats.avgRating}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <Link
                to="/courses/create"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Create New Course
              </Link>
            </div>
            <div className="space-y-6">
              {courses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No courses created yet.</p>
              ) : (
                courses.map(course => (
                  <div key={course.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-32 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Students</p>
                          <p className="font-semibold">{course.students || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Rating</p>
                          <p className="font-semibold flex items-center">
                            {course.rating || 0}
                            <FaStar className="text-yellow-400 ml-1" />
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Revenue</p>
                          <p className="font-semibold">${course.revenue || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'enrollment' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'enrollment' ? (
                    <FaUsers className="text-green-500" />
                  ) : (
                    <FaStar className="text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {activity.student}{' '}
                    {activity.type === 'enrollment' ? 'enrolled in' : 'reviewed'}
                  </p>
                  <p className="text-sm text-gray-500">{activity.course}</p>
                  {activity.rating && (
                    <div className="flex items-center mt-1">
                      {[...Array(activity.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}