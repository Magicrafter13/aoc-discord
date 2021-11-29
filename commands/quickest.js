const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("quickest")
		.setDescription("Compare submission times between users.")
		.addStringOption(option => option.setName("person1")
			.setDescription("Enter the username of the first person to compare.")
			.setRequired(true))
		.addStringOption(option => option.setName("person2")
			.setDescription("Enter the username of the second person to compare against.")
			.setRequired(true))
		.addIntegerOption(option => option.setName("day")
			.setDescription("Which day would you like to compare?")
			.setRequired(true)
			.addChoice("Day 1", 1)
			.addChoice("Day 2", 2)
			.addChoice("Day 3", 3)
			.addChoice("Day 4", 4)
			.addChoice("Day 5", 5)
			.addChoice("Day 6", 6)
			.addChoice("Day 7", 7)
			.addChoice("Day 8", 8)
			.addChoice("Day 9", 9)
			.addChoice("Day 10", 10)
			.addChoice("Day 11", 11)
			.addChoice("Day 12", 12)
			.addChoice("Day 13", 13)
			.addChoice("Day 14", 14)
			.addChoice("Day 15", 15)
			.addChoice("Day 16", 16)
			.addChoice("Day 17", 17)
			.addChoice("Day 18", 18)
			.addChoice("Day 19", 19)
			.addChoice("Day 20", 20)
			.addChoice("Day 21", 21)
			.addChoice("Day 22", 22)
			.addChoice("Day 23", 23)
			.addChoice("Day 24", 24)
			.addChoice("Day 25", 25)),
	async execute(interaction) {
		// Get this channel's leaderboard
		const leaderboard = interaction.client.leaderboards[interaction.channelId];
		if (!leaderboard)
			return await interaction.reply("This channel is not linked with an Advent of Code leaderboard!");

		await interaction.deferReply();

		// Make sure we have latest data
		await interaction.client.commands.get("refresh").execute(interaction, true);

		const members = leaderboard.data.members;

		const username1 = interaction.options.get("person1", true).value;
		const username2 = interaction.options.get("person2", true).value;
		const day = interaction.options.get("day", true).value;

		let person1 = null, person2 = null;
		Object.keys(members).forEach(key => {
			const member = members[key];
			if (member.name === username1)
				person1 = member;
			if (member.name === username2)
				person2 = member;
		});
		if (!person1)
			return await interaction.editReply(`No user named '${username1}' is registered to the leaderboard!`);
		if (!person2)
			return await interaction.editReply(`No user named '${username2}' is registered to the leaderboard!`);

		let response = `Advent of Code ${leaderboard.year}, day ${day}:\n\n`+
			`${username1}:\n` +
			`- Part 1: ${person1.completion_day_level[day] ? person1.completion_day_level[day][1].get_star_ts : "unfinished"}\n- Part 2: ${person1.completion_day_level[day] && person1.completion_day_level[day][2] ? person1.completion_day_level[day][2].get_star_ts : "unfinished"}\n\n` +
			`${username2}:\n` +
			`- Part 1: ${person2.completion_day_level[day] ? person2.completion_day_level[day][1].get_star_ts : "unfinished"}\n- Part 2: ${person2.completion_day_level[day] && person2.completion_day_level[day][2] ? person2.completion_day_level[day][2].get_star_ts : "unfinished"}\n`;
		await interaction.editReply(response);

		//await interaction.editReply(`Received: person1 = ${person1.value}, person2 = ${person2.value}, day = ${day.value}`);
	},
};
