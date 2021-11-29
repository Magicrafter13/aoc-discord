const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Get an invite to the leaderboard."),
	async execute(interaction) {
		// Get this channel's leaderboard
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard)
			return await interaction.reply("This channel is not linked with an Advent of Code leaderboard!");

		await interaction.reply(`Join the leaderboard by going to https://adventofcode.com/${leaderboard.year}/leaderboard/private, and entering the code: \`${leaderboard.invite}\``);
	},
};
