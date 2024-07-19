const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { geminiAIController } = require("../controllers/openAIController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  geminiAIController
);

module.exports = openAIRouter;
