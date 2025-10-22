
const Answer = require('../models/Answer');

exports.addAnswer = async (req, res) => {
  try {
    const { questionId, text } = req.body;
    const a = new Answer({ questionId, text, createdBy: req.user.id });
    await a.save();
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId }).populate('createdBy', 'name email').sort({createdAt:-1});
    res.json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
exports.getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find()
      .populate('questionId', 'title')
      .populate('createdBy', 'name email');
    res.json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
