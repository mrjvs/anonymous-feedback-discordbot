const { setUserBusy, setUserNotBusy } = require('../utils/busy')
const { startButtonPrompt, PromptTimeout } = require('../utils/prompt/button')
const { startMessagePrompt, PromptCancel } = require('../utils/prompt/message')
const { saveFeedback } = require("../utils/db")
const { text, timeouts } = require("../utils/config")

const yearButtonTimeout = timeouts.feedbackYear;
const feedbackTimeout = timeouts.feedbackMessage;
const confirmTimeout = timeouts.feedbackConfirm;
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
	return channel.send({
		embed: {
      title: text.feedbackStart.title,
      description: text.feedbackStart.text,
      color: text.colorInfo
		}
	});
}

const yearEmbed = {
	embed: {
		title: text.yearPrompt.title,
		description: text.yearPrompt.text,
		color: text.colorInfo
	}
}

const feedbackEmbed = {
	embed: {
		title: text.feedbackPrompt.title,
		description: text.feedbackPrompt.text,
		color: text.colorInfo
	}
}

const confirmEmbed = {
	embed: {
		title: text.confirmPrompt.title,
		description: text.confirmPrompt.text,
		color: text.colorInfo
	}
}

const successEmbed = {
	embed: {
		title: text.feedbackSuccess.title,
		description: text.feedbackSuccess.text,
		color: text.colorSuccess
	}
}

const errorEmbed = {
	embed: {
		title: text.feedbackError.title,
		description: text.feedbackError.text,
		color: text.colorError
	}
}

const cancelEmbed = {
	embed: {
		title: text.feedbackCancel.title,
		description: text.feedbackCancel.text,
		color: text.colorError
	}
}

const timeoutEmbed = {
	embed: {
		title: text.feedbackTimeout.title,
		description: text.feedbackTimeout.text,
		color: text.colorError
	}
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
				msg.channel.send({
					embed: {
						title: text.feedbackCantDM.title,
      			description: text.feedbackCantDM.text,
						color: text.colorError
					}
				})
				return
			}

			msg.channel.send({
				embed: {
					title: text.feedbackContinueDM.title,
      		description: text.feedbackContinueDM.text,
					color: text.colorInfo
				}
			})
		} else {
			await sendInitialMessage(channel)
		}

		// start prompt
		try {
			setUserBusy(msg.author.id, channel.id);

			// get year
			const yearIndex = await startButtonPrompt(channel, msg.author, yearEmbed, yearButtons, yearButtonTimeout)
			const year = yearButtons[yearIndex].value;

			let confirmed = 'new'
			let feedbacks = []
			while (confirmed === 'new') {
				// get feedback
				const feedback = await startMessagePrompt(channel, msg.author, feedbackEmbed, feedbackTimeout)
				feedbacks.push(feedback.content);
				
				// confirm prompt
				const confirmIndex = await startButtonPrompt(channel, msg.author, confirmEmbed, confirmButtons, confirmTimeout)
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
			await channel.send(successEmbed);
		} catch (err) {
			if (err instanceof PromptTimeout) {
				channel.send(timeoutEmbed)
				return
			}
			if (err instanceof PromptCancel) {
				channel.send(cancelEmbed)
				return
			}
			console.error(err);
			channel.send(errorEmbed);
		} finally {
			setUserNotBusy(msg.author.id, channel.id);
		}
	}
}
