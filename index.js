const Discord = require('discord.js');
const client = new Discord.Client();

const { token, prefix } = require('./utils/config')
const { commands } = require('./commands')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
	// bots cant start commands
	if (msg.author.bot) return
	let content = msg.content;

	// must start with prefix
	if (!content.startsWith(prefix)) return
	content = content.substring(prefix.length)

	// parse args
	args = content.split(' ').filter(v => v.length > 0);

	// loop through commands until one is found that matches
	for (let cmd of commands) {
		if (args[0] === cmd.command) {
			try {
				console.log('Command ran with args:', args)
				let res = cmd.run({
					msg,
					args,
				});
				if (res instanceof Promise)
					await res;
			} catch (err) {
				console.error(`Error running command ${cmd.command}:`, err)
			}
			break;
		}
	}
});

client.login(token);
