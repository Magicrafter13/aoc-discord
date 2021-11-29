const https = require('https');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("refresh")
		.setDescription("Downloads latest data from AoC API."),
	async execute(interaction, silent) {
		// Get leaderboard obj for this channel
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard)
			return await interaction.reply("This channel is not linked to an Advent of Code leaderboard!");

		// Get current time
		const now = Date.now();

		// Be nice to AoC "... avoid sending requests more often than once every 15 minutes"
		const time_since_last_request = now - leaderboard.last_request;
		if (time_since_last_request < 900000) {
			if (!silent)
				await interaction.reply(`Please wait ${Math.round((900000 - time_since_last_request) / 60000)} minutes before submitting another API request.`);
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

				let data = [];
				res
					.on('data', d => data.push(d))
					.on('end', () => {
						let parsed;
						try {
							parsed = JSON.parse(Buffer.concat(data));
						}
						catch (e) {
							interaction.editReply("There was an error parsing the data from AoC!");
							reject("Bad JSON data!");
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
				reject("There was an error downloading from AoC!");
			});
			request.end();
		});

		return promise;
	},
};
