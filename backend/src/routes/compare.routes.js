const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.post("/", async (req, res) => {
  try {
    const { userId, patientId, question } = req.body;

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

    const { data: nodes, error: nodesError } = await supabase
  .from("knowledge_nodes")
  .select("*");

if (nodesError) {
  return res.status(500).json({
    message: nodesError.message,
  });
}

const filteredNodes = nodes.filter((node) => {
  // Hospital-wide rules
  if (!node.department) {
    return true;
  }

  // Department rules
  if (node.department === patient.department) {
    return true;
  }

  return false;
});

const { data: questions } = await supabase
  .from("knowledge_questions")
  .select("*");

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

  return patientCohorts.includes(sourceQuestion.cohort_tag);
});



const hospitalNodes = cohortNodes.filter(
  node =>
    node.hierarchy_level_id === "HL-01" ||
    node.hierarchy_level_id === "HL-GLOBAL"
);

const departmentNodes = cohortNodes.filter(
  node =>
    node.hierarchy_level_id === "HL-05-MED" ||
    node.hierarchy_level_id === "HL-08-MED"
);

const patientNodes = cohortNodes.filter(
  node =>
    node.hierarchy_level_id.includes("PAT")
);

    res.json({
  question,

  hospitalKnowledge: hospitalNodes,

  departmentKnowledge: departmentNodes,

  patientKnowledge: patientNodes,

  stats: {
    totalNodes: nodes.length,
    afterDepartmentFilter: filteredNodes.length,
    afterCohortFilter: cohortNodes.length,
    hospitalNodes: hospitalNodes.length,
    departmentNodes: departmentNodes.length,
    patientNodes: patientNodes.length,
  },
});


  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;