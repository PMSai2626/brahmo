const express = require("express");
const cors = require("cors");

require("dotenv").config();
const userRoutes = require("./routes/users.routes");
const questionRoutes = require("./routes/questions.routes");
const answerRoutes = require("./routes/answers.routes");
const contextRoutes = require("./routes/context.routes");
const compareRoutes = require("./routes/compare.routes");
const askRoutes = require("./routes/ask.routes");
const patientRoutes = require("./routes/patients.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/context", contextRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/patients", patientRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Brahmo backend running successfully",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
