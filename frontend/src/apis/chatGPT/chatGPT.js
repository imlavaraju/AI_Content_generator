import axios from "axios";
//=======Registration=====

export const generateContentAPI = async (userPrompt) => {
  const response = await axios.post(
    "https://ai-content-generator-lsi9-git-main-lavarajus-projects.vercel.app/api/v1/openai/generate-content",
    {
      prompt: userPrompt,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
