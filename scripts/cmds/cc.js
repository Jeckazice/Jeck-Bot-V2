module.exports = {
    config: {
        name: "cc",
        version: "1.0",
        author: "TK joel",
        countDown: 5,
        role: 0,
        shortDescription: "sarcasm",
        longDescription: "sarcasm",
        category: "reply",
    },
    onStart: async function(){}, 
    onChat: async function({
        event,
        message,
        getLang
    }) {
        if (event.body && event.body.toLowerCase() == "cc") return message.reply("👋 𝑪𝒐𝒎𝒎𝒆𝒏𝒕 𝒗𝒂𝒔 𝒕𝒖 𝒃𝒓𝒐 ? 𝑬́𝒄𝒓𝒊𝒕 @trollgc 𝒆𝒕 𝒋𝒆 𝒗𝒂𝒊𝒔 𝒅𝒆 𝒕𝒆́𝒍𝒆́𝒑𝒐𝒓𝒕𝒆́ 𝒗𝒆𝒓𝒔 𝒖𝒏 𝒏𝒐𝒖𝒗𝒆𝒂𝒖 𝒖𝒏𝒊𝒗𝒆𝒓𝒔 🌌");
    }
};
