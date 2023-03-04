const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "beinghumanisagoodthing";
const fetchuser = require('../middleware/fetchuser')

let success = false;

// ROUTE 1 :CREATE A NEW USER WITH /api/auth/createuser // No login required
router.post(
    "/createuser",
    [
        // name must be at least 3 chars long
        body("name").isLength({ min: 3 }),
        // email must be an email
        body("email").isEmail(),
        // password must be at least 5 chars long
        body("password").isLength({ min: 3 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // CHECK IF USER ALREADY EXISTS
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json("A user with this email already exists");
            }

            // CREATE SALT AND ENCRYPT THE PASSWORD
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);

            // CREATE THE USER IN DB
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword,
            });
            // SEND AUTH TOKEN USING USER ID AND HASH
            const data = {
                user: {
                    id: user.id,
                },
            };
            success = true;
            const auth_Token = jwt.sign(data, JWT_SECRET);
            res.json({ success, auth_Token });
        } catch (error) {
            res.status(500).json("Some error occured");
        }

    }
);



// ROUTE 2 :LOGIN WITH CREDS /api/auth/createuser // No login required
router.post('/login', [
    body("email").exists(),
    body("password").isLength({ min: 3 }),
], async (req, res) => {

    try {
        // CHECK IF ERRORS IN VALIDATION
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json("No user with this email exists, please create a new account");
        }

        // COMPARE THE PASSWORD
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json("Wrong Password");
        }
        // PASSWORD IS RIGHT THEN WITH USER ID AND HASH SEND AN AUTH TOKEN
        const data = {
            user: {
                id: user.id,
            },
        };

        success = true;
        // SENDING AN AUTH TOKEN USING ID (DATA) AND JWT_SECRET
        const auth_Token = jwt.sign(data, JWT_SECRET);
        res.json({ success, auth_Token });

    } catch (error) {

        res.status(500).json("Internal Error Occured");

    }

})

// ROUTE 3 :FETCH ALL USER DATA | LOGIN REQUIRED
router.get('/getuser', fetchuser, async (req, res) => {
    // STORING THE USEDID RECEIVED FROM FETCHUSER
    const userId = req.user.id
    // EXTRACT EVERYTHING FROM DB EXCEPT THE PASSWORD
    const user = await User.findById(userId).select('-password')
    res.send(user)
    success = true;
})

module.exports = router;
