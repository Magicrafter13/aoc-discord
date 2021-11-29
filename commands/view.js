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

		await interaction.deferReply();

		// Make sure we have latest data
		await interaction.client.commands.get("refresh").execute(interaction, true);

		const members = leaderboard.data.members;

		let response = `Advent of Code ${leaderboard.data.event}\n\`\`\``;
		Object.keys(members).forEach(key => {
			const member = members[key];
			response += `${member.name}: ${member.stars} stars\n`
		});
		response += "```\n";

		await interaction.editReply(response);
	},
};
