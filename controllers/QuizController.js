// Ensure you have node-fetch installed

// const GEMINI_API_KEY = "AIzaSyCWkN0KDOugV_37GfyLTuykMTuh2DKyaVQ"; // Replace with your actual API key

const GEMINI_API_KEY = "AIzaSyCh3EoFNilJ3zQVrUOMadqbHwKkzqpfWE4";

const generateQuiz = async (req, res) => {
  try {
    const { noOfQuiz, skills, difficultyLevel } = req.query;

    const skillsArray = skills.split(",");

    const skillsString = skillsArray.join(",");
    console.log(noOfQuiz, skillsString, difficultyLevel);
    const sample = `[
      {
        "question": "What does HTML stand for?",
        "options": [
          "HyperText Markup Language",
          "Hyperlinks and Text Markup Language",
          "Home Tool Markup Language",
          "Hyper Transfer Markup Language"
        ],
        "correctAnswer": "HyperText Markup Language",
        "explanation": "HTML stands for HyperText Markup Language. It's the foundation of all web pages.",
        "similarAnswers": [
          "Hyperlinks and Text Markup Language (close, but not quite accurate)"
        ]
      }
    ]`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Generate ${noOfQuiz} ${skillsString} multi-choice questions with answers at difficulty level ${difficultyLevel}  with feedback (in these names - question,options,correctAnswer,explanation: for answer also include similar answers)   
              
              Sample format :
              ${sample}
              `,
            },
          ],
        },
      ],
    };
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Parse the response
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    // console.log(data);

    // Extract and format the quiz content
    // const quiz =
    //   data?.contents?.[0]?.parts?.[0]?.text || "No quiz content generated.";
    // transformQuizData(jsonResponse);
    const transformed = transformQuizData(data);
    console.log(transformed);

    res.status(200).json({ transformed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sample usage
const jsonResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: `[
              {
                "question": "Which of the following is NOT a valid HTML tag?",
                "options": ["<p>", "<div>", "<span>", "<img>", "<br>", "<td>"],
                "correctAnswer": "<td>",
                "explanation": "<td> is a table data tag. It's not a standalone tag like the others. It must be used inside <table>, <tr> tags."
              },
              {
                "question": "What does CSS stand for?",
                "options": ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
                "correctAnswer": "Cascading Style Sheets",
                "explanation": "CSS stands for Cascading Style Sheets. It's used to style HTML elements."
              }
            ]`,
          },
        ],
        role: "model",
      },
    },
  ],
};

function transformQuizData(data) {
  const parts = data?.candidates[0]?.content.parts[0].text;

  // Extract the JSON inside the backticks
  const match = parts.match(/```json\n([\s\S]+)\n```/);
  if (!match) {
    throw new Error("Invalid format: JSON content not found.");
  }

  // Parse and return the transformed JSON
  const jsonContent = JSON.parse(match[1]);

  const transformedContent = jsonContent.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  // return `const sample = \`${JSON.stringify(jsonContent, null, 2)}\`;`;
  return transformedContent;
}

// const transformed = transformQuizData(jsonResponse);
// console.log(transformed);

module.exports = { generateQuiz };
