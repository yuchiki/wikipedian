# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Wikipedian is a Discord bot that provides a `/wikipedia` slash command for searching Wikipedia articles. It supports multiple languages (defaults to Japanese) and returns the first two paragraphs of matching articles. Written in TypeScript using Discord.js v14 and Cheerio for HTML parsing.

## Build & Run Commands

- `npm install` — install dependencies
- `npm run tsc` — compile TypeScript (src/ → dist/)
- `npm run start` — run the bot (`node dist/index.js`)
- Slash commands are automatically registered on bot startup (requires `.env` with `WIKIPEDIAN_CLIENT_ID` and `WIKIPEDIAN_TOKEN`)

There is no test framework configured.

## Architecture

The entire bot logic lives in `src/index.ts` as a single-file application:

- **Discord client setup** — creates a Client with no gateway intents, listens for `ready` and `interactionCreate` events
- **`wikipedia_command(interaction)`** — extracts `word` and `language` options from the slash command, splits comma-separated languages, and calls `search_wikipedia()` for each language in parallel via `Promise.all()`
- **`search_wikipedia(language, word)`** — constructs a Wikipedia URL (`https://{lang}.wikipedia.org/wiki/{word}`), fetches the page, parses HTML with Cheerio (`.mw-parser-output p:eq(0)` and `p:eq(1)`), strips citation markers, and returns a formatted result

Command registration is integrated into the bot startup via `registerCommands()` in `src/index.ts`.

## Environment

- Requires Node.js 18+ (uses built-in `fetch()`)
- Secrets go in `.env` (git-ignored): `WIKIPEDIAN_CLIENT_ID`, `WIKIPEDIAN_TOKEN`
- Deployment options: Kubernetes (`manifests/wikipedian.yaml`), Docker (`Dockerfile`), or direct Node.js
