let jwt = require('jsonwebtoken')

function tokenValidation(req, res, next) {

    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer token'

    console.log(token);
    // Check if no token was provided
    if (token === 'null') {
        return res.status(403).json({ message: 'No token provided' });
    }



    // Verify the token
    jwt.verify(token, '123', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Save the decoded user information in the request object (optional)
        req.email = decoded.email;
        next(); // Proceed to the next middleware or route handler
    });
}


module.exports = tokenValidation