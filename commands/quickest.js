const { SlashCommandBuilder } = require('@discordjs/builders');

const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];

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
			.addChoices(
				{ name: "Day 1", value: 1 },
				{ name: "Day 2", value: 2 },
				{ name: "Day 3", value: 3 },
				{ name: "Day 4", value: 4 },
				{ name: "Day 5", value: 5 },
				{ name: "Day 6", value: 6 },
				{ name: "Day 7", value: 7 },
				{ name: "Day 8", value: 8 },
				{ name: "Day 9", value: 9 },
				{ name: "Day 10", value: 10 },
				{ name: "Day 11", value: 11 },
				{ name: "Day 12", value: 12 },
				{ name: "Day 13", value: 13 },
				{ name: "Day 14", value: 14 },
				{ name: "Day 15", value: 15 },
				{ name: "Day 16", value: 16 },
				{ name: "Day 17", value: 17 },
				{ name: "Day 18", value: 18 },
				{ name: "Day 19", value: 19 },
				{ name: "Day 20", value: 20 },
				{ name: "Day 21", value: 21 },
				{ name: "Day 22", value: 22 },
				{ name: "Day 23", value: 23 },
				{ name: "Day 24", value: 24 },
				{ name: "Day 25", value: 25 },
			)),
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

		// Get necessary dates and convert from unix timestamp to javascript timestamp (multiply by 1000)
		const date1_1 = person1.completion_day_level[day] ? new Date(person1.completion_day_level[day][1].get_star_ts * 1000) : null;
		const date1_2 = date1_1 && person1.completion_day_level[day][2] ? new Date(person1.completion_day_level[day][2].get_star_ts * 1000) : null;
		const date2_1 = person2.completion_day_level[day] ? new Date(person2.completion_day_level[day][1].get_star_ts * 1000) : null;
		const date2_2 = date2_1 && person2.completion_day_level[day][2] ? new Date(person2.completion_day_level[day][2].get_star_ts * 1000) : null;

		let response = `Advent of Code ${leaderboard.year}, day ${day}:\n` +
			`\n${username1}:\n` +
			`- Part 1: ${date1_1 ? `${date1_1.getYear() + 1900}-${months[date1_1.getMonth()]}-${date1_1.getDate()} at ${date1_1.getHours()}:${date1_1.getMinutes()}:${date1_1.getSeconds()}.${date1_1.getMilliseconds()}`: "unfinished"}\n`;
		if (date1_1)
			response += `- Part 2: ${date1_2 ? `${date1_2.getYear() + 1900}-${months[date1_2.getMonth()]}-${date1_2.getDate()} at ${date1_2.getHours()}:${date1_2.getMinutes()}:${date1_2.getSeconds()}.${date1_2.getMilliseconds()}`: "unfinished"}\n`;
		response += `\n${username2}:\n` +
			`- Part 1: ${date2_1 ? `${date2_1.getYear() + 1900}-${months[date2_1.getMonth()]}-${date2_1.getDate()} at ${date2_1.getHours()}:${date2_1.getMinutes()}:${date2_1.getSeconds()}.${date2_1.getMilliseconds()}`: "unfinished"}\n`;
		if (date2_1)
			response += `- Part 2: ${date2_2 ? `${date2_2.getYear() + 1900}-${months[date2_2.getMonth()]}-${date2_2.getDate()} at ${date2_2.getHours()}:${date2_2.getMinutes()}:${date2_2.getSeconds()}.${date2_2.getMilliseconds()}`: "unfinished"}\n`;
		await interaction.editReply(response);
	},
};
