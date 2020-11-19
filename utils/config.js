// load .env file if exists
require('dotenv').config()

const requiredFields = [
	'DISCORD_TOKEN',
	'PREFIX',
	'GUILD_ID',
]

requiredFields.forEach(field => {
	if (!process.env[field]) {
		console.error(`Required environment variable ${field} isn't set, exiting`)
		process.exit(1)
	}
})

module.exports = {
	text: {
		feedbackStart: {
			title: process.env.TEXT_FEEDBACK_START_TITLE || "Anonymous feedback",
			text: process.env.TEXT_FEEDBACK_START_TEXT || "send anonymous feedback"
		},
		yearPrompt: {
			title: process.env.TEXT_YEAR_PROMPT_TITLE || "What year are you in?",
			text: process.env.TEXT_YEAR_PROMPT_TEXT || "Click the buttons below to select your year (M for masters)",
		},
		feedbackPrompt: {
			title: process.env.TEXT_FEEDBACK_PROMPT_TITLE || "Send your feedback",
			text: process.env.TEXT_FEEDBACK_PROMPT_TEXT || "Type your message containing the feedback below",
		},
		confirmPrompt: {
			title: process.env.TEXT_CONFIRM_PROMPT_TITLE || "Finished?",
			text: process.env.TEXT_CONFIRM_PROMPT_TEXT || "Are you finished with your feedback, press the arrow to add another message",
		},
		feedbackSuccess: {
			title: process.env.TEXT_FEEDBACK_SUCCESS_TITLE || "Thank you",
			text: process.env.TEXT_FEEDBACK_SUCCESS_TEXT || "The feedback has been recorded successfully",
		},
		feedbackError: {
			title: process.env.TEXT_FEEDBACK_ERROR_TITLE || "Whoops",
			text: process.env.TEXT_FEEDBACK_ERROR_TEXT || "It seems something has gone wrong, try again later",
		},
		feedbackCancel: {
			title: process.env.TEXT_FEEDBACK_CANCEL_TITLE || "Cancelled",
			text: process.env.TEXT_FEEDBACK_CANCEL_TEXT || "We've cancelled the feedback, have a nice day :)",
		},
		feedbackTimeout: {
			title: process.env.TEXT_FEEDBACK_START_TITLE || "You took too long",
			text: process.env.TEXT_FEEDBACK_START_TEXT || "It took a while for you to respond, so we closed the feedback request, feel free to open another one",
		},
		feedbackCantDM: {
			title: process.env.TEXT_FEEDBACK_CANTDM_TITLE || "Whoops",
			text: process.env.TEXT_FEEDBACK_CANTDM_TEXT || "I can't seem to send you DM's. Please enable them!",
		},
		feedbackContinueDM: {
			title: process.env.TEXT_FEEDBACK_CONTINUEDM_TITLE || "Hey there!",
			text: process.env.TEXT_FEEDBACK_CONTINUEDM_TEXT || "let's continue in DM's",
		},
		genericError: {
			title: process.env.TEXT_GENERIC_ERROR_TITLE || "Whoops!",
			text: process.env.TEXT_GENERIC_ERROR_TEXT || "It seems something has gone wrong, try again later"
		},
		colorInfo: 7506394,
		colorSuccess: 3792980,
		colorError: 14830411
	},
	timeouts: { // all in milliseconds
		feedbackYear: 20000,
		feedbackMessage: 20000,
		feedbackConfirm: 20000,
	},
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.PREFIX,
	guildID: process.env.GUILD_ID,
	channelID: process.env.CHANNEL_ID || false,
}
