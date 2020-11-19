const Discord = require('discord.js');
const client = new Discord.Client();

const { token, prefix } = require('./utils/config')
const { isUserBusy } = require('./utils/busy')
const { setup } = require('./utils/db')
const { commands } = require('./commands')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
	// bots cant start commands
	if (msg.author.bot) return
	let content = msg.content;

	// check if not in the middle of a prompt
	if(isUserBusy(msg.author.id, msg.channel.id)) return

	// must start with prefix
	if (!content.startsWith(prefix)) return
	content = content.substring(prefix.length)

	// parse args
	args = content.split(' ').filter(v => v.length > 0);

	// loop through commands until one is found that matches
	for (let cmd of commands) {
		if (args[0] === cmd.command) {
			if (cmd.dmOnly && msg.channel.type !== 'dm') return
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
// client.on('messageReactionAdd', (reaction) => console.log(reaction.emoji.name))

// setup database
setup(client)

client.login(token);
