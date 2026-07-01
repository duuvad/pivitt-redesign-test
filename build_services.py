#!/usr/bin/env python3
"""Regenerate the four service pages to the immersive standard.
All media references are real delivered assets already in the repo."""
import re

# Shared shell: lift nav + mobile menu + footer verbatim from the BOP page so
# every page stays in lockstep with the sitewide rename.
bop = open("brand-operating-partner.html").read()
NAV = bop[bop.index('<div class="grain"'):bop.index('<main class="page">')]
FOOT = bop[bop.index("</main>"):bop.index('<script src="assets/site.js')] 

CSS = """
<style>
/* Immersive service page layer */
.sv-hero{position:relative;min-height:92vh;display:flex;align-items:flex-end;overflow:hidden;padding-bottom:clamp(48px,7vh,96px)}
.sv-hero video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.sv-hero .veil{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(7,7,11,.62) 0%,rgba(7,7,11,.18) 42%,rgba(7,7,11,.88) 100%)}
.sv-hero .inner{position:relative;z-index:2}
.sv-hero .crumb{margin-bottom:18px}
.sv-hero h1{max-width:14ch}
.sv-hero .lead{max-width:52ch}
.sv-credit{margin-top:clamp(18px,2vw,28px);font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--t3)}
.sv-credit b{font-weight:600;color:var(--t2)}

.sv-parallax{position:relative;height:clamp(320px,64vh,640px);overflow:hidden;margin:clamp(40px,5vw,80px) 0}
.sv-parallax img{position:absolute;left:0;top:-12%;width:100%;height:124%;object-fit:cover;will-change:transform}
.sv-parallax .cap{position:absolute;left:var(--pad);bottom:clamp(18px,2.4vw,34px);z-index:2;font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.75);background:rgba(7,7,11,.45);backdrop-filter:blur(6px);padding:9px 14px;border-radius:100px}
.sv-parallax::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,7,11,.28),transparent 30%,transparent 72%,rgba(7,7,11,.5))}

.sv-cluster{display:grid;grid-template-columns:1.35fr 1fr;grid-auto-rows:clamp(160px,24vw,340px);gap:clamp(12px,1.2vw,20px)}
.sv-cluster figure{position:relative;margin:0;overflow:hidden;border-radius:16px;border:1px solid var(--bdr)}
.sv-cluster figure.tall{grid-row:span 2}
.sv-cluster img,.sv-cluster video{width:100%;height:100%;object-fit:cover;transition:transform 1.1s var(--ease);will-change:transform}
.sv-cluster figure:hover img,.sv-cluster figure:hover video{transform:scale(1.045)}
.sv-cluster figcaption{position:absolute;left:16px;bottom:14px;z-index:2;font-size:10.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.85);background:rgba(7,7,11,.5);backdrop-filter:blur(6px);padding:8px 12px;border-radius:100px}
.sv-cluster figure::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(7,7,11,.55))}
@media(max-width:760px){.sv-cluster{grid-template-columns:1fr}.sv-cluster figure.tall{grid-row:auto}}

.sv-reels{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,1.2vw,20px)}
.sv-reel{position:relative;border-radius:16px;overflow:hidden;border:1px solid var(--bdr);aspect-ratio:9/12}
.sv-reel video{width:100%;height:100%;object-fit:cover}
.sv-reel span{position:absolute;left:14px;bottom:12px;font-size:10.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.85);background:rgba(7,7,11,.5);backdrop-filter:blur(6px);padding:8px 12px;border-radius:100px}
@media(max-width:760px){.sv-reels{grid-template-columns:1fr}}

@media(prefers-reduced-motion:reduce){
  .sv-parallax img{top:0;height:100%}
  .sv-cluster figure:hover img,.sv-cluster figure:hover video{transform:none}
}
</style>
"""

