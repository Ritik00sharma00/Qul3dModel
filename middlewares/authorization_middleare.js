import jwt from 'jsonwebtoken';

export const authorize = (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request (you can customize this)
    req.user = {
      userId: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
