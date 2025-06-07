import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBook, FaGraduationCap, FaClock, FaCalendarAlt } from 'react-icons/fa';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses] = useState([
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      progress: 60,
      instructor: 'John Smith',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      nextLesson: 'JavaScript Basics',
      nextLessonTime: '2:00 PM Today'
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      progress: 30,
      instructor: 'Jane Doe',
      thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
      nextLesson: 'Custom Hooks',
      nextLessonTime: '4:00 PM Today'
    }
  ]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBook className="text-blue-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Enrolled Courses</h3>
              <p className="text-2xl font-bold text-blue-500">{enrolledCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaGraduationCap className="text-green-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Active Courses</h3>
              <p className="text-2xl font-bold text-green-500">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaClock className="text-purple-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Hours Spent</h3>
              <p className="text-2xl font-bold text-purple-500">45h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaCalendarAlt className="text-yellow-500 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Assignments</h3>
              <p className="text-2xl font-bold text-yellow-500">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">My Learning</h2>
            <div className="space-y-6">
              {enrolledCourses.map(course => (
                <div key={course.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-32 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Instructor: {course.instructor}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>{course.progress}% Complete</span>
                      <Link to={`/courses/${course.id}`} className="text-primary hover:underline">
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            {upcomingSchedule.map(item => (
              <div key={item.id} className="flex items-center p-3 border rounded-lg">
                <div className="mr-4">
                  <div className="w-12 h-12 flex flex-col items-center justify-center bg-gray-100 rounded">
                    <span className="text-sm font-semibold">{item.time}</span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
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