JS = """
<script src="assets/site.js?v=34"></script>
<script>
(function(){
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Parallax */
  if(!rm){document.querySelectorAll('.sv-parallax img').forEach(function(img){
    var wrap=img.parentElement;
    function move(){var r=wrap.getBoundingClientRect(),vh=innerHeight;
      if(r.bottom<0||r.top>vh)return;
      var p=(r.top+r.height/2-vh/2)/vh; img.style.transform='translateY('+(p*9)+'%)';}
    addEventListener('scroll',move,{passive:true});move();
  });}
  /* Play videos only in view */
  if('IntersectionObserver' in window){
    var vio=new IntersectionObserver(function(es){es.forEach(function(e){
      var v=e.target; if(e.isIntersecting){v.play&&v.play().catch(function(){});}else{v.pause&&v.pause();}
    });},{threshold:.2});
    document.querySelectorAll('video[data-io]').forEach(function(v){vio.observe(v);});
  }
})();
</script>
"""

def vid(src, poster, cls="", extra=""):
    webm = ""
    if src.endswith(".mp4"):
        alt = src[:-4]+".webm"
        import os
        if os.path.exists(alt):
            webm = f'<source src="{alt}" type="video/webm"/>'
    return (f'<video {cls} autoplay muted loop playsinline preload="metadata" '
            f'poster="{poster}" data-io {extra}>{webm}<source src="{src}" type="video/mp4"/></video>')

def scope_cards(items):
    out = []
    for i,(h,p) in enumerate(items,1):
        out.append(f'<div class="fcard"><span class="fn">0{i}</span><h4>{h}</h4><p>{p}</p></div>')
    return '<div class="fgrid reveal">'+''.join(out)+'</div>'

def steps(items):
    out=[]
    for i,(h,p) in enumerate(items,1):
        out.append(f'<div class="step"><span class="sn">0{i}</span><h4>{h}</h4><p>{p}</p></div>')
    return '<div class="steps reveal">'+''.join(out)+'</div>'

def cluster(figs):
    out=[]
    for f in figs:
        tall = ' class="tall"' if f.get("tall") else ""
        if f.get("video"):
            media = vid(f["video"], f.get("poster",""))
        else:
            media = f'<img src="{f["img"]}" alt="{f["cap"]}" loading="lazy"/>'
        out.append(f'<figure{tall}>{media}<figcaption>{f["cap"]}</figcaption></figure>')
    return '<div class="sv-cluster reveal">'+''.join(out)+'</div>'

def tiles(ts):
    out=[]
    for name,href,img in ts:
        out.append(f'<a class="rtile" href="{href}"><div class="rt-img"><img src="{img}" alt="{name}" loading="lazy"/></div><div class="rt-meta"><b>{name}</b><span>Case study</span></div></a>')
    return '<div class="rwork reveal">'+''.join(out)+'</div>'

