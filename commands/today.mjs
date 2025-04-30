import { SlashCommandBuilder } from '@discordjs/builders';

const DECEMBER = 11;
const CHRISTMAS_DAY = 25;
const MS_IN_5_HOURS = 10800000;

export default {
	data: new SlashCommandBuilder()
		.setName("today")
		.setDescription("Link to today's challenge."),
	async execute(interaction) {
		// Get this channel's leaderboard
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard) {
			await interaction.reply("This channel is not linked with an Advent of Code leaderboard!");
			return;
		}

		const now = new Date(Date.now() + MS_IN_5_HOURS); // Add 5 hours for UTC-5
		const month = now.getMonth();
		if (month !== DECEMBER) {
			await interaction.reply("It's not December!");
			return;
		}
		const day = now.getDate();
		if (month > CHRISTMAS_DAY) {
			await interaction.reply("This year's Advent of Code has ended. Feel free to view the leaderboard with `/view`.");
			return;
		}

		await interaction.reply(`https://adventofcode.com/${leaderboard.year}/day/${day}`)
	},
};
