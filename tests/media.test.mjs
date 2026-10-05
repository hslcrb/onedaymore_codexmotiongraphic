import test from 'node:test';
import assert from 'node:assert/strict';
import { Soundtrack } from '../src/audio.js';
import { Renderer } from '../src/renderer.js';
globalThis.Audio=class {constructor(){this.currentTime=0;this.duration=300;}addEventListener(){}pause(){} };
globalThis.window={};globalThis.document={createElement:()=>({}),head:{append(){}}};
test('returning to recording retains normalized film position',()=>{
  const a=new Soundtrack(()=>{},()=>{});let seek;
  a.player={pauseVideo(){},getDuration:()=>300,seekTo:t=>seek=t};a.ready=true;
  a.source='study';a.duration=235;a.study.clock.seek(70);
  a.switch('youtube');assert.equal(seek,70/235*300);
});
test('study completion is emitted only once',()=>{
  let ended=0;const a=new Soundtrack((p,e)=>{if(e)ended++;},()=>{});
  a.source='study';a.study.clock.seek(235);a.playing=true;a.finish();a.finish();a.finish();assert.equal(ended,1);
});
test('late YouTube network failure does not interrupt offline soundtrack',()=>{
  let failure=0,script;document.head.append=s=>script=s;
  const a=new Soundtrack(()=>{},()=>failure++);a.source='study';script.onerror();assert.equal(failure,0);
});
test('drawing text inherits chapter fade opacity',()=>{
  const drawn=[];const ctx={globalAlpha:.25,save(){},restore(){},translate(){},rotate(){},scale(){},fillText(){drawn.push(this.globalAlpha);}};
  Renderer.prototype.text.call({ctx},'ONE',1,1,40,{alpha:.5});assert.equal(drawn[0],.125);
});
test('reduced-motion poster uses a constant decorative clock',()=>{
  const frames=[];const r={w:1440,h:900,reduced:true,ctx:{save(){},restore(){},beginPath(){},arc(){},fill(){}},background(){},ring(...args){frames.push(args);},line(){},city(){},particles(...args){frames.push(args);},text(){}};
  Renderer.prototype.poster.call(r,1);const first=JSON.stringify(frames);frames.length=0;
  Renderer.prototype.poster.call(r,50);assert.equal(JSON.stringify(frames),first);
});
