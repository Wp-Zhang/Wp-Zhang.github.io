import test from "node:test";
import assert from "node:assert/strict";
import { isPublished } from "../src/lib/publication.mjs";

const now = new Date("2026-09-14T00:00:00Z");
test("only explicit public status can publish", () => {
  for (const status of [undefined, "private", "draft", "PUBLIC", ""]) {
    assert.equal(isPublished({ status, date: "2020-01-01" }, now), false);
  }
  assert.equal(
    isPublished({ status: "public", date: "2020-01-01" }, now),
    true,
  );
});
test("future and invalid dates cannot publish", () => {
  for (const date of ["2099-01-01", "invalid", undefined]) {
    assert.equal(isPublished({ status: "public", date }, now), false);
  }
});
