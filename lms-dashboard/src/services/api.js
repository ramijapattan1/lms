import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),

  // Courses
  getCourses: (params = {}) => apiClient.get('/courses', { params }),
  getCourseById: (id) => apiClient.get(`/courses/${id}`),
  createCourse: (course) => apiClient.post('/courses', course),
  updateCourse: (id, course) => apiClient.put(`/courses/${id}`, course),
  deleteCourse: (id) => apiClient.delete(`/courses/${id}`),
  enrollInCourse: (id) => apiClient.post(`/courses/${id}/enroll`),
  getMyCourses: (params = {}) => apiClient.get('/courses/my/courses', { params }),
  getEnrolledCourses: (params = {}) => apiClient.get('/courses/enrolled/my-courses', { params }),
  getCourseProgress: (courseId) => apiClient.get(`/courses/${courseId}/full-progress`),

  // Chapters
  getChapters: (params = {}) => apiClient.get('/chapters', { params }),
  getChapterById: (id) => apiClient.get(`/chapters/${id}`),
  createChapter: (chapter) => apiClient.post('/chapters', chapter),
  updateChapter: (id, chapter) => apiClient.put(`/chapters/${id}`, chapter),
  deleteChapter: (id) => apiClient.delete(`/chapters/${id}`),

  // Lessons
  getLessons: (params = {}) => apiClient.get('/lessons', { params }),
  getLessonById: (id) => apiClient.get(`/lessons/${id}`),
  createLesson: (lesson) => apiClient.post('/lessons', lesson),
  updateLesson: (id, lesson) => apiClient.put(`/lessons/${id}`, lesson),
  deleteLesson: (id) => apiClient.delete(`/lessons/${id}`),

  // Videos
  getVideos: (params = {}) => apiClient.get('/videos', { params }),
  getVideoById: (id) => apiClient.get(`/videos/${id}`),
  uploadVideo: (formData) => apiClient.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateVideo: (id, data) => apiClient.put(`/videos/${id}`, data),
  deleteVideo: (id) => apiClient.delete(`/videos/${id}`),
  streamVideo: (id) => apiClient.get(`/videos/${id}/stream`),

  // Quizzes
  getQuizzes: (params = {}) => apiClient.get('/quizzes', { params }),
  getQuizById: (id) => apiClient.get(`/quizzes/${id}`),
  createQuiz: (quiz) => apiClient.post('/quizzes', quiz),
  updateQuiz: (id, quiz) => apiClient.put(`/quizzes/${id}`, quiz),
  deleteQuiz: (id) => apiClient.delete(`/quizzes/${id}`),
  submitQuizAttempt: (id, attempt) => apiClient.post(`/quizzes/${id}/attempt`, attempt),
  getQuizResults: (id) => apiClient.get(`/quizzes/${id}/results`),
  saveQuizProgress: (id, progress) => apiClient.post(`/quizzes/${id}/progress`, progress),

  // Assessments
  getAssessments: (params = {}) => apiClient.get('/assessments', { params }),
  getAssessmentById: (id) => apiClient.get(`/assessments/${id}`),
  createAssessment: (assessment) => apiClient.post('/assessments', assessment),
  updateAssessment: (id, assessment) => apiClient.put(`/assessments/${id}`, assessment),
  deleteAssessment: (id) => apiClient.delete(`/assessments/${id}`),
  submitAssessment: (id, submission) => apiClient.post(`/assessments/${id}/submit`, submission),
  gradeSubmission: (assessmentId, submissionId, grade) => 
    apiClient.put(`/assessments/${assessmentId}/submissions/${submissionId}/grade`, grade),
  getAssessmentSubmissions: (id, params = {}) => 
    apiClient.get(`/assessments/${id}/submissions`, { params }),

  // Discussions
  getDiscussions: (params = {}) => apiClient.get('/discussions', { params }),
  getDiscussionById: (id) => apiClient.get(`/discussions/${id}`),
  createDiscussion: (discussion) => apiClient.post('/discussions', discussion),
  updateDiscussion: (id, discussion) => apiClient.put(`/discussions/${id}`, discussion),
  deleteDiscussion: (id) => apiClient.delete(`/discussions/${id}`),
  addReply: (id, reply) => apiClient.post(`/discussions/${id}/replies`, reply),
  updateReply: (discussionId, replyId, reply) => 
    apiClient.put(`/discussions/${discussionId}/replies/${replyId}`, reply),
  deleteReply: (discussionId, replyId) => 
    apiClient.delete(`/discussions/${discussionId}/replies/${replyId}`),
  toggleLike: (id) => apiClient.post(`/discussions/${id}/like`),

  // Doubts
  getDoubts: (params = {}) => apiClient.get('/doubts', { params }),
  getDoubtById: (id) => apiClient.get(`/doubts/${id}`),
  createDoubt: (doubt) => apiClient.post('/doubts', doubt),
  updateDoubt: (id, doubt) => apiClient.put(`/doubts/${id}`, doubt),
  deleteDoubt: (id) => apiClient.delete(`/doubts/${id}`),
  addResponse: (id, response) => apiClient.post(`/doubts/${id}/responses`, response),
  resolveDoubt: (id) => apiClient.put(`/doubts/${id}/resolve`),
  toggleUpvote: (id) => apiClient.post(`/doubts/${id}/upvote`),

  // Notifications
  getNotifications: (params = {}) => apiClient.get('/notifications', { params }),
  getNotificationById: (id) => apiClient.get(`/notifications/${id}`),
  createNotification: (notification) => apiClient.post('/notifications', notification),
  markNotificationAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllNotificationsAsRead: () => apiClient.put('/notifications/mark-all-read'),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
  deleteAllNotifications: () => apiClient.delete('/notifications/delete-all'),
  getNotificationStats: () => apiClient.get('/notifications/stats'),

  // Programming Environment
  getProgrammingEnvs: (params = {}) => apiClient.get('/programming', { params }),
  getProgrammingEnvById: (id) => apiClient.get(`/programming/${id}`),
  createProgrammingEnv: (env) => apiClient.post('/programming', env),
  updateProgrammingEnv: (id, env) => apiClient.put(`/programming/${id}`, env),
  deleteProgrammingEnv: (id) => apiClient.delete(`/programming/${id}`),
  executeCode: (id, code) => apiClient.post(`/programming/${id}/execute`, code),
  forkEnvironment: (id, data) => apiClient.post(`/programming/${id}/fork`, data),
  addCollaborator: (id, collaborator) => apiClient.post(`/programming/${id}/collaborators`, collaborator),

  // Course Progress
  getCourseProgress: (courseId) => apiClient.get(`/course-progress/${courseId}/progress`),
  completeVideo: (courseId, videoId) => 
    apiClient.post(`/course-progress/${courseId}/progress/complete-video`, { videoId }),
};

export default api;