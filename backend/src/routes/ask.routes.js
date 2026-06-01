const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");
const genAI = require("../config/gemini");

router.post("/", async (req, res) => {
  try {
    const { userId, patientId, question } = req.body;

    // User
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(404).json({
        message: userError.message,
      });
    }

    // Patient
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (patientError) {
      return res.status(404).json({
        message: patientError.message,
      });
    }

    // Nodes
    const { data: nodes, error: nodesError } = await supabase
      .from("knowledge_nodes")
      .select("*");

    if (nodesError) {
      return res.status(500).json({
        message: nodesError.message,
      });
    }

    // Questions
    const { data: questions, error: questionsError } = await supabase
      .from("knowledge_questions")
      .select("*");

    if (questionsError) {
      return res.status(500).json({
        message: questionsError.message,
      });
    }

    // Department Filter
    const filteredNodes = nodes.filter((node) => {
      if (!node.department) {
        return true;
      }

      return node.department === patient.department;
    });

    // Cohort Filter
    const patientCohorts = patient.cohort_tags || [];

    const cohortNodes = filteredNodes.filter((node) => {
      if (!node.source_question_id) {
        return true;
      }

      const sourceQuestion = questions.find(
        (q) => q.id === node.source_question_id
      );

      if (!sourceQuestion) {
        return true;
      }

      if (!sourceQuestion.cohort_tag) {
        return true;
      }

      return patientCohorts.includes(
        sourceQuestion.cohort_tag
      );
    });

    // Hospital Knowledge
    const hospitalKnowledge = cohortNodes.filter(
      (node) =>
        node.hierarchy_level_id === "HL-01" ||
        node.hierarchy_level_id === "HL-GLOBAL"
    );

    // Department Knowledge
    const departmentKnowledge = cohortNodes.filter(
  (node) =>
    node.department === patient.department
);

    // Patient Knowledge
   const patientKnowledge = cohortNodes.filter(
  node =>
    node.hierarchy_level_id.includes(
      patient.name.split(" ")[1].toUpperCase()
    )
);

    // Prompt Context
  const context = `
You are a clinical AI assistant.

Question:
${question}

Hospital Knowledge:
${hospitalKnowledge.map(n => n.content).join("\n")}

Department Knowledge:
${departmentKnowledge.map(n => n.content).join("\n")}

Patient Knowledge:
${patientKnowledge.map(n => n.content).join("\n")}

Patient:
${patient.name}

Conditions:
${(patient.conditions || []).join(", ")}

Return your answer in this format:

RECOMMENDATION:
...

REASONING:
...

RISK LEVEL:
Low / Medium / High

ALTERNATIVE:
...
`;

    
   const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
});

const result = await model.generateContent(
  context
);

const answer =
  result.response.text();


    res.json({
      question,
      answer,

      stats: {
        totalNodes: nodes.length,
        hospitalNodes:
          hospitalKnowledge.length,
        departmentNodes:
          departmentKnowledge.length,
        patientNodes:
          patientKnowledge.length,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;