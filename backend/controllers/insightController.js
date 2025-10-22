const Insight = require('../models/Insight');

exports.createInsight = async (req, res) => {
  try {
    if (req.user.role !== 'manager')
      return res.status(403).json({ message: 'Forbidden' });

    const { questionId, summary } = req.body;
    if (!questionId || !summary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const ins = new Insight({
      questionId,
      summary,
      createdBy: req.user.id,
    });

    await ins.save();
    res.status(201).json(ins);
  } catch (err) {
    console.error('Create insight error:', err);
    res.status(500).send('Server error');
  }
};

exports.getInsights = async (req, res) => {
  try {
    if (req.user.role !== 'manager')
      return res.status(403).json({ message: 'Forbidden' });

    const insights = await Insight.find()
      .populate('questionId', 'title tags')
      .populate('createdBy', 'name');

    res.json(insights);
  } catch (err) {
    console.error('Get insights error:', err);
    res.status(500).send('Server error');
  }
};

exports.deleteInsight = async (req, res) => {
  try {
    if (req.user.role !== 'manager')
      return res.status(403).json({ message: 'Forbidden' });

    const { id } = req.params;
    const insight = await Insight.findById(id);

    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }

    await Insight.findByIdAndDelete(id);
    res.json({ message: 'Insight deleted successfully' });
  } catch (err) {
    console.error('Delete insight error:', err);
    res.status(500).json({ message: 'Server error while deleting insight' });
  }
};