PAGES = {
"brand-strategy-positioning.html": dict(
  title="Brand Strategy &amp; Positioning London &middot; Pivitt",
  desc="Strategic brand positioning for established UK businesses. Market analysis, competitive positioning, messaging architecture, audience strategy.",
  spine="Brand strategy &amp; positioning", crumb="Brand strategy &amp; positioning",
  h1="Find the position only you can own.",
  lead="Most positioning is a compromise between what you do and what the market already believes. We find the claim you can prove and competitors cannot follow, then build the argument that carries it.",
  hero_video="videos/fpc/hero.mp4", hero_poster="images/fpc/tile.jpg",
  credit="From the work &middot; <b>Future Planet Capital</b>",
  statement='Most brands compete on noise. The few that win own a position the market hands to <span class="accent">no one else</span>.',
  scope=[("Market and category mapping","Where demand actually sits, and where competitors cluster."),
         ("Competitive positioning","The space you can own, and the reason it holds."),
         ("Value proposition","The argument for why you win, sharpened to a line."),
         ("Messaging architecture","One story, told the right way for each audience."),
         ("Audience strategy","Who you are for, and how they really decide."),
         ("Positioning statement","The promise every other decision answers to.")],
  parallax=("images/oxbow/hero.jpg","OxBow &middot; Positioning made physical"),
  cluster_head=("The artefacts","Strategy you can hold"),
  cluster=[dict(img="images/cquest/d1-cover.jpg",cap="C-Quest &middot; Direction one",tall=True),
           dict(img="images/cquest/d2-cover.jpg",cap="C-Quest &middot; Direction two"),
           dict(img="images/oxbow/sys-table.jpg",cap="OxBow &middot; The system, mapped"),
           dict(img="images/oxbow/dir-blue.jpg",cap="OxBow &middot; Route explored"),
           dict(img="images/oxbow/dir-green.jpg",cap="OxBow &middot; Route explored")],
  approach=[("Diagnose","We score the brand against the business and find where the two have drifted apart."),
            ("Define","We set the position, the proposition and the criteria every decision answers to."),
            ("Align","We hand every team the same story, so the market reads you the way you intend.")],
  proof="Positioning work behind a startup investment scaled to over &pound;40M in revenue.",
  tiles=[("Future Planet Capital","work-fpc.html","images/fpc/tile.jpg"),
         ("OxBow","work-oxbow.html","images/oxbow/tile.jpg"),
         ("C-Quest","work-cq.html","c-quest.jpg")]),

"brand-identity-design.html": dict(
  title="Brand Identity &amp; Design London &middot; Pivitt",
  desc="Complete brand identity systems for UK businesses. Visual identity, brand guidelines, verbal identity and design systems. London consultancy.",
  spine="Brand identity &amp; design", crumb="Brand identity &amp; design",
  h1="Identity that proves the thinking.",
  lead="A complete visual and verbal system, built from the strategy and documented so it holds in any hands, at any scale, on any surface the brand touches.",
  hero_video="videos/taya.mp4", hero_poster="taya-billboard.jpg",
  credit="From the work &middot; <b>Taya</b>",
  statement='Identity is not decoration. It is the evidence that the thinking underneath is <span class="accent">sound</span>.',
  scope=[("Logo and mark system","A primary identity and the variations that keep it consistent."),
         ("Typography","A type system that carries voice as much as legibility."),
         ("Colour","A palette with rules, not just swatches."),
         ("Art direction","The photographic and graphic language of the brand."),
         ("Iconography and elements","The supporting kit that holds everything together."),
         ("Design guidelines","The system written down, so anyone can apply it.")],
  parallax=("images/cquest/cards.jpg","C-Quest &middot; The system in the hand"),
  cluster_head=("The craft","How a system is built"),
  cluster=[dict(img="images/cquest/d1-logo.jpg",cap="C-Quest &middot; Mark construction",tall=True),
           dict(img="images/cquest/d1-type.jpg",cap="C-Quest &middot; Type system"),
           dict(img="images/cquest/d1-colour.jpg",cap="C-Quest &middot; Colour rules"),
           dict(img="images/hyperloop/hlr-cards.jpg",cap="Hyperloop &middot; Identity in hand"),
           dict(img="images/hyperloop/hlr-apparel.jpg",cap="Hyperloop &middot; System on surface")],
  approach=[("Foundations","We translate the strategy into the core marks, type and colour."),
            ("Expression","We build the wider system across every surface the brand lives on."),
            ("System","We document it so the identity holds at scale, in any hands.")],
  proof="Identity systems built and run across BMW, MINI and BMW Motorrad: 200,000+ assets over eight years.",
  tiles=[("Taya","work-taya.html","taya-billboard.jpg"),
         ("Hyperloop","work-hyperloop.html","images/hyperloop/hlr-ooh.jpg"),
         ("C-Quest","work-cq.html","c-quest.jpg")]),

"brand-communication-content.html": dict(
  title="Brand Communication &amp; Content London &middot; Pivitt",
  desc="Brand communications, campaign creative, and content strategy for established businesses. Messaging, campaigns, and activation. London-based consultancy.",
  spine="Communication &amp; content", crumb="Communication &amp; content",
  h1="Turn your brand into market demand.",
  lead="Campaign platforms, content systems and sales material that take the position to market and keep it there, week after week, without the message drifting.",
  hero_video="videos/minibao/film.mp4", hero_poster="images/minibao/film-poster.jpg",
  credit="From the work &middot; <b>MINI</b>",
  statement='A brand no one hears does not exist. We turn position into <span class="accent">demand</span>.',
  scope=[("Campaign platforms","Ideas big enough to run for years, not one post."),
         ("Content systems","A repeatable engine, not a one-off burst."),
         ("Editorial direction","A point of view worth following."),
         ("Social and motion","Made for the feed, on brand throughout."),
         ("Sales and pitch material","The brand, working where deals are won."),
         ("Always-on production","Capacity to keep the system fed.")],
  parallax=("images/bmwbao/hero.jpg","BMW &middot; Campaign in market"),
  cluster_head=("In market","Campaigns at work"),
  cluster=[dict(img="images/minibao/header-amber.jpg",cap="MINI &middot; Campaign platform",tall=True),
           dict(img="images/minibao/header-navy.jpg",cap="MINI &middot; Platform flexed"),
           dict(img="images/bmwbao/header1.jpg",cap="BMW &middot; Campaign rollout"),
           dict(img="images/minibao/por1.jpg",cap="MINI &middot; Portrait format"),
           dict(img="images/cquest/env-billboard.jpg",cap="C-Quest &middot; Out of home")],
  approach=[("Plan","We set the platform and the calendar against commercial goals."),
            ("Produce","We make the work, on brand and at pace."),
            ("Compound","We measure, learn and let the system build on itself.")],
  proof="A content and conversion rebuild that grew conversion by 1,100% for Universal Music Group.",
  tiles=[("MINI","work-mini-bao.html","images/minibao/tile.jpg"),
         ("Melbury Place","work-mel.html","melbury-place.jpg"),
         ("Taya","work-taya.html","taya-billboard.jpg")]),

"digital-brand-experience.html": dict(
  title="Digital Brand Experience London &middot; Pivitt",
  desc="Digital brand experiences, website design and digital transformation for UK businesses. UX strategy, web design and digital touchpoints.",
  spine="Digital brand experience", crumb="Digital brand experience",
  h1="Where most buyers decide.",
  lead="Your website carries more of the sale than any person in the business. We design and build digital experiences that hold the brand at full strength and move the right buyers to act.",
  hero_video="videos/mybmw/hero.mp4", hero_poster="images/mybmw/app-hero.jpg",
  credit="From the work &middot; <b>My BMW</b>",
  statement='Your website is where most buyers decide. It should carry the brand, not <span class="accent">dilute it</span>.',
  scope=[("Web design and build","A site that looks and performs like the brand."),
         ("Brand-led UX","Flows shaped by the strategy, not a template."),
         ("Conversion architecture","Pages built to move the right people to act."),
         ("Motion and interaction","Detail that signals quality on contact."),
         ("Performance and SEO","Fast, found, and built to last."),
         ("Analytics and tracking","So you can see what the brand is doing.")],
  parallax=("images/cquest/d1-web.jpg","C-Quest &middot; The brand, online"),
  cluster_head=("On screen","The experience layer"),
  reels=[("videos/mybmw/feat/status.mp4","My BMW &middot; Status"),
         ("videos/mybmw/feat/charge.mp4","My BMW &middot; Charging"),
         ("videos/mybmw/feat/nav.mp4","My BMW &middot; Navigation")],
  cluster=[dict(img="images/cquest/d1-web.jpg",cap="C-Quest &middot; Site system",tall=True),
           dict(img="images/cquest/d2-web.jpg",cap="C-Quest &middot; Direction explored"),
           dict(img="images/mybmw/carbon-detail.jpg",cap="My BMW &middot; Interface detail"),
           dict(img="images/mybmw/app-hero.jpg",cap="My BMW &middot; The app"),
           dict(img="images/fpc/tile.jpg",cap="Future Planet Capital &middot; Digital estate")],
  approach=[("Architect","We map the structure to how buyers actually move."),
            ("Design","We build the brand into every screen and state."),
            ("Instrument","We wire in tracking so the work keeps paying off.")],
  proof="Digital work delivered for Pansports, the group behind Real Madrid, FC Barcelona and Aston Martin F1.",
  tiles=[("My BMW","work-mybmw.html","images/mybmw/tile.jpg"),
         ("C-Quest","work-cq.html","c-quest.jpg"),
         ("Future Planet Capital","work-fpc.html","images/fpc/tile.jpg")]),
}

