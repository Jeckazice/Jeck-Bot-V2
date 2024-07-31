const axios = require("axios");

module.exports = {
	config: {
		name: 'troll',
		version: '1.2',
		author: 'Xemon',
		countDown: 2,
		role: 0,
		shortDescription: 'troll AI',
		longDescription: {
			vi: 'Chat với simsimi',
			en: 'Chat with Anya'
		},
		category: 'funny',
		guide: {
			vi: '   {pn} [parle | Chute]: bật/tắt simsimi'
				+ '\n'
				+ '\n   {pn} <word>: chat nhanh với simsimi'
				+ '\n   Ví dụ:\n    {pn} hi',
			en: '   {pn} <word>: chat with hina'
				+ '\n   Example:\n    {pn} hi'
		},
		permittedUsers: ['100079402482429']
	},

	langs: {
		vi: {
			turnedOn: 'Bật simsimi thành công!',
			turnedOff: 'Tắt simsimi thành công!',
			chatting: 'Đang chat với simsimi...',
			error: 'Simsimi đang bận, bạn hãy thử lại sau'
		},
		en: {
			turnedOn: '𝑽𝒊𝒗𝒆 𝒍𝒂 𝒍𝒊𝒃𝒆𝒓𝒕𝒆́🤌 𝒅 𝒆𝒙𝒑𝒓𝒆𝒔𝒔𝒊𝒐𝒏😺 𝑶𝒉 𝒀𝒆𝒔𝒔 𝑴𝒆𝒓𝒄𝒊 𝑩𝒐𝒔𝒔 🥺🖕!',
			turnedOff: '𝐼𝑙 𝑒𝑠𝑡 𝑡𝑒𝑚𝑝𝑠 𝑑𝑒 𝑚𝑒 𝑟𝑒𝑝𝑜𝑠𝑒𝑟 💤 𝐴 𝑝𝑙𝑢𝑠 𝐵𝑜𝑠𝑠 👊!',
			chatting: 'Already Chatting with Troll',
			error: '𝐐𝐮𝐨𝐢  𝐌𝐞𝐫*𝐝𝐞?🤨! '
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		const permittedUsers = this.config.permittedUsers;
		if (args[0] === 'parle' || args[0] === 'Chute') {
			if (!permittedUsers.includes(event.senderID)) {
				return message.reply("You are not permitted to use this command🖕.");
			}
			await threadsData.set(event.threadID, args[0] === "parle", "settings.simsimi");
			return message.reply(args[0] === "parle" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage, "fr");
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async function ({ args, message, threadsData, event, isUserCallCommand, getLang }) {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const responseMessage = await getMessage(args.join(" "), "fr");
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
		'https://api.simsimi.vn/v1/simtalk',
		new URLSearchParams({
			'text': yourMessage,
			'lc': langCode
		})
	);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
                            }
