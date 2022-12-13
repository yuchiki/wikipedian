require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const client_id = process.env.WIKIPEDIAN_CLIENT_ID;
const guild_ids = process.env.WIKIPEDIAN_GUILD_IDS.split(",");
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

const rest = new REST({ version: '9' }).setToken(token);

guild_ids.forEach(guild_id => {
    rest.put(Routes.applicationGuildCommands(client_id, guild_id), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
});
