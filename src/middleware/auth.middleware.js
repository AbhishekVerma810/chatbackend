const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    console.log("abhi you token here",token)
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    // const usertoken = token.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
        console.log('errrrrr',err)
      if (err.name === 'JsonWebTokenError') {
        console.log('err.name',err.name)
        return res.status(403).json({ error: 'Invalid token' });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token has expired' });
      } else {
        return res.status(403).j7son({ error: 'Failed to authenticate token' });
      }
    }
  };
  
module.exports = {
  verifyToken,
};