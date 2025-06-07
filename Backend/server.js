const mongoose = require("mongoose");
const express = require("express");
const { spawn } = require("child_process"); // Import child_process to run Python
const cors = require("cors");
require("dotenv").config();

const app = express();

//connecting to MongoDB Atlas
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
        });
        console.log("MongoDB connected...");
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
};

//defining the mongoDB schema for Courses + modules + topic covered in modules

// Schema for content categorized by expertise level
const categorizedContentSchema = new mongoose.Schema({
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true }, // Expertise level
    content: { type: String, required: true } // Content for this level
});

// Schema for topics within a module
const topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    categorizedContent: [categorizedContentSchema] // New field to store content based on expertise level
});

// Schema for modules within a course (eg: Broken Acces Control)
const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    overview: { type: String, required: true },
    topics: [topicSchema] // Stores multiple topics under each module
});

// Schema for courses (eg: OWASP Top 10 Vuln.)
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    modules: [moduleSchema]
});

//to store the 10 topics on which the quiz questions are based
const topicSchema2 = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Topic ID
    title: { type: String, required: true }, // Topic name
    completed: { type: Boolean, default: false } // Whether the user has completed this topic
});

const questionSchema = new mongoose.Schema({
    topicId: { type: Number, required: true, ref: "Topic" }, // Link to Topic
    questionId: { type: Number, required: true, unique: true }, // Unique question ID
    question: { type: String, required: true }, // Question text
    options: [{ type: String, required: true }], // Array of options
    correctAnswer: { type: Number, required: true } // Index (1-based) of the correct option
});

//schema to store the user quizResults
const quizResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Link to course
    responses: [
        {
            questionId: { type: Number, required: true },
            selectedAnswer: { type: Number, required: true },
            isCorrect: { type: Boolean, required: true }
        }
    ],
    score: { type: Number, required: true },
    evaluation: { type: Map, of: String, required: true }, // Stores skill level per topic
    recommendedCourses: [{ type: String, ref: "Topic" }] // Recommended Topics
}, { timestamps: true });

// Creating Mongoose Model
const Course = mongoose.model("Course", courseSchema);
const Topic = mongoose.model("Topic", topicSchema2);
const Question = mongoose.model("Question", questionSchema);
const QuizResults = mongoose.model("QuizResults", quizResultSchema);

//middleware
app.use(cors());
app.use(express.json());

connectDB();

//initial route to add course data (OWASP TOP 10 Vuln)
app.post("/add", async(req,res)=>{
    try{
        const course= new Course(req.body);
        await course.save();
        res.json({success:true, message:"Course added successfully"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

//route to add a module inside a course
app.post("/:title/modules/add", async(req,res)=>{
    try{
        const course = await Course.findOne({title: req.params.title});
        if(!course) return res.status(404).json({message:"Course nahi mila"});

        course.modules.push(req.body);
        await course.save();
        res.json({ success: true, message: "Module added successfully" });
    }catch(err) {
        res.status(500).json({ error: err.message });
    }

});

// ✅ Route to add topics for the quiz
app.post("/quiz/topics/add", async (req, res) => {
    try {
        const topics = req.body; // Expecting an array of topics
        await Topic.insertMany(topics);
        res.json({ success: true, message: "Topics added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/quiz/questions/add", async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { questions } = req.body;
        
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Invalid request format. 'questions' must be a non-empty array." });
        }

        console.log("Inserting questions:", questions);
        await Question.insertMany(questions);
        res.json({ success: true, message: "Questions added successfully" });
    } catch (err) {
        console.error("Error inserting questions:", err);
        res.status(500).json({ error: err.message });
    }
});


// Route to fetch all shuffled questions for the quiz
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

// Route to fetch quiz results for a specific userId
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
                message: "No quiz result found for this user."
            });
        }

        res.json({
            hasResult: true,
            evaluation: result.evaluation,
            recommendedCourses: result.recommendedCourses,
            score: result.score,
            createdAt: result.createdAt
        });
    } catch (err) {
        console.error(" Error fetching quiz result:", err);
        res.status(500).json({ error: "Server error while fetching quiz result" });
    }
});


// Inside your Express.js backend route at /evaluate
app.post("/evaluate", async (req, res) => {
    try {
        const { userId, courseId, responses } = req.body;

        // Validate inputs
        if (!userId || !courseId || !Array.isArray(responses) || responses.length !== 30) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Convert responses to binary answers for Python
        const binaryAnswers = responses.map((resp) => resp.isCorrect ? 1 : 0);

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
                return res.status(500).json({ error: "Python script execution failed" });
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
                        recommendedCourses
                    }
                });
            } catch (err) {
                console.error("JSON parsing/saving error:", err);
                return res.status(500).json({ error: "Failed to parse or save result" });
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

//get course data according to the title
app.get("/:title", async(req,res)=>{
    try {
        const course = await Course.findOne({ title: req.params.title });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`server running on http://localhost:${PORT}`));