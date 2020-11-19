function sendInitialMessage(channel) {
	return channel.send('hi there!');
}

module.exports = {
	command: 'feedback',
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
		} else {
			await sendInitialMessage(channel)
		}
		
		// start prompt
	}
}
