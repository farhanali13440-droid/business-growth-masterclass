import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { isComplete, scoreApplication, type ApplicationAnswers } from "./call-qualification.ts";

const base: ApplicationAnswers = {
  role: "owner",
  specialty_city: "Dermatologist, Lahore",
  monthly_patients: "20-50",
  goal: "more_patients",
  preference: "dfy",
  budget: "50-100k",
  ad_budget: "20-50k",
  timeline: "now",
  decision_maker: "yes",
};

describe("scoreApplication", () => {
  test("owner with PKR 50k+ budget, ready now, wants DFY → qualified", () => {
    assert.equal(scoreApplication(base), "qualified");
    assert.equal(scoreApplication({ ...base, preference: "dwy", timeline: "30d" }), "qualified");
  });

  test("knock-outs → diy", () => {
    assert.equal(scoreApplication({ ...base, role: "employed" }), "diy");
    assert.equal(scoreApplication({ ...base, role: "student" }), "diy");
    assert.equal(scoreApplication({ ...base, decision_maker: "no" }), "diy");
    assert.equal(scoreApplication({ ...base, preference: "diy" }), "diy");
    assert.equal(scoreApplication({ ...base, budget: "lt30k" }), "diy");
  });

  test("serious but under the minimum or not ready → almost", () => {
    assert.equal(scoreApplication({ ...base, budget: "30-49k" }), "almost");
    assert.equal(scoreApplication({ ...base, timeline: "exploring" }), "almost");
    assert.equal(scoreApplication({ ...base, ad_budget: "none" }), "almost");
  });
});

describe("isComplete", () => {
  test("requires every answer to be a valid option", () => {
    assert.equal(isComplete(base), true);
    assert.equal(isComplete({ ...base, budget: "1-crore" }), false);
    assert.equal(isComplete({ ...base, specialty_city: "" }), false);
  });
});
