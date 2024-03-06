const axios = require('axios');

const Prefixes = [
  '#ai',
  'bot',
  'ia',
  '/ai',
  'zen',
  'ai',
  'ask',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("Veuillez poser la question à votre convenance et je m'efforcerai de vous fournir une réponse efficace🤓. Votre satisfaction est ma priorité absolue😼. (𝙀́𝙙𝙞𝙩 𝙗𝙮 𝙏𝙠 𝙅𝙤𝙚𝙡 ㋡");
        return;
      }

await message.reply("💬🧘🏾‍♂|veillez Patientez s'il-vous-plait...(𝙀́𝙙𝙞𝙩 𝙗𝙮 𝙏𝙠 𝙅𝙤𝙚𝙡 ㋡)");

      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply(answer);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
