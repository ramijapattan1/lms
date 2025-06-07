import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaClock, FaFile } from 'react-icons/fa';
import Card from '../../components/common/Card';

export default function AssessmentList() {
  const { user } = useAuth();
  const [assessments] = useState([
    {
      id: '1',
      title: 'Final Project Submission',
      description: 'Submit your capstone project',
      dueDate: '2025-03-25T23:59:59Z',
      maxScore: 100,
      submissions: 25,
      allowGithub: true,
      allowFile: true,
      fileTypes: '.pdf,.zip,.ppt',
      maxFileSize: 10
    },
    {
      id: '2',
      title: 'React Components Assignment',
      description: 'Create custom React components',
      dueDate: '2025-03-20T23:59:59Z',
      maxScore: 50,
      submissions: 18,
      allowGithub: true,
      allowFile: false
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map(assessment => (
          <Card key={assessment.id}>
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
                  Max Score: {assessment.maxScore}
                </div>
              </div>

              {user?.role === 'instructor' ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Submissions: {assessment.submissions}
                  </div>
                  <Link
                    to={`/assessments/${assessment.id}/submissions`}
                    className="block w-full text-center py-2 text-primary border border-primary rounded hover:bg-primary/10"
                  >
                    View Submissions
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/assessments/${assessment.id}/submit`}
                  className="block w-full text-center py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Submit Assessment
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}