import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeProgress, completedCount } from "../campus/route-state.mjs";
test("saved progress never exceeds eight real activities", () => {
  const forged = {fake:true,"week-0-task-0":true,"week-3-task-1":true, "week-6-task-0":true};
  assert.equal(completedCount(forged),2);
  assert.deepEqual(sanitizeProgress(forged),{"week-0-task-0":true,"week-3-task-1":true});
});
test("only explicit boolean true counts, not untrusted strings", () => {
  const input = {"week-0-task-0":"true","week-0-task-1":1,"week-1-task-0":false,"week-1-task-1":true};
  assert.equal(completedCount(input),1);
});
test("invalid persisted shapes are discarded", () => {
  for(const state of [null,undefined,"true",[],42]) {
    assert.equal(completedCount(state),0);
    assert.deepEqual(sanitizeProgress(state),{});
  }
});
test("exactly eight marks reaches, but never exceeds, completion", () => {
  const progress=Object.fromEntries(Array.from({length:4},(_,i)=>[0,1].map(j=>[`week-${i}-task-${j}`,true])).flat());
  assert.equal(completedCount(progress),8);
  progress["__proto__"]=true;
  assert.equal(completedCount(progress),8);
});
