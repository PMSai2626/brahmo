const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/:userId/:patientId", async (req, res) => {
  try {
    const { userId, patientId } = req.params;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: patient } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    const { data: nodes } = await supabase.from("knowledge_nodes").select("*");

    const filteredNodes = nodes.filter((node) => {
      if (!node.department) {
        return true;
      }

      if (node.department === patient.department) {
        return true;
      }
      return false;
    });

    res.json({
      user: user.name,
      patient: patient.name,
      nodeCount: filteredNodes.length,
      nodes: filteredNodes,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
