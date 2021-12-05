const cron = require('cron');
const fs = require('fs');

// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');
const { guildId, token, session, leaderboards, send_notification } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Register commands
client.commands = new Collection();
const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Init data
client.session = session;
client.leaderboards = leaderboards;

for (const file of command_files) {
	const command = require(`./commands/${file}`);
	/*
	 * Set a new item in the collection
	 * With the key as the command name and the value as the exported module
	 */
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand())
		return;

	const command = client.commands.get(interaction.commandName);

	if (!command)
		return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);

if (send_notification) {
	let notify = new cron.CronJob('00 30 20 * * *', () => {
		const now = new Date(Date.now());
		if ((now.getMonth() == 10 && now.getDate() == 30) || (now.getMonth() == 11 && now.getDate() < 25)) {
			Object.keys(leaderboards).forEach(channelId => {
				if (leaderboards[channelId] == Date.now().getYear()) {
					client.guilds.fetch(guildId)
						.then(guild => {
							guild.channels.fetch(channelId)
							.then(channel => channel.send(`The next advent of code puzzle unlocks in 30 minutes!\nhttps://adventofcode.com/${leaderboards[channelId].year}/day/${Date.now().getDate() + 1}`))
							.catch(console.error);
						})
					.catch(console.error);
				}
			});
		}
	});
	notify.start();
	console.log("Started notification cron job.");
}
