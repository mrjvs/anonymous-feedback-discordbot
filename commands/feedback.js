const { setUserBusy, setUserNotBusy } = require('../utils/busy')
const { startButtonPrompt, PromptTimeout } = require('../utils/prompt/button')
const { startMessagePrompt, PromptCancel } = require('../utils/prompt/message')
const config = require("../utils/config")

const yearButtonTimeout = 20000; // in milliseconds
const feedbackTimeout = 20000; // in milliseconds
const confirmTimeout = 20000; // in milliseconds
const yearButtons = [
	{ type: 'default', emoji: '4️⃣', value: 'year4' },
	{ type: 'default', emoji: '5️⃣', value: 'year5' },
	{ type: 'default', emoji: '6️⃣', value: 'year6' },
	{ type: 'default', emoji: '🇲', value: 'masters' },
]
const confirmButtons = [
	{ type: 'default', emoji: '✅', value: true },
	{ type: 'default', emoji: '❌', value: false },
]

function sendInitialMessage(channel) {
	return channel.send('hi there!');
}

async function saveFeedback(client, feedback) {
	if (!config.channelID) return
	const channel = await client.channels.fetch(config.channelID);
	channel.send(`**new feedback**\nYear: ${feedback.year}\nFeedback: \`\`\`${feedback.feedback}\`\`\``)
}

module.exports = {
	command: 'feedback',
	dmOnly: false,
	async run({ msg }) {
		// ensure its a dm channel
		let channel = msg.channel;
		if (msg.channel.type !== 'dm') {
			channel = await msg.author.createDM();

			try {
				await sendInitialMessage(channel)
			} catch (err) {
				msg.channel.send('Whoops, I can\'t DM you it seems, please enable your DM\'s')
				return
			}

			msg.channel.send('Hey there, let\'s continue in DM\'s!')
		} else {
			await sendInitialMessage(channel)
		}

		// start prompt
		try {
			setUserBusy(msg.author.id, channel.id);

			// get year
			const yearIndex = await startButtonPrompt(channel, msg.author, 'button collector', yearButtons, yearButtonTimeout)
			const year = yearButtons[yearIndex].value;

			// get feedback
			const feedback = await startMessagePrompt(channel, msg.author, 'message collector', feedbackTimeout)
			
			// confirm prompt
			const confirmIndex = await startButtonPrompt(channel, msg.author, 'Do you want to confirm', confirmButtons, confirmTimeout)
			const confirmed = confirmButtons[confirmIndex].value;
			if (!confirmed) throw new PromptCancel();

			// feedback successful, saving
			await saveFeedback(channel.client, {
				year,
				feedback: feedback.content
			})
			await channel.send('Thank you for your feedback, it has been recorded anonymously!');
		} catch (err) {
			if (err instanceof PromptTimeout) {
				channel.send("Whoops, you waited too long. we've closed the prompt for you.")
				return
			}
			if (err instanceof PromptCancel) {
				channel.send("Feedback cancelled. have a nice day :)")
				return
			}
			console.error(err);
			channel.send("whoops, something went wrong, please try again later");
		} finally {
			setUserNotBusy(msg.author.id, channel.id);
		}
	}
}
