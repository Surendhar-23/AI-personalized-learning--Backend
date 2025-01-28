const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectdb } = require("./db");
const quizRoutes = require("./routes/quizRoutes");
// const dspRoutes = require("./routes/DSPRoutes");
// const spRoutes = require("./routes/SPRoutes");
// const digRoutes = require("./routes/DIGRoutes");
// const igRoutes = require("./routes/IGRoutes");
// const locationRoutes = require("./routes/locationRoutes");
const path = require("path");
const upload = require("./middleware/multerconfig");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// Configure CORS to allow requests from specific origin
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Include OPTIONS to handle preflight
    allowedHeaders: "*", // Allow all headers
    credentials: true, // Allow credentials (if needed)
  })
);

// Handle preflight requests for all routes
app.options("*", cors()); // This will handle the OPTIONS preflight request for all routes

connectdb();

app.use("/test", (req, res) => {
  res.send("testing22");
});

app.use("/api/quizgenerate", quizRoutes);

app.listen(3000, () => console.log("server running"));
