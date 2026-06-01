const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
    try{
        const {questionId, userId, answerText} = req.body;

        const {data: question, error: questionError} = await supabase
        .from("knowledge_questions")
        .select("*")
        .eq("id", questionId)
        .single();


        if (questionError) {
            return res.status(404).json({
                message: questionError.message, 
            })

    }

    const {data: user, error: userError} = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

    if(userError) {
        return res.status(404).json({
            message: userError.message,
        })
    }


    const nodeId = `NODE-${Date.now()}`;

    const {data: node, error: nodeError} = await supabase
    .from("knowledge_nodes")
    .insert([{
        id: nodeId,
        org_id: question.org_id,
        hierarchy_level_id: question.target_hierarchy_level,
          type: question.type_hint,
          title: `Generated from ${question.id}`,
          content: answerText,
          importance: question.importance_default,
          zone: 1,
          status: "ACTIVE",
          department: question.department,
          derivability_score: 0.0,
          source_question_id: question.id,
          created_by: user.id,
    }]).select()
    .single();

    if(nodeError) {
        return res.status(500).json({
            message: nodeError.message,

        });
    }

    const {error: answerError} = await supabase
    .from("question_answers")
    .insert([
        {
            question_id: question.id,
            user_id: userId,
            answer_text: answerText,
            node_id: node.id,

        },
    ])

    if(answerError) {
        return res.status(500).json({
            message: answerError.message,

        })
    }

    res.status(201).json({
        success: true,
        node,
    });
} catch (err) {
    res.status(500).json({
        message: err.message,
    })
}


})

module.exports = router;