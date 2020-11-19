const { setUserBusy, setUserNotBusy } = require('../utils/busy')
const { startButtonPrompt, PromptTimeout } = require('../utils/prompt/button')
const { startMessagePrompt, PromptCancel } = require('../utils/prompt/message')
const { saveFeedback } = require("../utils/db")

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
	{ type: 'default', emoji: '✅', value: 'send' },
	{ type: 'default', emoji: '❌', value: 'cancel' },
	{ type: 'default', emoji: '➡️', value: 'new' },
]

function sendInitialMessage(channel) {
	return channel.send('hi there!');
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

			let confirmed = 'new'
			let feedbacks = []
			while (confirmed === 'new') {
				// get feedback
				const feedback = await startMessagePrompt(channel, msg.author, 'message collector', feedbackTimeout)
				feedbacks.push(feedback.content);
				
				// confirm prompt
				const confirmIndex = await startButtonPrompt(channel, msg.author, 'Do you want to confirm, or add another message', confirmButtons, confirmTimeout)
				confirmed = confirmButtons[confirmIndex].value;
				if (confirmed == 'cancel') throw new PromptCancel();
			}

			// feedback successful, saving
			const success = await saveFeedback({
				year,
				feedback: feedbacks.join('\n\n')
			})
			if (!success) throw new Error("savingFailed")

			// success
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
