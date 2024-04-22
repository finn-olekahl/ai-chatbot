import OpenAI from "openai";
const openai = new OpenAI();

export default defineEventHandler(async () => {
    const data: any = await $fetch("/api/settings/get_prompt");
    
    let instructions: string = data.standard;
    instructions += "\n\n__FAQ__";
    for (const key in data.faq) {
        instructions += `\n\nFrage: ${key}\n\nAntwort: ${data.faq[key]}`;
    }


    const assistant = await openai.beta.assistants.create({
        name: "BUGLAND Support ChatBot",
        instructions: instructions,
        model: "gpt-3.5-turbo-1106"
      });

    return {
        assistant
    }  
});