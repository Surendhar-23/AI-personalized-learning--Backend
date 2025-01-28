const express = require("express");
const router = express.Router();
const quizController = require("../controllers/QuizController");

// Create a new DIG
router.post("/", quizController.generateQuiz);

module.exports = router;
