const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(404).json(userError);
    }

    const { data: questions, error: questionsError } = await supabase
      .from("knowledge_questions")
      .select("*");

    if (questionsError) {
      return res.status(500).json(questionsError);
    }

    const filteredQuestions = questions.filter((question) => {
      return (
        question.level === "HOSPITAL" ||
        (question.level === "DEPARTMENT" &&
          question.department === user.department) ||
        (question.level === "ROLE" && question.target_role === user.role) ||
        (question.level === "COHORT" &&
          user.applicable_cohorts?.includes(question.cohort_tag))
      );
    });

    res.json(filteredQuestions);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
