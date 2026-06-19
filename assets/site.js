(function(){
"use strict";
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
var doc=document.documentElement;
/* mobile-safe video autoplay: attempt play, retry on first gesture */
var hv=document.getElementById('heroVid');
if(hv){
  hv.muted=true; hv.setAttribute('muted','');
  var playVid=function(){try{var p=hv.play();if(p&&p.catch)p.catch(function(){});}catch(e){}};
  playVid(); hv.addEventListener('loadeddata',playVid); hv.addEventListener('canplay',playVid);
  var ges=function(){playVid();document.removeEventListener('touchstart',ges);document.removeEventListener('click',ges);};
  document.addEventListener('touchstart',ges,{passive:true});
  document.addEventListener('click',ges);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)playVid();});
}

var lc=document.getElementById('lcount');
if(lc&&!reduced){var s0=performance.now();(function ct(t){var p=Math.min((t-s0)/1400,1);lc.textContent=String(Math.round(p*100)).padStart(2,'0');if(p<1)requestAnimationFrame(ct);})(s0);}
setTimeout(function(){var l=document.querySelector('.loader');if(l)l.style.display='none';},2700);

if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');if(e.target.classList.contains('numbers'))counts(e.target);io.unobserve(e.target);}})},{threshold:0.14});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
}
setTimeout(function(){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')});document.querySelectorAll('.numbers').forEach(counts);},2600);

function counts(scope){
  scope.querySelectorAll('[data-count]').forEach(function(el){
    if(el.dataset.done)return;el.dataset.done=1;if(reduced)return;
    var target=parseFloat(el.dataset.count),dur=1500,s=performance.now();
    var fmt=function(n){return Math.round(n).toLocaleString('en-GB')};el.textContent='0';
    (function tk(t){var p=Math.min((t-s)/dur,1),e=1-Math.pow(1-p,4);el.textContent=fmt(target*e);if(p<1)requestAnimationFrame(tk);})(s);
  });
}

var fillEls=[];
document.querySelectorAll('[data-fill]').forEach(function(el){
  var tmp=document.createElement('div');tmp.innerHTML=el.innerHTML;var out=[];
  (function walk(node,acc){[].slice.call(node.childNodes).forEach(function(c){
    if(c.nodeType===3){c.textContent.split(/(\s+)/).forEach(function(p){if(/^\s+$/.test(p))out.push(p);else if(p)out.push('<span class="w'+(acc?' acc':'')+'">'+p+'</span>');});}
    else if(c.nodeType===1)walk(c,acc||c.tagName==='EM');});})(tmp,false);
  el.innerHTML=out.join('');el.classList.add('split');
  fillEls.push({el:el,words:[].slice.call(el.querySelectorAll('.w'))});
});

var prog=document.getElementById('spineProgress'),label=document.getElementById('spineLabel');
var sections=[].slice.call(document.querySelectorAll('[data-spine]'));
var hdr=document.getElementById('hdr'),heroIn=document.getElementById('heroIn'),heroVid=document.getElementById('heroVid');
var cur='Pivitt';
function loop(){
  var vh=innerHeight,y=scrollY,h=doc;
  if(hdr)hdr.classList.toggle('solid',y>40);
  if(!reduced){
    if(heroIn){var hp=Math.min(y/vh,1);heroIn.style.transform='translateY('+(hp*70).toFixed(1)+'px)';heroIn.style.opacity=(1-hp*0.9).toFixed(2);}
    if(heroVid){var hv=Math.min(y/vh,1);heroVid.style.transform='scale('+(1+hv*0.12).toFixed(3)+')';}
    for(var k=0;k<fillEls.length;k++){var fe=fillEls[k],rf=fe.el.getBoundingClientRect();
      var pp=Math.max(0,Math.min(1,(vh*0.82-rf.top)/(rf.height+vh*0.30)));var n=Math.round(pp*fe.words.length);
      for(var w=0;w<fe.words.length;w++)fe.words[w].classList.toggle('lit',w<n);}
  } else { fillEls.forEach(function(fe){fe.words.forEach(function(x){x.classList.add('lit')})}); }
  if(prog)prog.style.height=(y/(h.scrollHeight-h.clientHeight)*100)+'%';
  var c2='Pivitt';for(var s=0;s<sections.length;s++){if(sections[s].getBoundingClientRect().top<vh*0.4)c2=sections[s].dataset.spine}
  if(c2!==cur&&label){cur=c2;label.style.opacity=0;setTimeout(function(){label.textContent=cur;label.style.opacity=1},200)}
  requestAnimationFrame(loop);
}

var fine=matchMedia('(pointer:fine)').matches&&innerWidth>900&&!reduced;
if(fine){
  var dot=document.querySelector('.cur-dot'),ring=document.querySelector('.cur-ring');
  var rx=-100,ry=-100,tx=-100,ty=-100;
  addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;dot.style.left=tx+'px';dot.style.top=ty+'px'});
  (function cl(){rx+=(tx-rx)*0.18;ry+=(ty-ry)*0.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(cl)})();
  document.querySelectorAll('a,button').forEach(function(el){
    el.addEventListener('mouseenter',function(){ring.classList.add(el.dataset.cursor?'view':'lnk');if(el.dataset.cursor)ring.querySelector('span').textContent=el.dataset.cursor});
    el.addEventListener('mouseleave',function(){ring.classList.remove('lnk','view')});
  });
  document.querySelectorAll('.mag').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-(r.left+r.width/2))*0.2)+'px,'+((e.clientY-(r.top+r.height/2))*0.35)+'px)';});
    b.addEventListener('mouseleave',function(){b.style.transition='transform .5s var(--ease)';b.style.transform='';setTimeout(function(){b.style.transition=''},500)});
  });
}else{var d=document.querySelector('.cur-dot'),r=document.querySelector('.cur-ring');if(d)d.style.display='none';if(r)r.style.display='none';}

