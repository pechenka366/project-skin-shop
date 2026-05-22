export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.query.userId || req.params.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }
    
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён. Требуются права администратора.' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};