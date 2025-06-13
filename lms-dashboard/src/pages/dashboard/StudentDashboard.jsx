import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBook, FaGraduationCap, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    activeCourses: 0,
    hoursSpent: 0,
    assignments: 0
  });

  const [upcomingSchedule] = useState([
    {
      id: '1',
      title: 'JavaScript Basics',
      type: 'lesson',
      time: '2:00 PM',
      date: 'Today'
    },
    {
      id: '2',
      title: 'React Fundamentals Quiz',
      type: 'quiz',
      time: '3:30 PM',
      date: 'Today'
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enrolled courses
        const coursesResponse = await api.getEnrolledCourses();
        const coursesData = coursesResponse.data.courses || [];
        setEnrolledCourses(coursesData);

        // Fetch assessments to get real assignment count
        const assessmentsResponse = await api.getAssessments();
        const assessmentsData = assessmentsResponse.data.assessments || [];

        // Calculate stats
        const totalHours = coursesData.reduce((acc, course) => {
          const duration = parseInt(course.duration) || 0;
          const progress = course.progress || 0;
          return acc + (duration * progress / 100);
        }, 0);

        setStats({
          enrolledCourses: coursesData.length,
          activeCourses: coursesData.length, // All enrolled courses are considered active
          hoursSpent: totalHours,
          assignments: assessmentsData.length
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
    return <div className="p-4 md:p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your learning</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBook className="text-blue-500 text-lg md:text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm md:text-lg font-semibold">Enrolled Courses</h3>
              <p className="text-xl md:text-2xl font-bold text-blue-500">{stats.enrolledCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaGraduationCap className="text-green-500 text-lg md:text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm md:text-lg font-semibold">Active Courses</h3>
              <p className="text-xl md:text-2xl font-bold text-green-500">{stats.activeCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaClock className="text-purple-500 text-lg md:text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm md:text-lg font-semibold">Hours Spent</h3>
              <p className="text-xl md:text-2xl font-bold text-purple-500">{Math.round(stats.hoursSpent)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaCalendarAlt className="text-yellow-500 text-lg md:text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm md:text-lg font-semibold">Assignments</h3>
              <p className="text-xl md:text-2xl font-bold text-yellow-500">{stats.assignments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">My Learning</h2>
            <div className="space-y-4 md:space-y-6">
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                  <Link
                    to="/courses"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                enrolledCourses.map(course => (
                  <div key={course.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                    <img
                      src={course.thumbnail || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg'}
                      alt={course.title}
                      className="w-full sm:w-32 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Instructor: {course.instructor}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between mt-2 text-sm gap-2">
                        <span>{course.progress || 0}% Complete</span>
                        <Link to={`/courses/${course.id}`} className="text-primary hover:underline">
                          Continue Learning
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            {upcomingSchedule.map(item => (
              <div key={item.id} className="flex items-center p-3 border rounded-lg">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-12 h-12 flex flex-col items-center justify-center bg-gray-100 rounded">
                    <span className="text-xs font-semibold">{item.time}</span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}