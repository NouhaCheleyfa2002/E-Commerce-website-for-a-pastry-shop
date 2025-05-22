import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.token;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login again' });
    }
  
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded token payload:", decoded);

      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      
      if (!decoded.id || !decoded.role) {
        return res.status(403).json({ success: false, message: 'Invalid token. Access denied' });
      }
  
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
};

const adminAuth = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only' });
  }
  next();
};

export { userAuth, adminAuth };
