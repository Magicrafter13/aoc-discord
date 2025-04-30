import config from './config.json' with { type: "json" };
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const {
	clientId,
	guildId,
	token,
} = config;

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandModules = await Promise.all(commandFiles.map(file => import (`./commands/${file}`)));
for (const module of commandModules) {
	const command = module.default;
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
.then(console.log('Successfully registered application commands.'))
.catch(console.error);
