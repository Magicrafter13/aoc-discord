const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("view")
		.setDescription("Show something"),
	async execute(interaction) {
		// Get this channel's leaderboard
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard)
			return await interaction.reply("This channel is not linked with an Advent of Code leaderboard!");

		// Make sure we have latest data
		await interaction.client.commands.get("refresh").execute(interaction, true);

		await interaction.reply(`\`\`\`\n${JSON.stringify(leaderboard.data)}\n\`\`\``);
	},
};
