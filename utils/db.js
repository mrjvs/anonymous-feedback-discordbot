const config = require("./config")
const { PromiseQueue } = require("./queue")
const feedbackSendQueue = new PromiseQueue();
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

	await feedbackSendQueue.add(async () => {
		await channel.send({
			embed: {
				title: 'New feedback',
				description: `**Year:** ${feedback.year}\nRest of feedback can be read below`
			},
			...sendOptions
		})
		for (const chunk of splittedFeedback) {
			await channel.send(chunk, sendOptions)
		}
	})
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

	const oneSuccess = channelWorked || dbWorked
	if (oneSuccess)
		console.log("Successfully saved some feedback")
	return oneSuccess;
}

module.exports = {
	setup,
	saveFeedback,
}
