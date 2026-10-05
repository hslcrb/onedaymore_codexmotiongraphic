const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const files = ['src/audio.js','src/renderer.js'];
const originals = files.map(p=>fs.readFileSync(p,'utf8'));
try {
  fs.writeFileSync(files[0], originals[0].replace('this.source=source;this.duration=this.source', 'this.source=source;this.seek(t);this.duration=this.source').replace('DURATION:DURATION;this.seek(t);}', 'DURATION:DURATION;}').replace("this.source==='study'&&this.playing&&", "this.source==='study'&&"));
  fs.writeFileSync(files[1], originals[1].replaceAll('c.globalAlpha*=alpha','c.globalAlpha=alpha').replace('poster(t){if(this.reduced)t=0;', 'poster(t){'));
  const result=spawnSync(process.execPath,['--test','tests/media.test.mjs'],{encoding:'utf8'});
  console.log(result.stdout); console.log(result.stderr);
  if(result.status===0)throw Error('Regression checks unexpectedly passed legacy code');
  console.log('RED confirmed. Restoring all production fixes.');
} finally { files.forEach((p,i)=>fs.writeFileSync(p,originals[i])); }
