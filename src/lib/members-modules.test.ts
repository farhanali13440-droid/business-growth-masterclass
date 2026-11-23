import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { isUnlocked, toEmbedUrl } from "./members-modules.ts";

describe("toEmbedUrl", () => {
  test("converts share links to embeddable players", () => {
    assert.match(toEmbedUrl("https://youtu.be/abc123")!, /youtube-nocookie\.com\/embed\/abc123/);
    assert.match(toEmbedUrl("https://www.youtube.com/watch?v=abc123&t=4")!, /embed\/abc123/);
    assert.equal(toEmbedUrl("https://vimeo.com/123456/ab12cd"), "https://player.vimeo.com/video/123456?h=ab12cd");
    assert.equal(toEmbedUrl(""), null);
    assert.equal(toEmbedUrl("not a link"), null);
  });
});

describe("isUnlocked", () => {
  test("module unlocks only after all earlier ones are complete", () => {
    assert.equal(isUnlocked(0, new Set()), true);
    assert.equal(isUnlocked(1, new Set()), false);
    assert.equal(isUnlocked(2, new Set(["m1", "m2"])), true);
  });
});
