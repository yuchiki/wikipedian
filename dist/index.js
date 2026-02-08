"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cheerio_1 = require("cheerio");
const discord_js_1 = require("discord.js");
const registerCommands = () => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = process.env.WIKIPEDIAN_CLIENT_ID;
    const token = process.env.WIKIPEDIAN_TOKEN;
    if (!clientId || !token) {
        throw new Error("WIKIPEDIAN_CLIENT_ID and WIKIPEDIAN_TOKEN must be set");
    }
    const commands = [
        new discord_js_1.SlashCommandBuilder()
            .setName("wikipedia")
            .setDescription("Search Article from Wikipedia")
            .addStringOption((option) => option
            .setName("word")
            .setDescription("検索語")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("languages")
            .setDescription("言語('en', 'ja', 'fr', 'en,ja,fr' など。デフォルトはja)")),
    ].map((command) => command.toJSON());
    const rest = new discord_js_1.REST({ version: "10" }).setToken(token);
    yield rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
    console.log("コマンド登録完了");
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield registerCommands();
    }
    catch (e) {
        console.error("コマンド登録失敗:", e);
    }
    const client = new discord_js_1.Client({ intents: [] });
    client.once("ready", () => {
        console.log("起動完了");
    });
    client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!interaction.isCommand())
            return;
        const { commandName } = interaction;
        if (commandName === "wikipedia" && interaction.isChatInputCommand()) {
            wikipedia_command(interaction);
        }
    }));
    client.login(process.env.WIKIPEDIAN_TOKEN);
});
const wikipedia_command = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const raw_word = (_b = (_a = interaction.options.get("word")) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString();
    const languages = ((_e = (_d = (_c = interaction.options.get("languages")) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : "ja").split(",");
    if (!raw_word) {
        interaction.reply("words cannot be parsed.");
        return;
    }
    interaction.reply((yield Promise.all(languages.map((language) => search_wikipedia(language, raw_word)))).join("\n"));
});
const search_wikipedia = (language, raw_word) => __awaiter(void 0, void 0, void 0, function* () {
    const word = raw_word.replace(/ /g, "_");
    const URL = `https://${language}.wikipedia.org/wiki/${word}`;
    console.log(`request: ${URL}`);
    const res = yield fetch(URL);
    if (res.status === 404) {
        console.log(`${URL} is not found.`);
        return `${language}: "${raw_word}" is not found.`;
    }
    if (res.status >= 400) {
        console.log(`${URL}: error code ${res.status}`);
        return `${language}: "${raw_word}": error code ${res.status}`;
    }
    const rawHTML = yield res.text();
    if (rawHTML == null) {
        console.log(`${URL}: HTML is empty.`);
        return `${language}: "${raw_word}" is not found.`;
    }
    console.log(`${URL} is found.`);
    const HTML = (0, cheerio_1.load)(rawHTML);
    const text = language +
        ': "' +
        raw_word +
        '"\n' +
        HTML(".mw-parser-output").find("p:eq(0)").text().trim() +
        HTML(".mw-parser-output").find("p:eq(1)").text().trim() +
        "\n" +
        URL;
    if (text) {
        return text.replace(/\[[0-9]+\]/g, "");
    }
    else {
        return `${language}: ${raw_word}: empty.`;
    }
});
main();
