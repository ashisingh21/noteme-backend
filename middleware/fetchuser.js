var jwt = require("jsonwebtoken");
const JWT_SECRET = "beinghumanisagoodthing";
const fetchuser = async (req, res, next) => {

    // FETCHING THE TOKEN FROM THE HEADER
    const token = await req.header('auth-token')
    if (!token) {
        res.status(400).json("Invalid Token")
    }
    // VERIFY THE TOKEN USING JWT
    const data = jwt.verify(token, JWT_SECRET)

    // IF USER REQUESTED IN BODY IS SAME AS EXTRACTED FROM HEADER 
    req.user = data.user;
    next()
}
module.exports = fetchuser;