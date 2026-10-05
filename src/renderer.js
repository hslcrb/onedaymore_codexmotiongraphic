import { chapterAt, chapters, DURATION } from './timeline.js';
const PAPER='#ece5d7', RED='#ee4934', INK='#131310';
const ease=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
const fract=n=>n-Math.floor(n);
const rand=i=>fract(Math.sin(i*127.1+311.7)*43758.5453);
export class Renderer {
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.reduced=false;this.resize();this.resizeHandler=()=>this.resize();window.addEventListener('resize',this.resizeHandler);}
  resize(){this.w=innerWidth;this.h=innerHeight;const d=Math.min(devicePixelRatio||1,2);this.canvas.width=this.w*d;this.canvas.height=this.h*d;this.ctx.setTransform(d,0,0,d,0,0);this.dirty=true;}
  text(str,x,y,size,{color=PAPER,alpha=1,align='center',font='Barlow Condensed',weight=800,italic=false,rotate=0,scaleX=1,stroke=false}={}){
    const c=this.ctx;c.save();c.translate(x,y);c.rotate(rotate);c.scale(scaleX,1);c.globalAlpha*=alpha;c.textAlign=align;c.textBaseline='middle';c.font=`${italic?'italic ':''}${weight} ${size}px "${font}", ${font==='Bodoni Moda'?'Georgia':'Arial'}, serif`;c.fillStyle=color;c.strokeStyle=color;c.lineWidth=.8;
    if(this.letterClock!==null&&this.letterClock!==undefined&&size>55&&!this.reduced){
      const total=c.measureText(str).width;let offset=align==='left'?0:align==='right'?-total:-total/2;c.textAlign='left';
      [...str].forEach((letter,i)=>{const width=c.measureText(letter).width,arrival=ease((this.letterClock-i*.07)/1.25);c.save();c.translate(offset,(1-arrival)*size*.7+Math.sin(this.letterClock*.8+i*.6)*size*.006);c.rotate((1-arrival)*(i%2===0?-.18:.18));c.globalAlpha*=arrival;if(stroke)c.strokeText(letter,0,0);else c.fillText(letter,0,0);c.restore();offset+=width;});
    }else if(stroke)c.strokeText(str,0,0);else c.fillText(str,0,0);c.restore();
  }
  line(x1,y1,x2,y2,color=PAPER,alpha=.15,width=1){const c=this.ctx;c.save();c.globalAlpha*=alpha;c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.restore();}
  ring(x,y,r,t,alpha=.3,color=RED){const c=this.ctx;c.save();c.strokeStyle=color;c.globalAlpha*=alpha;c.lineWidth=.7;c.beginPath();c.arc(x,y,r,t,t+Math.PI*1.65);c.stroke();c.beginPath();c.arc(x,y,r*.94,-t,-t+Math.PI*1.4);c.stroke();for(let i=0;i<48;i++){let a=i*Math.PI/24+t*.05;c.beginPath();c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);c.lineTo(x+Math.cos(a)*(r+(i%4===0?8:3)),y+Math.sin(a)*(r+(i%4===0?8:3)));c.stroke();}c.restore();}
  particles(t,intensity=1,color=PAPER){const c=this.ctx;const n=this.reduced?24:100;for(let i=0;i<n;i++){const speed=(8+rand(i+200)*24)*intensity;const x=rand(i)*this.w+Math.sin(t*.1+i)*15;const y=this.h-fract(rand(i+100)+t*speed/this.h)*this.h;const a=(.04+rand(i+300)*.17)*Math.sin(Math.PI*y/this.h);c.globalAlpha=a;c.fillStyle=color;c.beginPath();c.arc(x,y,.4+rand(i+400)*1.6,0,Math.PI*2);c.fill();}c.globalAlpha=1;}
  city(t,alpha=.35){const c=this.ctx,w=this.w,h=this.h;c.save();c.globalAlpha*=alpha;c.fillStyle='#080b08';for(let i=0;i<30;i++){let x=i*w/28,height=20+rand(i+90)*65;c.fillRect(x,h*.82-height,w/28+1,height+70);c.beginPath();c.moveTo(x-3,h*.82-height);c.lineTo(x+w/56,h*.82-height-15-rand(i+80)*16);c.lineTo(x+w/28+3,h*.82-height);c.fill();}c.restore();this.line(0,h*.82,w,h*.82,PAPER,.08);}
  background(t,red=false){const c=this.ctx,w=this.w,h=this.h; c.fillStyle=red?'#b82d22':INK;c.fillRect(0,0,w,h);const g=c.createRadialGradient(w*.63,h*.4,0,w*.63,h*.4,w*.75);g.addColorStop(0,red?'#ef4931':'#323324');g.addColorStop(1,red?'#7b1714':'#0c100d');c.fillStyle=g;c.fillRect(0,0,w,h);this.line(w*.045,105,w*.955,105,PAPER,.12);this.line(w*.045,h-131,w*.955,h-131,PAPER,.08);}
  poster(t){if(this.reduced)t=0;const w=this.w,h=this.h,c=this.ctx;this.background(t);const x=w*.71,y=h*.40,r=Math.min(w*.27,h*.33);this.ring(x,y,r,this.reduced?0:t*.03,.36);this.ring(x,y,r*.7,-t*.02,.13,PAPER);c.save();c.fillStyle=RED;c.globalAlpha=.025;c.beginPath();c.arc(x,y,r*.9,0,Math.PI*2);c.fill();c.restore();this.line(w*.05,h*.47,w*.95,h*.47,PAPER,.05);this.city(t,.5);this.particles(t,.4);this.text('XVIII · XXXII',w*.88,h*.69,8,{font:'IBM Plex Mono',alpha:.35,rotate:-Math.PI/2,weight:400});this.text('DEMAIN',w*.75,h*.78,w*.12,{stroke:true,alpha:.07});}
  barricade(t,p,alpha=1){const c=this.ctx,w=this.w,h=this.h;c.save();c.globalAlpha*=alpha;for(let i=0;i<12;i++){const x=w*(i/11),y=h*(.69+rand(i+80)*.05);c.save();c.translate(x,y);c.rotate((rand(i+22)-.5)*.65+Math.sin(t*.7+i)*.005);c.fillStyle=i%3===0?RED:'#414238';c.fillRect(-w*.04,-12,w*.2,25+rand(i)*12);c.strokeStyle='#7c7660';c.lineWidth=.5;c.strokeRect(-w*.04,-12,w*.2,25);c.restore();}this.line(w*.25,h*.6,w*.38,h*.26,PAPER,.6,1.2);c.fillStyle=RED;c.beginPath();c.moveTo(w*.38,h*.26);c.bezierCurveTo(w*.43,h*.23,w*.48,h*.31,w*.54,h*.26);c.lineTo(w*.5,h*.38);c.bezierCurveTo(w*.45,h*.41,w*.41,h*.32,w*.34,h*.37);c.closePath();c.fill();c.restore();}
  scene(ch,t,alpha=1){const c=this.ctx,w=this.w,h=this.h;const p=(t-ch.start)/(ch.end-ch.start),u=t-ch.start;const enter=ease(u/2);const motion=this.reduced?0:t;const sz=Math.min(w*.19,h*.25),mobile=w<761;
    this.letterClock=u;c.save();c.globalAlpha*=alpha;
    if(!this.reduced){c.translate(w*.5,h*.48);c.scale(1+Math.sin(u*.12)*.012,1+Math.sin(u*.12)*.012);c.translate(-w*.5,-h*.48);}
    if(ch.id==='prologue'){
      this.ring(w*.5,h*.46,Math.min(w*.28,h*.34),motion*.04,.5);
      if(u<20){const word=u<8?'ONE':u<14?'DAY':'MORE';this.letterClock=u-(u<8?0:u<14?8:14);this.text(word,w*.5,h*.46,sz*(word==='MORE'?1.35:1.8),{font:'Bodoni Moda',italic:word==='MORE',color:word==='MORE'?RED:PAPER,alpha:enter});}
      else{this.letterClock=u-20;this.text('ONE',w*.5,h*.33,sz*.96,{font:'Bodoni Moda'});this.text('DAY MORE',w*.5,h*.55,sz*.88,{font:'Bodoni Moda',italic:true,color:RED});}
      this.text('THE NIGHT BEFORE EVERYTHING',w*.5,h*.72,Math.max(7,w*.007),{font:'IBM Plex Mono',weight:400,alpha:.7});
      if(u>15){this.text('1832',w*.5,h*.45,sz*2.3,{stroke:true,alpha:ease((u-15)/5)*.08});}
    }else if(ch.id==='valjean'){
      for(let i=0;i<5;i++)this.text('MEMORY',w*.5+(i-2)*8,h*.37+i*4,sz*.9,{stroke:i!==4,alpha:i===4?.9:.07+i*.04,scaleX:1+Math.sin(motion*.14)*.05});
      this.text('BECOMES',w*.5,h*.5,sz*.19,{font:'IBM Plex Mono',weight:400,color:RED,alpha:enter});
      this.text('DESTINY',w*.5,h*.63,sz*.9,{font:'Bodoni Moda',italic:true,alpha:enter});
      this.ring(w*.13,h*.4,w*.22,-motion*.03,.2);this.line(w*.17,h*.24,w*.82,h*.76,RED,.2);
      this.text('24601',w*.83,h*.72,sz*.25,{font:'IBM Plex Mono',alpha:.3});
    }else if(ch.id==='lovers'){
      const sep=(mobile?w*.2:w*.24)*(1-.35*Math.sin(p*Math.PI));
      this.ring(w*.5-sep/2,h*.47,sz*.95,motion*.03,.3,'#c3a283');this.ring(w*.5+sep/2,h*.47,sz*.95,-motion*.03,.3,'#c3a283');
      this.text('YOU',w*.5-sep,h*.4,sz*.95,{font:'Bodoni Moda',alpha:enter});
      this.text('&',w*.5,h*.5,sz*.65,{font:'Bodoni Moda',italic:true,color:RED,alpha:.8});
      this.text('I',w*.5+sep,h*.58,sz*1.25,{font:'Bodoni Moda',alpha:enter});
      this.line(w*.5,h*.22,w*.5,h*.73,'#c3a283',.18);
      this.text('A DISTANCE NO MAP CAN MEASURE',w*.5,h*.75,Math.max(7,w*.007),{font:'IBM Plex Mono',alpha:.6,weight:400});
    }else if(ch.id==='eponine'){
      for(let i=0;i<28;i++)this.line(rand(i)*w,fract(rand(i+50)+motion*.05)*h,rand(i)*w-8,fract(rand(i+50)+motion*.05)*h+35,'#92a5b5',.13);
      this.text('ALONE',w*.5,h*.44,sz*1.2,{font:'Bodoni Moda',alpha:enter,color:'#c6d1d5'});
      this.text('IN A CITY OF MILLIONS',w*.5,h*.6,sz*.12,{font:'IBM Plex Mono',weight:400,alpha:.6});
      this.ring(w*.5,h*.46,sz*1.6,-motion*.025,.13,'#a6baca');
      this.text('ÉPONINE',w*.5,h*.74,sz*.1,{font:'IBM Plex Mono',alpha:.4,weight:400});
    }else if(ch.id==='revolt'){
      this.barricade(motion,p,.8);const words=p<.45?['RISE','TOGETHER']:['BUILD','TOMORROW'];
      this.text(words[0],w*.5,h*.37,sz*1.35,{color:RED,alpha:enter});
      this.text(words[1],w*.5,h*.54,sz*.87,{alpha:enter});
      for(let i=0;i<9;i++)this.line(w*.5,h*.92,w*(i/8),h*.19,RED,.07+Math.sin(motion*2)*.015);
      this.text('THE STREETS REMEMBER',w*.5,h*.76,Math.max(7,w*.007),{font:'IBM Plex Mono',alpha:.6,weight:400});
    }else if(ch.id==='javert'){
      for(let i=0;i<13;i++)this.line(w*i/12,h*.18,w*i/12,h*.76,'#a6baca',.15);
      for(let i=0;i<9;i++)this.line(w*.1,h*(.18+i*.075),w*.9,h*(.18+i*.075),'#a6baca',.08);
      this.text('ORDER',w*.5,h*.38,sz*1.1,{alpha:enter,color:'#b4c2c9'});
      this.text('OBSESSION',w*.5,h*.57,sz*.78,{stroke:true,color:'#b4c2c9'});
      const x=w*(.1+.8*fract(motion*.03));this.line(x,h*.18,x,h*.76,RED,.8,2);
      this.text('THE LAW HAS NO SHADOW OF DOUBT',w*.5,h*.74,Math.max(7,w*.007),{font:'IBM Plex Mono',weight:400,alpha:.6});
    }else if(ch.id==='ensemble'){
      const labels=['LOVE','COURAGE','MEMORY','JUSTICE','LONGING','DEFIANCE','HOPE'];
      labels.forEach((s,i)=>{let y=h*(.23+i*.075),x=w*.5+Math.sin(motion*.15+i)*w*.18;this.text(s,x,y,sz*(.38+i*.07),{alpha:.08+Math.sin(p*Math.PI)*.08,stroke:i%2===0,rotate:(i%2?-.06:.06)});});
      const beat=this.reduced?1:1+Math.pow(Math.max(0,Math.sin(u*Math.PI*2/1.44)),8)*.025;
      this.text('ALL',w*.5,h*.32,sz*1.1*beat,{color:RED,alpha:enter});this.text('AS',w*.5,h*.46,sz*.65*beat,{font:'Bodoni Moda',italic:true,alpha:enter});this.text('ONE',w*.5,h*.64,sz*1.4*beat,{alpha:enter});
      this.ring(w*.5,h*.48,sz*1.6,motion*.07,.35);this.barricade(motion,p,.4);
    }else{
      const reveal=ease(u/4), final=u>12;
      this.ring(w*.5,h*.47,sz*1.5,motion*.015,.4,final?INK:PAPER);
      this.text(final?'ONE DAY':'TOMORROW',w*.5,h*(final?.39:.43),sz*(final?.85:.82),{font:'Bodoni Moda',color:final?INK:PAPER,alpha:reveal});
      if(final)this.text('MORE',w*.5,h*.59,sz*1.18,{font:'Bodoni Moda',italic:true,color:INK,alpha:ease((u-12)/2)});
      else this.text('IS OURS TO MAKE',w*.5,h*.61,sz*.13,{font:'IBM Plex Mono',weight:400,alpha:reveal});
      this.text('A KINETIC TRIBUTE TO LES MISÉRABLES',w*.5,h*.75,Math.max(7,w*.0065),{font:'IBM Plex Mono',weight:400,color:final?INK:PAPER,alpha:.7});
    }
    c.restore();this.letterClock=null;
  }
  render(t,started,ambient){if(!started){this.poster(ambient);return;}const ch=chapterAt(t),final=ch.id==='finale'&&t-ch.start>12;this.background(t,final);this.city(t,.3);this.particles(this.reduced?0:t,ch.id==='ensemble'?2:.7,final?INK:PAPER);const idx=chapters.indexOf(ch),u=t-ch.start;if(idx>0&&u<1.3){this.scene(chapters[idx-1],chapters[idx-1].end-.01,1-ease(u/1.3));this.scene(ch,t,ease(u/1.3));}else this.scene(ch,t);const c=this.ctx;c.save();c.fillStyle=final?INK:RED;c.globalAlpha=.6;for(let i=0;i<32;i++){const visualTime=this.reduced?0:t;const a=1+Math.sin(visualTime*2+i*.7)*.4;c.fillRect(this.w*.93+i%4*2,this.h*.75-Math.abs(Math.sin(visualTime*1.6+i*.3))*16,1,5+a*5);}c.restore();}
}
