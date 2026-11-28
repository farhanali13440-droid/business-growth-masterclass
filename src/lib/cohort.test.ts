import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  MASTERCLASS_DATE_ISO,
  MASTERCLASS_DATE_LABEL,
  formatCohortDate,
  formatCohortTime,
  getCohortStartMs,
} from "./cohort.ts";

describe("Business Growth Masterclass cohort", () => {
  test("starts on 23 November 2026 at 5:00 PM Pakistan time", () => {
    assert.equal(MASTERCLASS_DATE_ISO, "2026-11-23T12:00:00Z");
    assert.equal(getCohortStartMs(), Date.parse("2026-11-23T12:00:00Z"));
    assert.equal(formatCohortDate(), "23 November 2026");
    assert.equal(formatCohortTime(), "5:00 PM PKT");
  });

  test("uses Monday and the 5:00–7:30 PM PKT timing in the shared label", () => {
    assert.equal(
      MASTERCLASS_DATE_LABEL,
      "Masterclass: 23rd (Mon) November at 5:00 PM – 7:30 PM Pakistan Standard Time",
    );
    assert.equal(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        weekday: "long",
      }).format(new Date(MASTERCLASS_DATE_ISO)),
      "Monday",
    );
  });
});
