
const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const q = new Question({ title, description, tags, createdBy: req.user.id });
    await q.save();
    res.json(q);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { tags: regex }];
    }
    const questions = await Question.find(filter).populate('createdBy','name email').sort({createdAt:-1});
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id).populate('createdBy','name email');
    if(!q) return res.status(404).json({message:'Not found'});
    res.json(q);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied: Only managers can delete questions' });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Delete question error:', err);
    res.status(500).json({ message: 'Server error while deleting question' });
  }
};