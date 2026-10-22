const jwt=require('jsonwebtoken');
const secret=process.env.JWT_TOKEN_SECRET;

class TokenService {
    generateToken(payload) {
        return jwt.sign(payload, secret, { expiresIn: '24h' });
    }
}
module.exports = new TokenService();