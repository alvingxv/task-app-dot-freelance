const jsonwebtoken = require("jsonwebtoken");

module.exports = (req) => {
    const authToken = req.headers.authorization;
    const decoded = jsonwebtoken.verify(
        authToken.split(" ")[1],
        process.env.SECRET_KEY
    );
    return decoded;
}