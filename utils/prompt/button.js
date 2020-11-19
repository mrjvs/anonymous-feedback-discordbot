const { ReactionCollector } = require('discord.js');
const { PromptTimeout } = require('./error');

function collectionFilter(oriUser, buttons) {
	return (reaction, user) => {
		// remove reaction regardless of it getting collected or not
		if (reaction.message.channel.type !== 'dm')
			reaction.remove();

		// only original user can react
		if (user.id !== oriUser.id) return false;

		// find if reaction matches the button
		const found = buttons.find((btn) => {
			if (btn.type === 'default' && btn.emoji === reaction.emoji.name)
				return true;
			// TODO other types
			return false;
		})
		return !!found
	}
}

module.exports = {
	startButtonPrompt(channel, user, embed, buttons, timeout) {
		return new Promise(async (resolve, reject) => {
			const msg = await channel.send(embed);
			const collector = new ReactionCollector(msg, collectionFilter(user, buttons), { max: 1, time: timeout })
			collector.on('end', (collection, cause) => {
				if (cause == 'time')
					reject(new PromptTimeout())
				else if (cause == 'limit') {
					for (const value of collection.values()) {
						resolve(buttons.findIndex(btn => {
							if (btn.type == 'default' && btn.emoji === value.emoji.name)
								return true
							// TODO other types
							return false;
						}))
						return
					}
				}
				else
					reject(new Error('Unhandled collector end cause'))
			})

			buttons.forEach(btn => {
				if (btn.type == 'default')
					msg.react(btn.emoji)
				// TODO other types
			})
		})
	},
	PromptTimeout
}
