import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaClock, FaFile, FaTrash, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
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

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await api.deleteAssessment(assessmentId);
      toast.success('Assessment deleted successfully!');
      
      // Refresh assessments
      const assessmentParams = selectedCourse ? { courseId: selectedCourse } : {};
      const assessmentResponse = await api.getAssessments(assessmentParams);
      setAssessments(assessmentResponse.data.assessments || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete assessment';
      toast.error(errorMessage);
    }
  };

  const toggleAssessmentStatus = async (assessmentId, currentStatus) => {
    try {
      await api.updateAssessment(assessmentId, { isPublished: !currentStatus });
      toast.success(`Assessment ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      
      // Refresh assessments
      const assessmentParams = selectedCourse ? { courseId: selectedCourse } : {};
      const assessmentResponse = await api.getAssessments(assessmentParams);
      setAssessments(assessmentResponse.data.assessments || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update assessment';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-4 md:p-6 text-center">Loading assessments...</div>;
  if (error) return <div className="p-4 md:p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Assessments</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {assessments.map(assessment => (
            <Card key={assessment._id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold line-clamp-2">{assessment.title}</h3>
                  <span className={`px-2 py-1 text-sm rounded flex-shrink-0 ml-2 ${
                    assessment.isPublished 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assessment.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{assessment.description}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaClock className="mr-2 flex-shrink-0" />
                    Due: {new Date(assessment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <FaFile className="mr-2 flex-shrink-0" />
                    Max Score: {assessment.maxPoints}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Type:</span>
                    <span className="capitalize">{assessment.type}</span>
                  </div>
                </div>

                {assessment.course && (
                  <div className="text-sm text-gray-600">
                    Course: <span className="line-clamp-1">{assessment.course.title}</span>
                  </div>
                )}

                {user?.role === 'instructor' ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Submissions: {assessment.submissions?.length || 0}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button
                        onClick={() => toggleAssessmentStatus(assessment._id, assessment.isPublished)}
                        className={`flex items-center px-3 py-1 rounded text-xs ${
                          assessment.isPublished
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {assessment.isPublished ? (
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
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/assessments/${assessment._id}/submissions`}
                        className="flex-1 text-center py-2 text-primary border border-primary rounded hover:bg-primary/10"
                      >
                        Submissions
                      </Link>
                      <div className="flex gap-2">
                        <Link
                          to={`/assessments/${assessment._id}/edit`}
                          className="flex-1 flex items-center justify-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteAssessment(assessment._id)}
                          className="flex-1 flex items-center justify-center py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Check if student has already submitted */}
                    {assessment.progress === 'Submitted' || assessment.progress === 'Graded' ? (
                      <div className="text-center py-2 bg-green-100 text-green-800 rounded">
                        {assessment.progress}
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
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}