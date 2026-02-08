require('dotenv').config();

import { CommandInteraction, ChatInputCommandInteraction, Client, CacheType } from 'discord.js';
import { load } from 'cheerio';


const main = () => {
    const client = new Client({ intents: [] });

    client.once('ready', () => {
        console.log('起動完了');
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        if (commandName === 'wikipedia' && interaction.isChatInputCommand()) {
            wikipedia_command(interaction);
        }
    });

    client.login(process.env.WIKIPEDIAN_TOKEN);
};

const wikipedia_command = async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const raw_word = interaction.options.get("word")?.value?.toString();
    const languages = (interaction.options.get("languages")?.value?.toString() ?? "ja").split(",");

    if (!raw_word) {
        interaction.reply("words cannot be parsed.");
        return;
    }

    interaction.reply((await Promise.all(languages.map((language: string) => search_wikipedia(language, raw_word)))).join("\n"));

}

const search_wikipedia = async (language: string, raw_word: string): Promise<string> => {

    const word = raw_word.replace(/ /g, "_");
    const URL = `https://${language}.wikipedia.org/wiki/${word}`;
    console.log("request: " + URL);

    const res = await fetch(URL);

    if (res.status == 404) {
        console.log(URL + " is not found.");
        return `${language}: "${raw_word}" is not found.`;
    }

    if (res.status >= 400) {
        console.log(URL + `: error code ${res.status}`);
        return `${language}: "${raw_word}": error code ${res.status}`;
    }

    const rawHTML = await res.text();

    if (rawHTML == null) {
        console.log(URL + `: HTML is empty.`);
        return `${language}: "${raw_word}" is not found.`;
    }

    console.log(URL + " is found.");

    const HTML = load(rawHTML)
    const text = language + ": \"" + raw_word + "\"\n" +
        HTML('.mw-parser-output').find('p:eq(0)').text().trim() +
        HTML('.mw-parser-output').find('p:eq(1)').text().trim() + "\n" +
        URL;

    if (text) {
        return text.replace(/\[[0-9]+\]/g, "");
    } else {
        return `${language}: ${raw_word}: empty.`;
    }
};

main();
