
import {
	REST,
	Routes,
	SlashCommandBuilder
} from 'discord.js';

const client_id = process.env.WIKIPEDIAN_CLIENT_ID;
const token = process.env.WIKIPEDIAN_TOKEN;

const commands = [
    new SlashCommandBuilder()
        .setName('wikipedia')
        .setDescription('Search Article from Wikipedia')
        .addStringOption(option =>
            option.setName("word")
                .setDescription("検索語")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("languages")
                .setDescription("言語('en', 'ja', 'fr', 'en,ja,fr' など。デフォルトはja)")),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' });
rest.setToken(token);

await rest.put(Routes.applicationCommands(client_id), {
	body: commands
});
