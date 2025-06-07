import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaVideo, FaFile, FaQuestionCircle, FaTasks } from 'react-icons/fa';

export default function ChapterList() {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([
    {
      id: '1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of web development',
      content: [
        {
          id: '1',
          type: 'video',
          title: 'Welcome to the Course',
          duration: '10:00',
          completed: false
        },
        {
          id: '2',
          type: 'resource',
          title: 'Course Materials PDF',
          completed: false
        }
      ]
    },
    {
      id: '2',
      title: 'HTML Fundamentals',
      description: 'Master HTML5 and semantic markup',
      content: [
        {
          id: '3',
          type: 'video',
          title: 'HTML Structure',
          duration: '15:00',
          completed: false
        },
        {
          id: '4',
          type: 'quiz',
          title: 'HTML Basics Quiz',
          completed: false
        },
        {
          id: '5',
          type: 'assessment',
          title: 'HTML Project',
          completed: false
        }
      ]
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo />;
      case 'resource':
        return <FaFile />;
      case 'quiz':
        return <FaQuestionCircle />;
      case 'assessment':
        return <FaTasks />;
      default:
        return <FaFile />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Course Chapters</h1>
      
      <div className="space-y-6">
        {chapters.map((chapter, index) => (
          <div key={chapter.id} className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-2">
                Chapter {index + 1}: {chapter.title}
              </h2>
              <p className="text-gray-600">{chapter.description}</p>
            </div>

            <div className="divide-y">
              {chapter.content.map(item => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <span className="text-primary mr-3">
                      {getIcon(item.type)}
                    </span>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      {item.duration && (
                        <span className="text-sm text-gray-500">
                          Duration: {item.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {item.completed ? (
                      <span className="text-green-500">✓ Completed</span>
                    ) : (
                      <button className="text-primary hover:text-primary/90">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}