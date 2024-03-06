module.exports = {
  config: {
    name: "zengc",
    version: "1.0",
    author: "SiAM",
    countDown: 30,
    role: 0,
    shortDescription: {
      en: "Add user to support group"
    },
    longDescription: {
      en: "This command adds the user to the admin support group."
    },
    category: "support",
    guide: {
      en: "To use this command, simply type -support."
    }
  },

  onStart: async function ({ api, args, message, event }) {
    const supportGroupId = "7400373346668414"; // ID of the support group

    const threadID = event.threadID;
    const userID = event.senderID;

    // Check if the user is already in the support group
    try {
      const threadInfo = await api.getThreadInfo(supportGroupId);
      const participantIDs = threadInfo.participantIDs;
      if (participantIDs.includes(userID)) {
        // User is already in the support group
        api.sendMessage(
          "✅ 𝐓𝐮 𝐚𝐬 𝐝𝐞́𝐣𝐚̀ 𝐞́𝐭𝐞́ 𝐚𝐣𝐨𝐮𝐭𝐞𝐫 𝐝𝐚𝐧𝐬 𝐥𝐞 𝐠𝐫𝐨𝐮𝐩𝐞 𝐬𝐢 𝐭𝐮 𝐧𝐞 𝐥𝐞 𝐭𝐫𝐨𝐮𝐯𝐞 𝐩𝐚𝐬, 𝐯𝐞́𝐫𝐢𝐟𝐢𝐞 𝐭'𝐚 𝐛𝐨𝐢𝐭𝐞 𝐝'𝐢𝐧𝐯𝐢𝐭𝐚𝐭𝐢𝐨𝐧 𝐩𝐚𝐬 𝐦𝐬𝐠 𝐨𝐮 𝐭'𝐚 𝐛𝐨𝐢𝐭𝐞 𝐝𝐞 𝐬𝐩𝐚𝐦😉.",
          threadID
        );
      } else {
        // Add user to the support group
        api.addUserToGroup(userID, supportGroupId, (err) => {
          if (err) {
            console.error("Failed to add user to support group:", err);
            api.sendMessage(
              "I can't add you because your ID is not allowed to message or your account is private. Please add me and try again...",
              threadID
            );
          } else {
            api.sendMessage(
              "✅ 𝐓'𝐚 𝐞́𝐭𝐞́ 𝐚𝐣𝐨𝐮𝐭𝐞𝐫 𝐝𝐚𝐧𝐬 𝐥𝐞 𝐠𝐫𝐨𝐮𝐩𝐞 𝐝𝐞 𝐦𝐨𝐧 𝐜𝐫𝐞́𝐚𝐭𝐞𝐮𝐫💌. 𝐏𝐚𝐬𝐬𝐞 𝐮𝐧 𝐛𝐧 𝐦𝐨𝐦𝐞𝐧𝐭 💬🌺, 𝐬𝐢 𝐭𝐮 𝐧'𝐚𝐫𝐫𝐢𝐯𝐞 𝐩𝐚𝐬 𝐚 𝐫𝐞𝐭𝐨𝐮𝐯𝐞𝐫 𝐥𝐞 𝐠𝐫𝐨𝐮𝐩𝐞 𝐫𝐞𝐠𝐚𝐫𝐝𝐞 𝐝𝐚𝐧𝐬 𝐭𝐞𝐬 𝐢𝐧𝐯𝐢𝐭𝐚𝐭𝐢𝐨𝐧 𝐩𝐚𝐬 𝐦𝐬𝐠 𝐨𝐮 𝐝𝐚𝐧𝐬 𝐭'𝐚 𝐛𝐨𝐢𝐭𝐞 𝐝𝐞 𝐬𝐩𝐚𝐦😉.",
              threadID
            );
          }
        });
      }
    } catch (e) {
      console.error("Failed to get thread info:", e);
      api.sendMessage(
        "Failed to retrieve the support group information. Please try again later.",
        threadID
      );
    }
  }
};
