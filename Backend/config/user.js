const myprofile = (req,res,next) => {
   return res.status(200).json({
        success: true,
        user:req.user
    })
}

const logout = (req, res, next) => { 
    req.session.destroy((err) => {
        if (err) {
           return next(err)
        }
        res.clearCookie('connect.sid'); // Clear the cookie
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
   })
}

module.exports = {myprofile,logout}