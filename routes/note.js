const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// ROUTE 1 : CREATE A NEW NOTE USING /api/note/create
router.post(
    "/create",
    fetchuser,
    [
        // title must be at least 3 chars long
        body("title", "title must be atleast 3 characters").isLength({ min: 3 }),
        // description must be at least 3 chars long
        body("description", "description must be atleast 5 characters").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        // CHECK FOR VALIDATION ERRORS
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // DESTRUCTURE REQUEST BODY
            const { title, description, tag } = await req.body;

            // CREATE A NEW NOTE
            const note = new Note({ title, description, tag, user: req.user.id });

            // SAVE THE NOTE
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).json("Some error occured");
        }
    }
);

// ROUTE 2 : FETCH ALL NOTES
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    // FETCH NOTES USING USER ID
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
});

// ROUTE 3 : UPDATE THE NOTE
router.put("/update/:id", fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        // CHECK IF THE NOTE EXISTS IN THE DB
        const note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).json("No note found");
        }

        // CHECK OF THE NOTE BELONGS TO THE SAME USER OR NOT
        if (note.user.toString() !== req.user.id) {
            res.status(401).json("Unauthorised access");
        }

        // FETCH NOTES USING USER ID
        let updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true }
        );
        res.json(updatedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});

// ROUTE 4 : DELETE A NOTE
router.delete("/delete/:id", fetchuser, async (req, res) => {
    // CHECK IF THE NOTE EXISTS IN THE DB
    const note = await Note.findById(req.params.id);
    if (!note) {
        res.status(404).json("No note found");
    }

    // CHECK OF THE NOTE BELONGS TO THE SAME USER OR NOT
    if (note.user.toString() !== req.user.id) {
        res.status(401).json("Unauthorised access");
    }

    // FETCH NOTES USING USER ID
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    res.json({ Success: "Note has been deleted successfully" });
});

module.exports = router;
