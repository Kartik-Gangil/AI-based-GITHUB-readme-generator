const ErrorHandler = require('../utils/ErrorHandler');
const isAuthenticated = (req, res, next) => {
    const token = req.cookies['connect.sid'];
    if (!token) {
        // return next(new ErrorHandler('Please login to access this resource', 401));
        return res.status(401).json({
            success: false,
            message: 'Please login to access this resource'
        });
    }
    next();
}
module.exports = { isAuthenticated };