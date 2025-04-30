import https from 'https';
import { SlashCommandBuilder } from '@discordjs/builders';

const MS_IN_FIFTEEN_MINUTES = 900000;
const MS_IN_MINUTE = 60000;
export default {
	data: new SlashCommandBuilder()
		.setName("refresh")
		.setDescription("Downloads latest data from AoC API."),
	async execute(interaction, silent) {
		// Get leaderboard obj for this channel
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard) {
			await interaction.reply("This channel is not linked to an Advent of Code leaderboard!");
			return;
		}

		// Get current time
		const now = Date.now();

		// Be nice to AoC "... avoid sending requests more often than once every 15 minutes"
		const timeSinceLastRequest = now - leaderboard.last_request;
		if (timeSinceLastRequest < MS_IN_FIFTEEN_MINUTES) {
			if (!silent)
				await interaction.reply(`Please wait ${Math.round((MS_IN_FIFTEEN_MINUTES - timeSinceLastRequest) / MS_IN_MINUTE)} minutes before submitting another API request.`);
			return;
		}

		if (!silent)
			await interaction.reply("Request AoC data...");

		// Download latest data
		const promise = new Promise((resolve, reject) => {
			const options = {
				hostname: "adventofcode.com",
				port: 443,
				path: `/${leaderboard.year}/leaderboard/private/view/${leaderboard.url}.json`,
				method: "GET",
				headers: {
					"cookie": `session=${interaction.client.session}`
				},
			};
			const request = https.request(options, res => {
				console.log(`statusCode: ${res.statusCode}`);

				const dataBlocks = [];
				res
					.on('data', data => dataBlocks.push(data))
					.on('end', () => {
						let parsed;
						try {
							parsed = JSON.parse(Buffer.concat(dataBlocks));
						}
						catch {
							interaction.editReply("There was an error parsing the data from AoC!");
							reject(new TypeError("Bad JSON data!"));
						}
						// Update timestamp
						leaderboard.last_request = now;
						// Update data
						leaderboard.data = parsed;
						if (!silent)
							interaction.editReply("Got latest data.");
						console.log(JSON.stringify(parsed));
						resolve();
					});
			});
			request.on('error', error => {
				console.error(error)
				if (!silent)
					interaction.editReply("There was an error downloading from AoC!");
				reject(new Error("There was an error downloading from AoC!"));
			});
			request.end();
		});

		await promise;
	},
};
