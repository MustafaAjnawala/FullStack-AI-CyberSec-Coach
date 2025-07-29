const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { spawn } = require("child_process"); // Import child_process to run Python script
const cors = require("cors");
const { authenticateToken } = require("./middlewares/auth");
const { setUser } = require("./service/auth");
const { error } = require("console");
require("dotenv").config();

const app = express();

//connecting to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

//defining the mongoDB schema for Courses + modules + topic covered in modules
// Schema for courses (eg: OWASP Top 10 Vuln.)
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

//to store the 10 topics on which the quiz questions are based
const topicSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Topic ID
  title: { type: String, required: true }, // Topic name
  completed: { type: Boolean, default: false }, // Whether the user has completed this topic
});

const questionSchema = new mongoose.Schema({
  topicId: { type: Number, required: true, ref: "Topic" }, // Link to Topic
  questionId: { type: Number, required: true, unique: true }, // Unique question ID
  question: { type: String, required: true }, // Question text
  options: [{ type: String, required: true }], // Array of options
  correctAnswer: { type: Number, required: true }, // Index (1-based) of the correct option
});

//schema to store the user quizResults
const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Link to user
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // Link to course
    responses: [
      {
        questionId: { type: Number, required: true },
        selectedAnswer: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: { type: Number, required: true },
    evaluation: { type: Map, of: String, required: true }, // Stores skill level per topic
    recommendedCourses: [{ type: String, ref: "Topic" }], // Recommended Topics
  },
  { timestamps: true }
);

const courseContentSchema = new mongoose.Schema({}, { strict: false }); // Flexible schema could be anything

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Creating Mongoose Models for all collections
const Course = mongoose.model("Course", courseSchema);
const Topic = mongoose.model("Topic", topicSchema);
const Question = mongoose.model("Question", questionSchema);
const QuizResults = mongoose.model("QuizResults", quizResultSchema);
const CourseContent = mongoose.model(
  "CourseContent",
  courseContentSchema,
  "CourseContent"
);
const User = mongoose.model("User", userSchema);

//middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

//route that allows user to register is not already present
app.post("/auth/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    //checking if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User with this email or username already exists",
      });
    }

    ///creating a new user
    const user = new User({ name, username, email, password });
    await user.save();

    //generating the JWT
    const token = setUser(user);

    //setting teh http-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days in millisec
    });

    res.status(201).json({
      success: true,
      msg: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

//route to let user login in the service
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (!user || user.password !== password) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    const token = setUser(user);

    // Set HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      msg: "Login successful",
      user: user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

//Route to check if the user is still logged in/authenticated to access webpage
app.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
});

//route to logout the user and clear authentication cookie
app.post("/auth/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ success: true, message: "Logged out successfully" });
});

// ✨Route to fetch all shuffled questions for the quiz
app.get("/quiz/questions", async (req, res) => {
  try {
    let questions = await Question.find();

    // Shuffle the questions array using Fisher-Yates shuffle algorithm
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✨Inside your Express.js backend route at /evaluate
app.post("/evaluate", async (req, res) => {
  try {
    const { userId, courseId, responses } = req.body;

    // Validate inputs
    if (
      !userId ||
      !courseId ||
      !Array.isArray(responses) ||
      responses.length !== 30
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Convert responses to binary answers for Python
    const binaryAnswers = responses.map((resp) => (resp.isCorrect ? 1 : 0));

    const python = spawn("python", ["evaluate.py"]);

    let result = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", async (code) => {
      if (code !== 0 || errorOutput) {
        console.error("⚠️ Python error:", errorOutput);
        return res
          .status(500)
          .json({ error: "Python script execution failed" });
      }

      try {
        const output = JSON.parse(result); // { evaluation: {}, recommended_courses: [] }

        // Calculate quiz score
        const correctCount = binaryAnswers.reduce((acc, val) => acc + val, 0);
        const score = correctCount;

        // get recommended topics IDs from DB
        const recommendedCourses = [];
        for (const rec of output.recommended_courses) {
          const course = await Topic.findOne({ title: rec.category });
          if (course) recommendedCourses.push(course.title);
          else console.log(course);
        }

        // Save the result to MongoDB
        const quizResult = new QuizResults({
          userId,
          courseId,
          responses,
          score,
          evaluation: output.evaluation,
          recommendedCourses,
        });

        console.log("Saving responses to DB:", responses);

        await quizResult.save();

        console.log("Results saved, sending evaluation");
        return res.json({
          success: true,
          message: "Quiz evaluated and saved",
          result: {
            evaluation: output.evaluation,
            score,
            recommendedCourses,
          },
        });
      } catch (err) {
        console.error("JSON parsing/saving error:", err);
        return res
          .status(500)
          .json({ error: "Failed to parse or save result" });
      }
    });

    // Send input to Python
    python.stdin.write(JSON.stringify({ responses: binaryAnswers }));
    python.stdin.end();
  } catch (err) {
    console.error("Backend error:", err);
    return res.status(500).json({ error: "Evaluation failed" });
  }
});

// ✨Route to fetch quiz results for a specific userId
app.get("/quiz/results/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the most recent quiz result for the user (you can also use .findOne without sort if only 1 result exists)
    const result = await QuizResults.findOne({ userId })
      .sort({ createdAt: -1 }) // fetch latest result if multiple exist
      .select("evaluation recommendedCourses score createdAt"); // only return relevant fields

    if (!result) {
      return res.json({
        hasResult: false,
        message: "No quiz result found for this user.",
      });
    }

    res.json({
      hasResult: true,
      evaluation: result.evaluation,
      recommendedCourses: result.recommendedCourses,
      score: result.score,
      createdAt: result.createdAt,
    });
  } catch (err) {
    console.error(" Error fetching quiz result:", err);
    res.status(500).json({ error: "Server error while fetching quiz result" });
  }
});

//✨get course info data for all courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    if (!courses) return res.status(404).json({ message: "No Courses found" });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//✨to get the content for courses according to id
app.get("/api/course/:id", async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const courseContent = await CourseContent.find({ courseId });
    if (!courseContent || courseContent.length === 0) {
      return res
        .status(404)
        .json({ message: "No modules found for this course" });
    }

    res.json(courseContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
