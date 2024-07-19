const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // Adjust configuration as needed
  temperature: 0.9,
  topP: 1,
  maxOutputTokens: 100,
  responseMimeType: "text/plain",
});

//----Gemini AI Controller----

const geminiAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    if (response && typeof response.text === "function") {
      const content = response.text();
      console.log(content);

      // Create the history
      const newContent = await ContentHistory.create({
        user: req?.user?._id,
        content,
      });

      // Push the content into the user
      let userFound = await User.findById(req?.user?.id);

      if (!userFound) {
        // If user not found, create a new user object with an empty contentHistory array
        userFound = new User({
          _id: req?.user?._id,
          contentHistory: [],
          apiRequestCount: 0,
        });
      }

      if (!userFound.contentHistory) {
        userFound.contentHistory = [];
      }

      userFound.contentHistory.push(newContent?._id);

      // Update the API request count
      userFound.apiRequestCount += 1;
      await userFound.save();

      res.status(200).json(content);
    } else {
      console.log("Error: Unable to retrieve text from response.");
      res
        .status(500)
        .json({ message: "Error: Unable to retrieve text from response." });
    }
  } catch (error) {
    console.error("Error during content generation:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  geminiAIController,
};
