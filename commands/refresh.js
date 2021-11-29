const https = require('https');
const { SlashCommandBuilder } = require('@discordjs/builders');

let last_request = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("refresh")
		.setDescription("Downloads latest data from AoC API."),
	async execute(interaction, silent) {
		const now = Date.now();

		// Be nice to AoC "... avoid sending requests more often than once every 15 minutes"
		const time_since_last_request = now - last_request;
		if (time_since_last_request < 900000) {
			if (silent === false)
				await interaction.reply(`Please wait ${Math.round((900000 - time_since_last_request) / 60000)} minutes before submitting another API request.`);
			return;
		}

		if (!silent)
			await interaction.reply("Request AoC data...");

		// Download latest data
		const promise = new Promise((resolve, reject) => {
			const options = {
				hostname: "adventofcode.com",
				//hostname: "gitlab.com",
				port: 443,
				path: interaction.client.leaderboard_url,
				//path: "/api/v4/projects",
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
						interaction.client.leaderboard = JSON.parse(Buffer.concat(data));
						console.log(Buffer.concat(data));
						resolve();
					});
			});
			request.on('error', error => {
				console.error(error)
				if (!silent)
					interaction.editReply("There was an error downloading from AoC!");
				// Do this so another request can be made immediately
				now = last_request;
				reject("There was an error downloading from AoC!");
			});
			request.end();
		});

		// Update timestamp
		if (last_request != now) {
			last_request = now;
			if (!silent)
				await interaction.editReply("Got latest data.");
		}

		return promise;

		//await interaction.reply("Success.");
	},
};
