const jwt = require("jsonwebtoken");

/**
 * function which verifies user's authorization for all routes needed
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function validAuth(req, res, next) {
    //first check the header for authorization
    const header = req.header("Authorization");
    if (header == null) return res.status(403).send({ message: "Invalid Authorization" });

    const token = header.split(" ")[1];
    if (token == null)
        return res.status(403).send({ message: "Token cannot be null" });

    //verify if token is valid, if it's valid, put the userId in the request   
    jwt.verify(token, process.env.KEY_TOKEN, (err, decoded) => {
        if (err)
            return res.status(403).send({ message: "Token invalid " });
        if(decoded){
            const userId = decoded.userId;
            req.auth = {
                userId: userId
            }
        }
        console.log("the token is valid, we continue");
        next();
    });
}

module.exports = { validAuth };