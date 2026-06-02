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

    console.log("================================");
    console.log("PATIENT FROM DATABASE");
    console.log(JSON.stringify(patient, null, 2));
    console.log("================================");

    // Knowledge Nodes
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

    // For current schema, keep all nodes
    const filteredNodes = nodes;
    const cohortNodes = filteredNodes;

    // Hospital Knowledge
    const hospitalKnowledge = cohortNodes.filter(
      (node) =>
        node.hierarchy_level_id === "HL-01" ||
        node.hierarchy_level_id === "HL-GLOBAL"
    );

    // Department Knowledge
    const departmentKnowledge = [];

    // Patient Knowledge
    const patientKnowledge = [];

    // Prompt Context
    const context = `
You are a clinical AI assistant.

QUESTION:
${question}

PATIENT DETAILS:

Name: ${patient.name}
Age: ${patient.age}
Gender: ${patient.gender}
Diagnosis: ${patient.diagnosis}
Fasting Schedule: ${patient.fasting_schedule}

Medications:
${JSON.stringify(patient.medications, null, 2)}

HOSPITAL KNOWLEDGE:
${nodes.map((node) => node.content).join("\n")}

IMPORTANT RULES:

1. Use the patient details above.
2. If age exists, use the age.
3. If medications exist, use the medications.
4. Do NOT say information is unavailable if it is clearly present.
5. Use the patient diagnosis and medication list when answering.

Return exactly:

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

    const result = await model.generateContent(context);

    const answer = result.response.text();

    console.log("================================");
    console.log("AI ANSWER");
    console.log(answer);
    console.log("================================");

    return res.json({
      question,
      answer,
      stats: {
        totalNodes: nodes.length,
        hospitalNodes: hospitalKnowledge.length,
        departmentNodes: departmentKnowledge.length,
        patientNodes: patientKnowledge.length,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;