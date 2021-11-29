const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("view")
		.setDescription("Show something"),
	async execute(interaction) {
		// Make sure we have latest data
		await interaction.client.commands.get("refresh").execute(interaction, true);

		await interaction.reply(`\`\`\`\n${JSON.stringify(interaction.client.leaderboard)}\n\`\`\``);
	},
};
