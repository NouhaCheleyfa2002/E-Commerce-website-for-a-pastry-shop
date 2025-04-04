import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized. Login again' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id || !tokenDecode.role) {
            return res.status(403).json({ success: false, message: 'Invalid token. Access denied' });
        }

        // Attach user details to request
        req.body.userId = tokenDecode.id;
        req.body.role = tokenDecode.role; // Add role for role-based checks

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.body.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only' });
    }
    next();
};

export { userAuth, adminAuth };
