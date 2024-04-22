import OpenAI from "openai";
const openai = new OpenAI();


export default defineEventHandler(async (event) => {
    const assistant = await openai.beta.assistants.create({
        name: "Math Tutor",
        instructions: "You are a personal math tutor. Write and run code to answer math questions.",
        model: "gpt-4-turbo"
      });

    return {
        assistant
    }  
});