import assert from "node:assert/strict";
import { formatTimerRemaining } from "../app/lib/format-timer.ts";

const now = Date.UTC(2026, 0, 1);
assert.equal(formatTimerRemaining(now - 1, now), "Expired");
assert.equal(formatTimerRemaining(now + 2 * 86400000 + 3 * 3600000, now), "2d 3h");
assert.equal(formatTimerRemaining(now + 5 * 3600000 + 12 * 60000, now), "5h 12m");
console.log("format-timer check ok");
