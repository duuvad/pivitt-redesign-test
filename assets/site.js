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

/* Pivitt 360 framework wheel v2 */
var M360=document.getElementById('m360');
if(M360){
  var D=[
    {n:"Brand Strategy",s:"Strategy",st:1,c:"#3B82F6",svc:"brand-strategy-positioning.html",svl:"strategy & positioning",d:"Purpose, values and the decision-making criteria the whole brand answers to.",items:["Brand Framework","Cultural Foundation","Decision-Making Criteria","Customer Assurance","Quality Commitment","Enhanced Trust & Confidence","Alignment of Values"]},
    {n:"Target Audience",s:"Audience",st:1,c:"#8B5CF6",svc:"brand-strategy-positioning.html",svl:"strategy & positioning",d:"Who you are for, how they buy, and where the demand actually sits.",items:["Clarify Goals","Align Objectives with Audience","Analyse Customer Base","Competitor Analysis","Industry Trends"]},
    {n:"Unique Selling Proposition",s:"USP",st:1,c:"#06B6D4",svc:"brand-strategy-positioning.html",svl:"strategy & positioning",d:"The defensible difference, stated so a buyer can repeat it.",items:["Unique Features or Attributes","Proprietary Technology","Customisation Options","Brand Story & Heritage","Ethical Practices","Exceptional Performance","Recognition & Awards"]},
    {n:"Brand Positioning",s:"Positioning",st:1,c:"#10B981",svc:"brand-strategy-positioning.html",svl:"strategy & positioning",d:"The market space you own, and the promise that holds it.",items:["Target Market Definition","Competitive Analysis","Unique Value Proposition","Brand Promise","Positioning Statement"]},
    {n:"Brand Identity",s:"Identity",st:2,c:"#F59E0B",svc:"brand-identity-design.html",svl:"identity & design",d:"The visual and verbal system, built as evidence of the thinking.",items:["Primary Logo & Variations","Logo Usage Guidelines","Icons & Symbols","Typefaces","Typography Hierarchy","Colour Palette","Colour Codes","Design Elements"]},
    {n:"Brand Assets",s:"Assets",st:3,c:"#EC4899",svc:"brand-production-partnership.html",svl:"production partnership",d:"The guidelines and materials that make the system usable at scale.",items:["Logo Usage Rules","Colour Guidelines","Typography Guidelines","Imagery Guidelines","Tone of Voice","Social Media Standards","Approved Photography","Illustrations & Graphics"]}
  ];
  var ST={1:"Stage 1 \u00b7 Strategy & Positioning",2:"Stage 2 \u00b7 Identity & Expression",3:"Stage 3 \u00b7 Assets & Activation"};
  var SC={1:"#5b8cff",2:"#F59E0B",3:"#EC4899"};
  var CX=400,CY=400,R1=120,R2=298,RL=208,RDOT=283,RO=320,RTICK=346;
  function pt(r,d){var a=(d-90)*Math.PI/180;return [CX+r*Math.cos(a),CY+r*Math.sin(a)];}
  function f(n){return n.toFixed(1);}
  function sector(r1,r2,a0,a1){var p0=pt(r2,a0),p1=pt(r2,a1),p2=pt(r1,a1),p3=pt(r1,a0);var lg=(a1-a0)>180?1:0;return "M"+f(p0[0])+" "+f(p0[1])+"A"+r2+" "+r2+" 0 "+lg+" 1 "+f(p1[0])+" "+f(p1[1])+"L"+f(p2[0])+" "+f(p2[1])+"A"+r1+" "+r1+" 0 "+lg+" 0 "+f(p3[0])+" "+f(p3[1])+"Z";}
  function arc(r,a0,a1){var p0=pt(r,a0),p1=pt(r,a1);var lg=(a1-a0)>180?1:0;return "M"+f(p0[0])+" "+f(p0[1])+"A"+r+" "+r+" 0 "+lg+" 1 "+f(p1[0])+" "+f(p1[1]);}
  var defs='<defs>';
  for(var i=0;i<6;i++){defs+='<radialGradient id="m-g'+i+'" gradientUnits="userSpaceOnUse" cx="400" cy="400" r="298"><stop offset="0%" stop-color="'+D[i].c+'" stop-opacity="0"/><stop offset="56%" stop-color="'+D[i].c+'" stop-opacity="0.05"/><stop offset="100%" stop-color="'+D[i].c+'" stop-opacity="0.28"/></radialGradient>';}
  defs+='<filter id="m-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  var tick='<circle class="m-tick" cx="400" cy="400" r="'+RTICK+'" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="1 13"/>';
  var stArcs=[{st:1,a0:-30,a1:210},{st:2,a0:210,a1:270},{st:3,a0:270,a1:330}];
  var sa=stArcs.map(function(s){return '<path class="m-stage-arc" data-st="'+s.st+'" d="'+arc(RO,s.a0+4,s.a1-4)+'" style="stroke:'+SC[s.st]+'"/>';}).join("");
  var segs="",divs="",edges="",dots="",labs="";
  for(i=0;i<6;i++){var a0=i*60-30,a1=i*60+30,mid=i*60;
    segs+='<path class="m-seg" data-i="'+i+'" d="'+sector(R1,R2,a0,a1)+'" fill="url(#m-g'+i+')" style="--pc:'+D[i].c+'"/>';
    divs+='<path class="m-div" d="'+sector(R1,R2,a0,a1)+'"/>';
    edges+='<path class="m-edge" data-i="'+i+'" d="'+arc(R2,a0+1.5,a1-1.5)+'" style="--pc:'+D[i].c+'"/>';
    var n=D[i].items.length,s0=a0+10,s1=a1-10,sp=(s1-s0)/n,dd="";
    for(var k=0;k<n;k++){var dp=pt(RDOT,s0+(k+0.5)*sp);dd+='<circle cx="'+f(dp[0])+'" cy="'+f(dp[1])+'" r="2.6"/>';}
    dots+='<g class="m-dots" data-i="'+i+'" style="--pc:'+D[i].c+'">'+dd+'</g>';
    var lp=pt(RL,mid);labs+='<text class="m-lab" data-i="'+i+'" x="'+f(lp[0])+'" y="'+f(lp[1])+'">'+D[i].s+'</text>';
  }
  var core='<circle class="m-core" cx="400" cy="400" r="'+R1+'"/><circle class="m-core-ring" cx="400" cy="400" r="'+(R1-2)+'" fill="none"/>'
    +'<text class="m-hub-1" x="400" y="374">PIVITT</text><text class="m-hub-2" x="400" y="422">360</text><text class="m-hub-3" x="400" y="452"></text>';
  var svg='<svg viewBox="0 0 800 800" class="m360-svg" role="img" aria-label="Pivitt 360 Brand Model framework">'+defs+tick+sa+segs+divs+edges+dots+labs+core+'</svg>';
  var legend='<div class="m360-legend">'+[1,2,3].map(function(k){return '<span style="--c:'+SC[k]+'">'+ST[k]+'</span>';}).join("")+'</div>';
  var panel='<div class="m360-panel"><span class="m-index"></span><div class="m-stage-chip"></div><h3 class="m-pn"></h3><span class="m-rule"></span><p class="m-pd"></p><div class="m-cap"></div><ul class="m-items"></ul><a class="m-explore" href=""></a></div>';
  M360.innerHTML='<div class="m360-wheel"><div class="m360-stage-wrap"><div class="m360-glow"></div>'+svg+'</div>'+legend+'</div>'+panel;
  var SVG=M360.querySelector('.m360-svg'),P=M360.querySelector('.m360-panel');
  function sel(i){
    var x=D[i];M360.style.setProperty('--pc',x.c);SVG.classList.add('active');
    P.querySelector('.m-index').textContent=("0"+(i+1)).slice(-2);
    P.querySelector('.m-stage-chip').textContent=ST[x.st];
    P.querySelector('.m-pn').textContent=x.n;
    P.querySelector('.m-pd').textContent=x.d;
    P.querySelector('.m-cap').textContent=x.items.length+' components';
    P.querySelector('.m-items').innerHTML=x.items.map(function(it){return '<li>'+it+'</li>';}).join("");
    var ex=P.querySelector('.m-explore');ex.href=x.svc;ex.textContent='Explore '+x.svl;
    M360.querySelector('.m-hub-3').textContent=x.s;
    ['.m-seg','.m-edge','.m-dots','.m-lab'].forEach(function(sl){M360.querySelectorAll(sl).forEach(function(e){e.classList.toggle('on',+e.getAttribute('data-i')===i);});});
    M360.querySelectorAll('.m-stage-arc').forEach(function(e){e.classList.toggle('on',+e.getAttribute('data-st')===x.st);});
  }
  M360.querySelectorAll('.m-seg,.m-edge,.m-dots,.m-lab').forEach(function(el){var i=+el.getAttribute('data-i');el.addEventListener('mouseenter',function(){sel(i);});el.addEventListener('click',function(){sel(i);});});
  sel(0);
}
doc.classList.remove('no-js');
requestAnimationFrame(loop);
})();
