const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("today")
		.setDescription("Link to today's challenge."),
	async execute(interaction) {
		// Get this channel's leaderboard
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard)
			return await interaction.reply("This channel is not linked with an Advent of Code leaderboard!");

		const now = new Date(Date.now());
		const month = now.getMonth();
		if (month != 11)
			return await interaction.reply("It's not December!");
		const day = now.getDate();
		if (month > 25)
			return await interaction.reply("This year's Advent of Code has ended. Feel free to view the leaderboard with `/view`.");

		await interaction.deferReply();

		// Make sure we have latest data
		await interaction.client.commands.get("refresh").execute(interaction, true);

		await interaction.editReply(`https://adventofcode.com/${leaderboard.year}/day/${day}`)
	},
};