CTA = """<section class="cta section-pad" data-spine="Start"><span class="eyebrow reveal">Where it starts</span><h2 class="reveal">Find out what your brand is costing you.</h2>
    <div class="cta-row reveal"><p>Every engagement starts with the Brand Alignment Diagnostic, a fixed first step that scores your brand against the business and shows what to fix first.</p>
    <div class="cta-btns"><a class="btn-primary mag" href="diagnostic.html" data-cursor="Book">Brand Alignment Diagnostic, &pound;1,500</a><a class="btn-ghost mag" href="work.html" data-cursor="View">See the work</a></div></div></section>"""

for fname, P in PAGES.items():
    reels_html = ""
    if P.get("reels"):
        items = "".join(f'<div class="sv-reel">{vid(src, "")}<span>{cap}</span></div>' for src,cap in P["reels"])
        reels_html = f'<section class="section-pad pt"><div class="sh reveal"><span class="eyebrow">In motion</span><span class="n">Product, moving</span></div><div class="sv-reels reveal">{items}</div></section>'

    html = f"""<!DOCTYPE html>
<html lang="en-GB" class="no-js"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
<title>{P['title']}</title><meta name="robots" content="noindex"/>
<meta name="description" content="{P['desc']}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200;300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css?v=34">{CSS}</head><body>
{NAV}<main class="page">

  <section class="phero sv-hero" data-spine="{P['spine']}">
    {vid(P['hero_video'], P['hero_poster'])}
    <div class="veil" aria-hidden="true"></div>
    <div class="inner section-pad" style="padding-top:0;padding-bottom:0">
      <div class="crumb"><a href="index.html">Pivitt</a> / {P['crumb']}</div>
      <h1>{P['h1']}</h1>
      <p class="lead">{P['lead']}</p>
      <div class="sv-credit">{P['credit']}</div>
    </div>
  </section>

  <section class="section-pad pt statement-wrap"><p class="statement reveal">{P['statement']}</p></section>

  <section class="section-pad pt"><div class="sh reveal"><span class="eyebrow">What it covers</span><span class="n">The scope</span></div>{scope_cards(P['scope'])}</section>

  <div class="sv-parallax reveal"><img src="{P['parallax'][0]}" alt="{P['parallax'][1]}"/><span class="cap">{P['parallax'][1]}</span></div>

  <section class="section-pad pt"><div class="sh reveal"><span class="eyebrow">{P['cluster_head'][0]}</span><span class="n">{P['cluster_head'][1]}</span></div>{cluster(P['cluster'])}</section>

  {reels_html}

  <section class="section-pad pt"><div class="sh reveal"><span class="eyebrow">How it works</span><span class="n">The approach</span></div>{steps(P['approach'])}</section>

  <section class="section-pad pt proofline reveal"><span class="pl-lab">Proof</span><p>{P['proof']}</p></section>

  <section class="section-pad pt"><div class="sh reveal"><span class="eyebrow">Selected work</span><span class="n">See it applied</span></div>{tiles(P['tiles'])}</section>

{CTA}
{FOOT}{JS}
</body></html>
"""
    open(fname,"w").write(html)
    print("built", fname, len(html), "bytes")
print("done")
