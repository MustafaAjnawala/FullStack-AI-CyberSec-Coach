// Pending Task File !!
// File for new Schema for entering Course content into DB

// Schema for courses (eg: OWASP Top 10 Vuln.)
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    modules: [moduleSchema]
});

// Schema for modules within a course (eg: Broken Acces Control)
const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    overview: { type: String, required: true },
    levels: [levelSchema] //  each level holds its own topics
  });

//schema for levels
const levelSchema = new mongoose.Schema({
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    topics: [topicSchema]
  });

//schema for topics under the particular module (eg: 1.1)
const topicSchema = new mongoose.Schema({
    title: {type: String, required: true},  
    subtopic: [subtopicSchema]

});

//schema for 1.1.1
const subtopicSchema = new mongoose.Schema({
    title : {type: String, required: true},
    content : [contentSchame]
});

//schema for main content
const contentSchame = new mongoose.Schema({
    heading: {type: String, required: true}, //heading just before the main content
    content: {type: String, required: true}
});