const config = require("./config")
let client;

async function setup(c) {
  client = c;
}

async function saveFeedbackChannel(feedback) {
	if (!config.channelID) return false;
	const channel = await client.channels.fetch(config.channelID);
	const sendOptions = {
		allowedMentions: {
			parse: [] // tagging :P
		}
	}
	const splittedFeedback = feedback.feedback.match(/(.|\n){1,1900}/g);

	await channel.send(`**new feedback**\nYear: ${feedback.year}\nFeedback:`, sendOptions)
	for (const chunk of splittedFeedback) {
		await channel.send(chunk, sendOptions)
	}
	return true;
}

async function saveFeedbackDB(feedback) {
	return false;
}

async function saveFeedback(feedback) {
	let channelWorked = false;
	let dbWorked = false;

	try {
		channelWorked = await saveFeedbackChannel(feedback);
	} catch (err) {
		console.error("Error saving feedback to channel", err);
	}

	try {
		dbWorked = await saveFeedbackDB(feedback);
	} catch (err) {
		console.error("Error saving feedback to database", err);
	}

	return channelWorked || dbWorked;
}

module.exports = {
	setup,
	saveFeedback,
}
