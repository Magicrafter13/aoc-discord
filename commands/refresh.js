const { SlashCommandBuilder } = require('@discordjs/builders');

let last_request = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("refresh")
		.setDescription("Downloads latest data from AoC API."),
	async execute(interaction) {
		const now = Date.now();

		// Be nice to AoC "... avoid sending requests more often than once every 15 minutes"
		const time_since_last_request = now - last_request;
		if (time_since_last_request < 900000) {
			if (interaction == null)
				return;
			return await interaction.reply(`Please wait ${Math.round((900000 - time_since_last_request) / 60000)} minutes before submitting another API request.`);
		}

		// Download latest data
		last_request = now;

		await interaction.reply("Success.");
	},
};
