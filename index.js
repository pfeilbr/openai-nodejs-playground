import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';
import readline from 'readline-sync';
import dotenv from 'dotenv'
dotenv.config();


const saveStringToFile = (str, filename) => {
    fs.writeFileSync(filename, str);
}

const readLine = () => {
    return readline.question('> ');
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const messages = []

async function main() {
    
    messages.push({"role": "system", "content": "You are a helpful assistant."});
    
    while (true) {
        const prompt = readLine();
        messages.push({"role": "user", "content": prompt});
        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages
            })
            //console.log(JSON.stringify(completion.data, null, 2));
            messages.push(completion.data.choices[0].message); // keep context
            saveStringToFile(JSON.stringify(messages, null, 2), 'messages.json');
            console.log(completion.data.choices[0].message.content);
        } catch(err) {
            console.error(err);
        }
    }
}

main();
    
