import { SlashCommandBuilder } from '@discordjs/builders';

const AOC_CHALLENGE_COUNT = 25;

export default {
	data: new SlashCommandBuilder()
		.setName("view")
		.setDescription("Display the leaderboard!"),
	async execute(interaction) {
		// Get this channel's leaderboard
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard) {
			await interaction.reply("This channel is not linked with an Advent of Code leaderboard!");
			return;
		}

		await interaction.deferReply();

		// Make sure we have latest data
		await interaction.client.commands.get("refresh").execute(interaction, true);

		const { members } = leaderboard.data;

		let response = `Advent of Code ${leaderboard.data.event}\n\`\`\`\n         1111111111222222\n1234567890123456789012345\n`;
		Object.keys(members).forEach(key => {
			const member = members[key];
			for (let day = 1; day <= AOC_CHALLENGE_COUNT; ++day) {
				const cdl = member.completion_day_level[day];
				response += cdl
					? (cdl[2] ? '+' : '-')
					: ' ';
			}
			response += ` ${member.stars} stars (score: ${member.local_score}) ${member.name}\n`
		});
		response += "```\n";

		await interaction.editReply(response);
	},
};
