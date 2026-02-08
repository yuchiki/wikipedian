# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Wikipedian is a Discord bot that provides a `/wikipedia` slash command for searching Wikipedia articles. It supports multiple languages (defaults to Japanese) and returns the first two paragraphs of matching articles. Written in TypeScript using Discord.js v14 and Cheerio for HTML parsing. Runs on the Bun runtime.

## Build & Run Commands

- `bun install` — install dependencies
- `bun run start` — run the bot (`bun run src/index.ts`)
- `bun run format` — format code with Biome (`biome format --write src/`)
- `bun run lint` — lint code with Biome (`biome lint src/`)
- `bun run check` — format + lint in one pass with Biome (`biome check --write src/`)
- Slash commands are automatically registered on bot startup (requires `.env` with `WIKIPEDIAN_CLIENT_ID` and `WIKIPEDIAN_TOKEN`)

There is no test framework configured. Biome is used for formatting and linting.

## Architecture

The entire bot logic lives in `src/index.ts` as a single-file application:

- **Discord client setup** — creates a Client with no gateway intents, listens for `ready` and `interactionCreate` events
- **`wikipedia_command(interaction)`** — extracts `word` and `language` options from the slash command, splits comma-separated languages, and calls `search_wikipedia()` for each language in parallel via `Promise.all()`
- **`search_wikipedia(language, word)`** — constructs a Wikipedia URL (`https://{lang}.wikipedia.org/wiki/{word}`), fetches the page, parses HTML with Cheerio (`.mw-parser-output p:eq(0)` and `p:eq(1)`), strips citation markers, and returns a formatted result

Command registration is integrated into the bot startup via `registerCommands()` in `src/index.ts`.

## Environment

- Requires Bun runtime
- `.env` is auto-loaded by Bun (no dotenv needed): `WIKIPEDIAN_CLIENT_ID`, `WIKIPEDIAN_TOKEN`
- Deployment options: Kubernetes (`manifests/wikipedian.yaml`), Docker (`Dockerfile`), or direct Bun