var mt=document.getElementById('menuToggle'),mm=document.getElementById('mobileMenu');
if(mt&&mm){mt.addEventListener('click',function(){var o=mm.classList.toggle('open');mt.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';mm.setAttribute('aria-hidden',o?'false':'true');});mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mm.classList.remove('open');mt.classList.remove('open');document.body.style.overflow='';});});}

/* homepage motion: clip-reveal + kinetic scroll-velocity band */
var _RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var _rows=[].slice.call(document.querySelectorAll('.kin-row'));
if(_rows.length&&!_RM){
  var _w=_rows.map(function(r){return r.scrollWidth/2;});
  var _off=_rows.map(function(r,i){return r.getAttribute('data-dir')==='right'?-_w[i]:0;});
  var _sy=window.pageYOffset,_v=0;
  window.addEventListener('resize',function(){_w=_rows.map(function(r){return r.scrollWidth/2;});},{passive:true});
  (function _kloop(){
    var y=window.pageYOffset,dy=y-_sy;_sy=y;
    _v+=(dy-_v)*0.15;var v=Math.max(-80,Math.min(80,_v));
    for(var i=0;i<_rows.length;i++){
      var dir=_rows[i].getAttribute('data-dir')==='right'?1:-1;var w=_w[i]||1;
      _off[i]+=dir*0.5+v*0.05*dir;
      if(_off[i]<=-w)_off[i]+=w;if(_off[i]>=0)_off[i]-=w;
      _rows[i].style.transform='translate3d('+_off[i].toFixed(2)+'px,0,0) skewX('+(v*0.06).toFixed(2)+'deg)';
    }
    requestAnimationFrame(_kloop);
  })();
}

/* Pivitt 360 framework wheel */
var M360=document.getElementById('m360');
if(M360){
  var D=[
    {n:"Brand Strategy",s:"Strategy",st:1,c:"#3B82F6",d:"Purpose, values and the decision-making criteria the whole brand answers to.",items:["Brand Framework","Cultural Foundation","Decision-Making Criteria","Customer Assurance","Quality Commitment","Enhanced Trust & Confidence","Alignment of Values"]},
    {n:"Target Audience",s:"Audience",st:1,c:"#8B5CF6",d:"Who you are for, how they buy, and where the demand actually sits.",items:["Clarify Goals","Align Objectives with Audience","Analyse Existing Customer Base","Competitor Analysis","Industry Trends"]},
    {n:"Unique Selling Proposition",s:"USP",st:1,c:"#06B6D4",d:"The defensible difference, stated so a buyer can repeat it.",items:["Unique Features or Attributes","Proprietary Technology","Customisation Options","Brand Story & Heritage","Ethical Practices","Exceptional Performance","Recognition & Awards"]},
    {n:"Brand Positioning",s:"Positioning",st:1,c:"#10B981",d:"The market space you own, and the promise that holds it.",items:["Target Market Definition","Competitive Analysis","Unique Value Proposition","Brand Promise","Positioning Statement"]},
    {n:"Brand Identity",s:"Identity",st:2,c:"#F59E0B",d:"The visual and verbal system, built as evidence of the thinking.",items:["Primary Logo & Variations","Logo Usage Guidelines","Icons & Symbols","Primary & Secondary Typefaces","Typography Hierarchy","Colour Palette","Colour Codes: Print & Digital","Design Elements & Patterns"]},
    {n:"Brand Assets",s:"Assets",st:3,c:"#EC4899",d:"The guidelines and materials that make the system usable at scale.",items:["Logo Usage Rules","Colour Usage Guidelines","Typography Guidelines","Imagery & Photography Guidelines","Tone of Voice Guidelines","Social Media Standards","Approved Photography","Illustrations & Graphics"]}
  ];
  var ST={1:"Stage 1 \u00b7 Strategy & Positioning",2:"Stage 2 \u00b7 Identity & Expression",3:"Stage 3 \u00b7 Assets & Activation"};
  var SC={1:"#5b8cff",2:"#F59E0B",3:"#EC4899"};
  var CX=400,CY=400,R1=118,R2=298,RL=212,RO=312;
  function pt(r,deg){var a=(deg-90)*Math.PI/180;return [CX+r*Math.cos(a),CY+r*Math.sin(a)];}
  function sector(r1,r2,a0,a1){var p0=pt(r2,a0),p1=pt(r2,a1),p2=pt(r1,a1),p3=pt(r1,a0);var lg=(a1-a0)>180?1:0;return "M"+p0[0].toFixed(1)+" "+p0[1].toFixed(1)+"A"+r2+" "+r2+" 0 "+lg+" 1 "+p1[0].toFixed(1)+" "+p1[1].toFixed(1)+"L"+p2[0].toFixed(1)+" "+p2[1].toFixed(1)+"A"+r1+" "+r1+" 0 "+lg+" 0 "+p3[0].toFixed(1)+" "+p3[1].toFixed(1)+"Z";}
  function arc(r,a0,a1){var p0=pt(r,a0),p1=pt(r,a1);var lg=(a1-a0)>180?1:0;return "M"+p0[0].toFixed(1)+" "+p0[1].toFixed(1)+"A"+r+" "+r+" 0 "+lg+" 1 "+p1[0].toFixed(1)+" "+p1[1].toFixed(1);}
  var segs="",labs="";
  for(var i=0;i<6;i++){var a0=i*60-30,a1=i*60+30,mid=i*60,lp=pt(RL,mid);
    segs+='<path class="m-seg" data-i="'+i+'" d="'+sector(R1,R2,a0,a1)+'" style="--pc:'+D[i].c+'"></path>';
    labs+='<text class="m-lab" data-i="'+i+'" x="'+lp[0].toFixed(1)+'" y="'+lp[1].toFixed(1)+'">'+D[i].s+'</text>';}
  var stArcs=[{st:1,a0:-30,a1:210},{st:2,a0:210,a1:270},{st:3,a0:270,a1:330}];
  var aHtml=stArcs.map(function(s){return '<path class="m-stage-arc" data-st="'+s.st+'" d="'+arc(RO,s.a0+2.5,s.a1-2.5)+'" style="stroke:'+SC[s.st]+'"></path>';}).join("");
  var hub='<circle class="m-hub" cx="400" cy="400" r="'+R1+'"></circle><text class="m-hub-t1" x="400" y="388">PIVITT</text><text class="m-hub-t2" x="400" y="436">360</text>';
  var svg='<svg viewBox="0 0 800 800" class="m360-svg" role="img" aria-label="Pivitt 360 Brand Model framework">'+aHtml+segs+labs+hub+'</svg>';
  var legend='<div class="m360-legend">'+[1,2,3].map(function(k){return '<span style="--c:'+SC[k]+'">'+ST[k]+'</span>';}).join("")+'</div>';
  M360.innerHTML='<div class="m360-wheel">'+svg+legend+'</div><div class="m360-panel"><div class="m-stage-chip"></div><h3 class="m-pn"></h3><p class="m-pd"></p><div class="m-cap"></div><ul class="m-items"></ul></div>';
  var P=M360.querySelector('.m360-panel');
  function sel(i){
    var x=D[i];
    P.style.setProperty('--pc',x.c);
    P.querySelector('.m-stage-chip').textContent=ST[x.st];
    P.querySelector('.m-pn').textContent=x.n;
    P.querySelector('.m-pd').textContent=x.d;
    P.querySelector('.m-cap').textContent=x.items.length+' components';
    P.querySelector('.m-items').innerHTML=x.items.map(function(it){return '<li>'+it+'</li>';}).join("");
    M360.querySelectorAll('.m-seg').forEach(function(s){s.classList.toggle('on',+s.getAttribute('data-i')===i);});
    M360.querySelectorAll('.m-lab').forEach(function(s){s.classList.toggle('on',+s.getAttribute('data-i')===i);});
    M360.querySelectorAll('.m-stage-arc').forEach(function(s){s.classList.toggle('on',+s.getAttribute('data-st')===x.st);});
  }
  M360.querySelectorAll('.m-seg,.m-lab').forEach(function(el){
    var i=+el.getAttribute('data-i');
    el.addEventListener('mouseenter',function(){sel(i);});
    el.addEventListener('click',function(){sel(i);});
  });
  sel(0);
}
doc.classList.remove('no-js');
requestAnimationFrame(loop);
})();
