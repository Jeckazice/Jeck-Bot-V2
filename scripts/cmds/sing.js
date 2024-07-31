const fs = require('fs');
const axios = require('axios');
const path = require('path');

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

module.exports = {
    config: {
        name: "sing",
        version: "4.6",
        author: "ArYAN",
        shortDescription: { 
            en: 'Search and download music' 
        },
        longDescription: { 
            en: "Search for music and download the first result or select a specific track." 
        },
        category: "music",
        guide: { 
            en: '{p}s <song name> - Search for a song\n' +
                'Example:\n' +
                '  {p}s Blinding Lights\n' +
                'After receiving the search results, reply with the song ID to download the track.\n' +
                'Reply with "1 to 12" to download the first track in the list.'
        }
    },

    onStart: async function ({ api, event, args }) {
        if (args.length === 0) {
            return api.sendMessage("Please provide the name of the song you want to search.", event.threadID, event.messageID);
        }

        const searchQuery = encodeURIComponent(args.join(" "));
        const apiUrl = `https://c-v1.onrender.com/yt/s?query=${searchQuery}`;

        try {
            api.sendMessage("🎵 | Searching for music. Please wait...", event.threadID, event.messageID);
            const response = await axios.get(apiUrl);
            const tracks = response.data;

            if (tracks.length > 0) {
                const topTracks = tracks.slice(0, 12);
                let message = "🎶 𝗬𝗼𝘂𝗧𝘂𝗯𝗲\n━━━━━━━━━━━━━\n\n🎶 | Here are the top 12 tracks\n\n";

                for (const track of topTracks) {
                    message += `🆔 𝗜𝗗: ${topTracks.indexOf(track) + 1}\n`;
                    message += `📝 𝗧𝗶𝘁𝗹𝗲: ${track.title}\n`;
                    message += `📅 𝗥𝗲𝗹𝗲𝗮𝘀𝗲 𝗗𝗮𝘁𝗲: ${new Date(track.publishDate).toLocaleDateString()}\n`;
                    message += `👤 𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${track.channelTitle}\n`;
                    message += `👁 𝗩𝗶𝗲𝘄𝘀: ${track.viewCount}\n`;
                    message += `👍 𝗟𝗶𝗸𝗲𝘀: ${track.likeCount}\n`;
                    message += "━━━━━━━━━━━━━\n";
                }

                message += "\nReply with the number of the song ID you want to download.";
                api.sendMessage({
                    body: message
                }, event.threadID, (err, info) => {
                    if (err) {
                        console.error('Error sending message:', err);
                        return api.sendMessage("🚧 | An error occurred while processing your request. Please try again later.", event.threadID);
                    }
                    global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, messageID: info.messageID, author: event.senderID, tracks: topTracks });
                });
            } else {
                api.sendMessage("❓ | Sorry, couldn't find the requested music.", event.threadID);
            }
        } catch (error) {
            console.error('Error during search:', error.message);
            api.sendMessage("🚧 | An error occurred while processing your request. Please try again later.", event.threadID);
        }
    },

    onReply: async function ({ api, event, Reply, args }) {
        const reply = parseInt(args[0]);
        const { author, tracks } = Reply;

        if (event.senderID !== author) return;

        try {
            if (isNaN(reply) || reply < 1 || reply > tracks.length) {
                throw new Error("Invalid selection. Please reply with a number corresponding to the track.");
            }

            const selectedTrack = tracks[reply - 1];
            const videoUrl = selectedTrack.videoUrl;
            const downloadApiUrl = `https://c-v1.onrender.com/yt/d?url=${encodeURIComponent(videoUrl)}`;

            api.sendMessage("⏳ | Downloading your song, please wait...", event.threadID, async (err, info) => {
                if (err) {
                    console.error('Error sending download message:', err);
                    return api.sendMessage("🚧 | An error occurred while processing your request. Please try again later.", event.threadID);
                }

                try {
                    const downloadLinkResponse = await axios.get(downloadApiUrl);
                    const downloadLink = downloadLinkResponse.data.result.audio;

                    if (!downloadLink) {
                        throw new Error("Failed to get the download link.");
                    }

                    const filePath = path.join(cacheDir, `${Date.now()}.mp3`);
                    const writer = fs.createWriteStream(filePath);

                    const response = await axios({
                        url: downloadLink,
                        method: 'GET',
                        responseType: 'stream'
                    });

                    response.data.pipe(writer);

                    writer.on('finish', () => {
                        api.setMessageReaction("✅", info.messageID);

                        api.sendMessage({
                            body: `🎶 𝗬𝗼𝘂𝗧𝘂𝗯𝗲\n\n━━━━━━━━━━━━━\nHere's your music ${selectedTrack.title}.\n\n📒 𝗧𝗶𝘁𝗹𝗲: ${selectedTrack.title}\n📅 𝗣𝘂𝗯𝗹𝗶𝘀𝗵 𝗗𝗮𝘁𝗲: ${new Date(selectedTrack.publishDate).toLocaleDateString()}\n👀 𝗩𝗶𝗲𝘄𝘀: ${selectedTrack.viewCount}\n👍 𝗟𝗶𝗸𝗲𝘀: ${selectedTrack.likeCount}\n\nEnjoy listening!...🥰`,
                            attachment: fs.createReadStream(filePath),
                        }, event.threadID, () => fs.unlinkSync(filePath));
                    });

                    writer.on('error', (err) => {
                        console.error('Error saving the file:', err);
                        api.sendMessage("🚧 | An error occurred while processing your request.", event.threadID);
                    });
                } catch (error) {
                    console.error('Error during download:', error.message);
                    api.sendMessage(`🚧 | An error occurred while processing your request: ${error.message}`, event.threadID);
                }
            });

        } catch (error) {
            console.error('Error handling reply:', error.message);
            api.sendMessage(`🚧 | An error occurred while processing your request: ${error.message}`, event.threadID);
        }

        api.unsendMessage(Reply.messageID);
        global.GoatBot.onReply.delete(Reply.messageID);
    }
};
