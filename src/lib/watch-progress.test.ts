import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { addTick, normalize, watchedFraction, youTubeId, type Range } from "./watch-progress.ts";

describe("watch progress", () => {
  test("normal playback counts, seeking forward does not", () => {
    let r: Range[] = [];
    for (let t = 0; t < 10; t++) r = addTick(r, t, t + 1); // watched 0-10
    r = addTick(r, 10, 500); // seek → ignored
    for (let t = 500; t < 505; t++) r = addTick(r, t, t + 1); // watched 500-505
    assert.deepEqual(r, [[0, 10], [500, 505]]);
    assert.equal(watchedFraction(r, 1000), 0.015);
  });

  test("2x speed still counts; rewatching doesn't double count", () => {
    let r: Range[] = [];
    for (let t = 0; t < 100; t += 2) r = addTick(r, t, t + 2);
    for (let t = 0; t < 100; t += 2) r = addTick(r, t, t + 2);
    assert.equal(watchedFraction(r, 100), 1);
  });

  test("normalize merges overlaps", () => {
    assert.deepEqual(normalize([[5, 10], [0, 6], [20, 30]]), [[0, 10], [20, 30]]);
  });

  test("youTubeId", () => {
    assert.equal(youTubeId("https://www.youtube-nocookie.com/embed/JT_721kDg2I?rel=0"), "JT_721kDg2I");
    assert.equal(youTubeId("https://youtu.be/ugsrvXUQKi0"), "ugsrvXUQKi0");
    assert.equal(youTubeId("https://player.vimeo.com/video/1"), null);
  });
});
