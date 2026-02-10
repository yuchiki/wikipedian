import { afterEach, describe, expect, mock, test } from "bun:test";
import { search_wikipedia } from "../wikipedia";

const originalFetch = globalThis.fetch;

const mockFetch = (status: number, body: string) => {
    const fn = mock(() => Promise.resolve(new Response(body, { status })));
    globalThis.fetch = fn as unknown as typeof globalThis.fetch;
    return fn;
};

afterEach(() => {
    globalThis.fetch = originalFetch;
});

describe("search_wikipedia", () => {
    test("returns formatted text with first two paragraphs", async () => {
        const html = `<div class="mw-parser-output">
            <p>First paragraph.</p>
            <p>Second paragraph.</p>
        </div>`;
        mockFetch(200, html);

        const result = await search_wikipedia("en", "Test");

        expect(result).toBe(
            'en: "Test"\nFirst paragraph.Second paragraph.\nhttps://en.wikipedia.org/wiki/Test',
        );
    });

    test("strips citation markers", async () => {
        const html = `<div class="mw-parser-output">
            <p>Text with citations[1] and[23] more.</p>
            <p>Another[4] paragraph.</p>
        </div>`;
        mockFetch(200, html);

        const result = await search_wikipedia("ja", "Example");

        expect(result).not.toMatch(/\[\d+\]/);
        expect(result).toContain("Text with citations and more.");
        expect(result).toContain("Another paragraph.");
    });

    test("replaces spaces with underscores in URL", async () => {
        const html = `<div class="mw-parser-output">
            <p>Content.</p>
            <p>More.</p>
        </div>`;
        const fn = mockFetch(200, html);

        const result = await search_wikipedia("en", "hello world");

        expect(result).toContain("https://en.wikipedia.org/wiki/hello_world");
        expect(fn).toHaveBeenCalledWith(
            "https://en.wikipedia.org/wiki/hello_world",
        );
    });

    test("preserves original word with spaces in output label", async () => {
        const html = `<div class="mw-parser-output">
            <p>Content.</p>
            <p>More.</p>
        </div>`;
        mockFetch(200, html);

        const result = await search_wikipedia("en", "hello world");

        expect(result).toContain('en: "hello world"');
    });

    test("returns not found message on 404", async () => {
        mockFetch(404, "");

        const result = await search_wikipedia("en", "NonExistent");

        expect(result).toBe('en: "NonExistent" is not found.');
    });

    test("returns error code message on 500", async () => {
        mockFetch(500, "");

        const result = await search_wikipedia("en", "ServerError");

        expect(result).toBe('en: "ServerError": error code 500');
    });

    test("returns error code message on 403", async () => {
        mockFetch(403, "");

        const result = await search_wikipedia("en", "Forbidden");

        expect(result).toBe('en: "Forbidden": error code 403');
    });

    test("handles empty mw-parser-output with no paragraphs", async () => {
        const html = '<div class="mw-parser-output"></div>';
        mockFetch(200, html);

        const result = await search_wikipedia("en", "Empty");

        expect(result).toContain('en: "Empty"');
        expect(result).toContain("https://en.wikipedia.org/wiki/Empty");
    });

    test("works with different language codes", async () => {
        const html = `<div class="mw-parser-output">
            <p>Contenu.</p>
            <p>Plus.</p>
        </div>`;
        const fn = mockFetch(200, html);

        const result = await search_wikipedia("fr", "Test");

        expect(fn).toHaveBeenCalledWith("https://fr.wikipedia.org/wiki/Test");
        expect(result).toStartWith('fr: "Test"');
        expect(result).toContain("https://fr.wikipedia.org/wiki/Test");
    });
});
