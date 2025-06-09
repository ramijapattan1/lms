const asyncHandler = require('express-async-handler');
const Lesson = require('../models/lessonModel');
const Chapter = require('../models/chapterModel');
const Course = require('../models/courseModel');
const Joi = require('joi');

/**
 * Get all lessons
 * @route   GET /api/lessons
 * @access  Private
 */
const getLessons = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const chapterId = req.query.chapterId;
  const courseId = req.query.courseId;

  let filter = {};
  
  if (chapterId) {
    filter.chapter = chapterId;
  }
  
  if (courseId) {
    filter.course = courseId;
  }

  // For instructors, show only their lessons
  if (req.user.isInstructor && !req.user.isAdmin) {
    filter.instructor = req.user._id;
  }

  const lessons = await Lesson.find(filter)
    .sort({ orderIndex: 1 })
    .skip(skip)
    .limit(limit)
    .populate('chapter', 'title')
    .populate('course', 'title')
    .populate('instructor', 'name email')
    .populate('videoFile', 'title fileKey');

  const total = await Lesson.countDocuments(filter);

  res.json({
    lessons,
    page,
    pages: Math.ceil(total / limit),
    total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  });
});

/**
 * Get lesson by ID
 * @route   GET /api/lessons/:id
 * @access  Private
 */
const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id)
    .populate('chapter', 'title')
    .populate('course', 'title')
    .populate('instructor', 'name email')
    .populate('videoFile', 'title fileKey');

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  // Check permissions
  const isInstructor = lesson.instructor._id.toString() === req.user._id.toString();
  const isAdmin = req.user.isAdmin;

  if (!isInstructor && !isAdmin && !lesson.isPublished) {
    res.status(403);
    throw new Error('Lesson not published');
  }

  // Increment view count for students
  if (!isInstructor && !isAdmin) {
    lesson.viewCount += 1;
    await lesson.save();
  }

  res.json(lesson);
});

/**
 * Create a new lesson
 * @route   POST /api/lessons
 * @access  Private/Instructor
 */
const createLesson = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    chapterId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    videoUrl: Joi.string().uri(),
    videoFileId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    duration: Joi.string().pattern(/^\d{1,2}:\d{2}$/).required(),
    orderIndex: Joi.number().min(1).default(1),
    resources: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        type: Joi.string().valid('pdf', 'code', 'link', 'file').required(),
        url: Joi.string().required()
      })
    ),
    isPublished: Joi.boolean().default(false)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { chapterId, videoFileId, ...lessonData } = req.body;

  // Verify chapter exists and user has permission
  const chapter = await Chapter.findById(chapterId).populate('course');
  if (!chapter) {
    res.status(404);
    throw new Error('Chapter not found');
  }

  if (chapter.instructor.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to create lesson for this chapter');
  }

  const lesson = await Lesson.create({
    ...lessonData,
    chapter: chapterId,
    course: chapter.course._id,
    instructor: req.user._id,
    ...(videoFileId && { videoFile: videoFileId }),
  });

  // Add lesson to chapter
  chapter.lessons.push(lesson._id);
  await chapter.save();

  const populatedLesson = await Lesson.findById(lesson._id)
    .populate('chapter', 'title')
    .populate('course', 'title')
    .populate('instructor', 'name email');

  res.status(201).json(populatedLesson);
});

/**
 * Update lesson
 * @route   PUT /api/lessons/:id
 * @access  Private/Instructor
 */
const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  // Check ownership
  if (lesson.instructor.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this lesson');
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate('chapter', 'title')
   .populate('course', 'title')
   .populate('instructor', 'name email');

  res.json(updatedLesson);
});

/**
 * Delete lesson
 * @route   DELETE /api/lessons/:id
 * @access  Private/Instructor
 */
const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  // Check ownership
  if (lesson.instructor.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this lesson');
  }

  // Remove lesson from chapter
  await Chapter.findByIdAndUpdate(
    lesson.chapter,
    { $pull: { lessons: lesson._id } }
  );

  await lesson.deleteOne();

  res.json({ message: 'Lesson removed' });
});

module.exports = {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};