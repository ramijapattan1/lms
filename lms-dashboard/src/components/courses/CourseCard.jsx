import { Link } from 'react-router-dom';
import { FaBook, FaClock, FaUser } from 'react-icons/fa';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={course.thumbnail} 
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FaUser className="mr-1" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <FaBook className="mr-1" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>
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
  );
}