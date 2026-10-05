export const DURATION = 235;
export const chapters = [
  {id:'prologue',start:0,end:27,title:'The eve',subtitle:'A city holds its breath.',color:'#ece5d7'},
  {id:'valjean',start:27,end:55,title:'A fugitive',subtitle:'The past follows. The future calls.',color:'#ece5d7'},
  {id:'lovers',start:55,end:85,title:'Two hearts',subtitle:'So close. A world apart.',color:'#d8b598'},
  {id:'eponine',start:85,end:112,title:'Alone',subtitle:'Some love is carried in silence.',color:'#a6baca'},
  {id:'revolt',start:112,end:146,title:'The barricade',subtitle:'A whisper becomes a thousand voices.',color:'#ee4934'},
  {id:'javert',start:146,end:171,title:'The pursuit',subtitle:'Order casts a long shadow.',color:'#a6baca'},
  {id:'ensemble',start:171,end:213,title:'All as one',subtitle:'Seven lives. One approaching dawn.',color:'#ee4934'},
  {id:'finale',start:213,end:DURATION,title:'Tomorrow',subtitle:'Everything begins at the edge of dawn.',color:'#ece5d7'},
];
export const clampTime = t => Number.isFinite(t) ? Math.max(0,Math.min(DURATION,t)) : 0;
export const chapterAt = t => chapters.find(c => clampTime(t)>=c.start && clampTime(t)<c.end) || chapters.at(-1);
export class FilmClock {
  constructor(){this.position=0;this.anchor=0;this.playing=false;}
  time(now=performance.now()){return clampTime(this.position+(this.playing?(now-this.anchor)/1000:0));}
  play(now=performance.now()){if(this.playing)return;this.anchor=now;this.playing=true;}
  pause(now=performance.now()){this.position=this.time(now);this.playing=false;}
  seek(t,now=performance.now()){this.position=clampTime(t);this.anchor=now;}
}
