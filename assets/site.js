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
doc.classList.remove('no-js');
requestAnimationFrame(loop);
})();
