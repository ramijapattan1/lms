// Dummy data for the application
export const DUMMY_DATA = {
  courses: [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn web development from scratch to advanced level',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      instructor: 'John Smith',
      duration: '40 hours',
      lessons: 48,
      price: 99.99,
      level: 'beginner',
      category: 'programming',
      enrolled: 1234,
      rating: 4.5,
      chapters: [
        {
          id: '1',
          title: 'Introduction to Web Development',
          lessons: [
            { id: '1', title: 'Welcome to the Course', duration: '10:00', type: 'video' },
            { id: '2', title: 'Setting Up Your Environment', duration: '15:00', type: 'video' },
          ]
        },
        {
          id: '2',
          title: 'HTML Fundamentals',
          lessons: [
            { id: '3', title: 'Basic HTML Structure', duration: '20:00', type: 'video' },
            { id: '4', title: 'HTML Forms and Tables', duration: '25:00', type: 'video' },
            { id: '5', title: 'HTML Quiz', type: 'quiz' },
          ]
        }
      ]
    }
  ],
  quizzes: [
    {
      id: '1',
      title: 'HTML Basics Quiz',
      description: 'Test your knowledge of HTML fundamentals',
      duration: 30, // minutes
      passingScore: 70,
      questions: [
        {
          id: '1',
          question: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyper Transfer Markup Language',
            'Home Tool Markup Language'
          ],
          correctAnswer: 0,
          isMultiple: false
        }
      ]
    }
  ],
  discussions: [
    {
      id: '1',
      title: 'Help with JavaScript Promises',
      content: 'I\'m having trouble understanding how promises work in JavaScript...',
      author: 'Jane Doe',
      createdAt: '2025-03-15T10:00:00Z',
      replies: [
        {
          id: '1',
          content: 'Promises are a way to handle asynchronous operations...',
          author: 'John Smith',
          createdAt: '2025-03-15T10:30:00Z'
        }
      ]
    }
  ],
  notifications: [
    {
      id: '1',
      title: 'New Reply to Your Question',
      message: 'John Smith replied to your question about JavaScript Promises',
      type: 'discussion',
      referenceId: '1',
      createdAt: '2025-03-15T10:30:00Z',
      read: false
    }
  ]
};

// API service functions that would normally make HTTP requests
// These are currently using dummy data
export const api = {
  // Courses
  getCourses: () => Promise.resolve(DUMMY_DATA.courses),
  getCourseById: (id) => Promise.resolve(DUMMY_DATA.courses.find(c => c.id === id)),
  createCourse: (course) => Promise.resolve({ ...course, id: Date.now().toString() }),

  // Quizzes
  getQuizzes: () => Promise.resolve(DUMMY_DATA.quizzes),
  getQuizById: (id) => Promise.resolve(DUMMY_DATA.quizzes.find(q => q.id === id)),
  submitQuizAttempt: (attempt) => Promise.resolve({ ...attempt, score: 85 }),

  // Discussions
  getDiscussions: () => Promise.resolve(DUMMY_DATA.discussions),
  createDiscussion: (discussion) => Promise.resolve({ ...discussion, id: Date.now().toString() }),
  addReply: (discussionId, reply) => Promise.resolve({ ...reply, id: Date.now().toString() }),

  // Notifications
  getNotifications: () => Promise.resolve(DUMMY_DATA.notifications),
  markNotificationAsRead: (id) => Promise.resolve({ success: true }),
  deleteNotification: (id) => Promise.resolve({ success: true })
};