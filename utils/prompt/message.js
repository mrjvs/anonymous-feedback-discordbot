const { MessageCollector } = require('discord.js');
const { PromptTimeout, PromptCancel } = require('./error');

function collectionFilter(oriUser) {
	return (msg) => {
		// only original user counts
		if (msg.author.id !== oriUser.id) return false;
		return true
	}
}

module.exports = {
	startMessagePrompt(channel, user, embed, timeout) {
		return new Promise(async (resolve, reject) => {
			await channel.send(embed);
			const collector = new MessageCollector(channel, collectionFilter(user), { max: 1, time: timeout })
			collector.on('end', (collection, cause) => {
				if (cause == 'time')
					reject(new PromptTimeout())
				else if (cause == 'limit') {
					for (const value of collection.values()) {
						if (value.content.trim() === 'cancel')
							reject(new PromptCancel())
						else
							resolve(value)
						return
					}
					resolve(collection);
				}
				else
					reject(new Error('Unhandled collector end cause'))
			})
		})
	},
	PromptTimeout,
	PromptCancel
}
