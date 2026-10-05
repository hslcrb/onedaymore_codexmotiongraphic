import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, DURATION, clampTime, chapterAt, FilmClock } from '../src/timeline.js';
test('chapters cover the entire film without gaps', () => {
  assert.equal(chapters[0].start, 0);
  for (let i=1;i<chapters.length;i++) assert.equal(chapters[i-1].end,chapters[i].start);
  assert.equal(chapters.at(-1).end,DURATION);
});
test('seeking cannot produce negative, overflow or non-finite time', () => {
  assert.equal(clampTime(-20),0); assert.equal(clampTime(999),DURATION);
  assert.equal(clampTime(NaN),0); assert.equal(clampTime(Infinity),0);
});
test('exact boundaries select new scene, final time selects finale', () => {
  for(const c of chapters) assert.equal(chapterAt(c.start).id,c.id);
  assert.equal(chapterAt(DURATION).id,chapters.at(-1).id);
});
test('clock preserves pause, resumes and clamps at end', () => {
  const c = new FilmClock(); c.play(1000); assert.equal(c.time(4000),3);
  c.pause(4000); assert.equal(c.time(20000),3);
  c.seek(80,20000); assert.equal(c.time(30000),80);
  c.play(30000); assert.equal(c.time(32000),82);
  c.seek(DURATION-1,32000); assert.equal(c.time(35000),DURATION);
});
