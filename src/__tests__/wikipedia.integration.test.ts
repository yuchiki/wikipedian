import { describe, expect, test } from "bun:test";
import { search_wikipedia } from "../wikipedia";

describe("search_wikipedia integration", () => {
    test("fetches a real Wikipedia article", async () => {
        const result = await search_wikipedia("en", "TypeScript");

        expect(result).toContain('en: "TypeScript"');
        expect(result).toContain("https://en.wikipedia.org/wiki/TypeScript");
        // Should have some actual content from the article
        expect(result.length).toBeGreaterThan(100);
    });

    test("returns not found for a nonexistent article", async () => {
        const result = await search_wikipedia(
            "en",
            "Xyzzy_nonexistent_article_12345",
        );

        expect(result).toBe(
            'en: "Xyzzy_nonexistent_article_12345" is not found.',
        );
    });

    test("fetches a Japanese Wikipedia article", async () => {
        const result = await search_wikipedia("ja", "TypeScript");

        expect(result).toContain('ja: "TypeScript"');
        expect(result).toContain("https://ja.wikipedia.org/wiki/TypeScript");
    });
});
