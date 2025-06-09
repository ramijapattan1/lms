import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaClock, FaFile } from 'react-icons/fa';
import Card from '../../components/common/Card';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function AssessmentList() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch assessments
        const assessmentParams = selectedCourse ? { courseId: selectedCourse } : {};
        const assessmentResponse = await api.getAssessments(assessmentParams);
        setAssessments(assessmentResponse.data.assessments || []);

        // Fetch courses for filter
        let coursesData = [];
        if (user?.role === 'instructor') {
          const coursesResponse = await api.getMyCourses();
          coursesData = coursesResponse.data.courses || [];
        } else {
          const coursesResponse = await api.getEnrolledCourses();
          coursesData = coursesResponse.data.courses || [];
        }
        setCourses(coursesData);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load assessments';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse, user?.role]);

  if (loading) return <div className="p-6 text-center">Loading assessments...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <div className="flex items-center space-x-4">
          {courses.length > 0 && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border rounded focus:ring-primary focus:border-primary"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
          {user?.role === 'instructor' && (
            <Link
              to="/assessments/create"
              className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              <FaPlus className="mr-2" />
              Create Assessment
            </Link>
          )}
        </div>
      </div>

      {assessments.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No assessments available.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map(assessment => (
            <Card key={assessment._id}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{assessment.title}</h3>
                <p className="text-gray-600">{assessment.description}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    Due: {new Date(assessment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <FaFile className="mr-2" />
                    Max Score: {assessment.maxPoints}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Type:</span>
                    <span className="capitalize">{assessment.type}</span>
                  </div>
                </div>

                {assessment.course && (
                  <div className="text-sm text-gray-600">
                    Course: {assessment.course.title}
                  </div>
                )}

                {user?.role === 'instructor' ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Submissions: {assessment.submissions?.length || 0}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/assessments/${assessment._id}/submissions`}
                        className="flex-1 text-center py-2 text-primary border border-primary rounded hover:bg-primary/10"
                      >
                        View Submissions
                      </Link>
                      <Link
                        to={`/assessments/${assessment._id}/edit`}
                        className="flex-1 text-center py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/assessments/${assessment._id}/submit`}
                    className="block w-full text-center py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Submit Assessment
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}