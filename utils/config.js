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
	},
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.PREFIX,
	guildID: process.env.GUILD_ID,
	channelID: process.env.CHANNEL_ID || false,
}
