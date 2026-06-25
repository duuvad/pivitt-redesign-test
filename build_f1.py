#!/usr/bin/env python3
# F1 Drive: native crisp diagrams replace the low-res text-on-top deck spreads;
# poster concepts shown as a small scrolling carousel; real mockups contained.
import re
base = open("work-mini-horizon.html", encoding="utf-8").read()
MAIN = '<main class="page">'
TOP = base[:base.index(MAIN)+len(MAIN)]
TOP = TOP.replace("<title>MINI, Change is on the Horizon &middot; Pivitt</title>",
                  "<title>F1 Drive &middot; Pivitt</title>")
TOP = TOP.replace('id="spineLabel">MINI<', 'id="spineLabel">F1 Drive<')

F1 = '''
.f1band{max-width:820px;margin:clamp(24px,3vw,42px) auto 0;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:#0b0b12}
.f1band img{width:100%;height:auto;display:block}
.f1grid2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,26px);max-width:820px;margin:clamp(24px,3vw,42px) auto 0}
.f1grid2 figure{margin:0}
.f1grid2 img{width:100%;height:auto;display:block;border:1px solid var(--bdr);border-radius:10px;background:#0b0b12}
@media(max-width:760px){.f1grid2{grid-template-columns:1fr}}
.f1cap{max-width:1040px;margin:9px auto 0;color:var(--t3);font-size:13px;line-height:1.4}
.f1wide{max-width:1040px;margin:clamp(24px,3vw,42px) auto 0;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:#0b0b12}
.f1wide img{width:100%;height:auto;display:block}
.f1pair{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,22px);max-width:1040px;margin:clamp(24px,3vw,42px) auto 0}
.f1pair figure{margin:0}
.f1pair img{width:100%;height:auto;display:block;border:1px solid var(--bdr);border-radius:10px;background:#0b0b12}
@media(max-width:760px){.f1pair{grid-template-columns:1fr}}
.f1-eyebrow{display:block;margin:12px 0 16px}
/* naming framework */
.f1nm{max-width:900px;margin:clamp(24px,3vw,42px) auto 0;border:1px solid var(--bdr);border-radius:14px;padding:clamp(22px,3vw,38px);background:linear-gradient(180deg,#0b0b12,#08080e)}
.f1nm-head{display:flex;align-items:baseline;gap:8px 16px;flex-wrap:wrap;padding-bottom:22px;border-bottom:1px solid var(--bdr);margin-bottom:26px}
.f1nm-kk{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--t3)}
.f1nm-cc{font-size:clamp(28px,3.4vw,42px);font-weight:300;letter-spacing:-.02em;color:#fff}
.f1nm-cols{display:grid;grid-template-columns:repeat(3,1fr)}
.f1nm-col{padding:0 22px;border-left:1px solid var(--bdr)}
.f1nm-col:first-child{padding-left:0;border-left:none}
.f1nm-tag{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ac);margin-bottom:12px}
.f1nm-val{font-size:clamp(15px,1.4vw,19px);font-weight:300;color:#fff;line-height:1.28;margin-bottom:12px}
.f1nm-fn{font-size:13px;color:var(--t3);line-height:1.5}
.f1nm-eg{margin-top:26px;padding-top:20px;border-top:1px solid var(--bdr);font-size:14px;color:var(--t2);line-height:1.55}
.f1nm-eg b{color:#fff;font-weight:300}
.f1nm-eg span{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--t3);margin-right:12px}
@media(max-width:680px){.f1nm-cols{grid-template-columns:1fr}.f1nm-col{padding:18px 0 0;border-left:none;border-top:1px solid var(--bdr);margin-top:18px}.f1nm-col:first-child{margin-top:0;border-top:none;padding-top:0}}
/* timeline */
.f1tl{max-width:900px;margin:clamp(22px,2.6vw,34px) auto 0;border:1px solid var(--bdr);border-radius:14px;padding:clamp(24px,3vw,40px);background:linear-gradient(180deg,#0b0b12,#08080e)}
.f1tl-track{display:flex;gap:34px}
.f1tl-node{flex:1;display:flex;flex-direction:column;align-items:center;gap:14px;position:relative}
.f1tl-node:not(:last-child)::after{content:'';position:absolute;right:-22px;top:38px;width:20px;border-top:1px dashed var(--t3);opacity:.5}
.f1tl-box{width:100%;min-height:76px;display:flex;align-items:center;justify-content:center;text-align:center;border:1px solid var(--bdr);border-radius:10px;background:#0b0b12;padding:14px 10px;font-size:13px;font-weight:300;color:var(--t2);line-height:1.4}
.f1tl-box b{color:#fff;font-weight:600;letter-spacing:.03em}
.f1tl-pilot{border-style:dashed;color:var(--t3)}
.f1tl-y{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--blue)}
.f1tl-note{margin-top:24px;font-size:13px;color:var(--t3);line-height:1.55;text-align:center;max-width:60ch;margin-left:auto;margin-right:auto}
@media(max-width:680px){.f1tl-track{flex-wrap:wrap;gap:16px}.f1tl-node{flex:0 0 calc(50% - 8px)}.f1tl-node::after{display:none}}
/* alternatives */
.f1alt{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:900px;margin:clamp(20px,2.4vw,32px) auto 0}
.f1alt-c{border:1px solid var(--bdr);border-radius:12px;padding:20px;background:#0b0b12}
.f1alt-n{font-size:15px;font-weight:300;color:#fff;margin-bottom:7px;line-height:1.25}
.f1alt-s{font-size:13px;color:var(--t3);line-height:1.45;margin-bottom:14px}
.f1alt-a{font-size:11px;font-weight:600;letter-spacing:.16em;color:var(--blue)}
@media(max-width:680px){.f1alt{grid-template-columns:1fr}}
/* concept carousel */
.f1-carousel{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x proximity;padding:4px 4px 16px;margin:clamp(24px,3vw,42px) 0 0;-webkit-overflow-scrolling:touch}
.f1-carousel::-webkit-scrollbar{height:6px}.f1-carousel::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:6px}
.f1-carousel img{flex:0 0 auto;width:clamp(150px,19vw,196px);aspect-ratio:1240/1754;object-fit:cover;border:1px solid var(--bdr);border-radius:8px;background:#000;scroll-snap-align:start}
'''
TOP = TOP.replace("</style>", F1 + "</style>", 1)

CTA = '  <section class="cta section-pad" data-spine="Start">'
BOTTOM = base[base.index(CTA):]

def band(img, alt, cap=None):
    c = f'\n    <div class="f1cap">{cap}</div>' if cap else ''
    return f'<div class="f1band reveal"><img loading="lazy" src="images/f1/page/{img}" alt="{alt}"/></div>{c}'

concepts = "".join(f'<img loading="lazy" src="images/f1/concepts/c-{i}.jpg" alt="F1 Drive poster concept {i}"/>' for i in range(1,12))

MIDDLE = f'''  <section class="phero section-pad" data-spine="F1 Drive">
    <div class="crumb"><a href="index.html">Pivitt</a> / <a href="work.html">Work</a> / F1 Drive</div>
    <span class="eyebrow f1-eyebrow">Naming &amp; visual identity &middot; Events</span>
    <h1>F1 Drive</h1>
    <p class="lead">A charity karting Grand Prix for the music industry at F1 Drive London, bringing together Tottenham Hotspur and Live Nation in support of Nordoff and Robbins. We created the naming system and the visual identity, from the event name to the campaign that ran across the city.</p>
  </section>

  <section class="section-pad"><div class="f1wide reveal"><img loading="lazy" src="images/f1/page/poster-helmet.jpg" alt="The inaugural F1 Drive Music Therapy Grand Prix poster"/></div><div class="f1cap">The campaign key art.</div></section>

  <section class="section-pad"><div class="statband reveal">
    <div class="stat"><div class="num">12</div><div class="lab">Powerhouse teams from the music industry on the grid.</div></div>
    <div class="stat"><div class="num">4</div><div class="lab">Members to a team, racing for the podium.</div></div>
    <div class="stat"><div class="num">&pound;5,000</div><div class="lab">Per team, with all proceeds to Nordoff and Robbins.</div></div>
    <div class="stat"><div class="num">6</div><div class="lab">Hours of racing and afterparty, from two until eight.</div></div>
  </div></section>

  <section class="section-pad cs-chapter">
    <div class="cs-sec reveal" style="margin-top:0"><h3>The brief</h3><h4>Name and dress a charity Grand Prix.</h4></div>
    <div class="ch-intro reveal"><p>F1 Drive London was hosting its first charity karting Grand Prix, a music-industry event in support of Nordoff and Robbins, the UK&rsquo;s largest music therapy charity, in partnership with Tottenham Hotspur and Live Nation. It needed a name that could carry the occasion and grow into a series, and a visual identity strong enough to fill a billboard and sell out the grid.</p></div>
  </section>

  <section class="section-pad cs-chapter">
    <div class="cs-sec reveal"><h3>The name</h3><h4>An F1 naming system, built to scale.</h4></div>
    <div class="ch-intro reveal"><p>We started from Formula 1&rsquo;s own naming logic, a location and a Grand Prix, and turned it into a three-part system: a constant, a partner-led event name, and a year. It gave the inaugural race a name of its own and the organisers a structure that could return and grow, season after season.</p></div>
    <div class="f1nm reveal">
      <div class="f1nm-head"><span class="f1nm-kk">The constant</span><span class="f1nm-cc">F1 Drive</span></div>
      <div class="f1nm-cols">
        <div class="f1nm-col" style="--ac:var(--blue)"><span class="f1nm-tag">Core</span><div class="f1nm-val">Music Therapy Grand Prix</div><p class="f1nm-fn">Brand and event identification. The event name, interchangeable season to season.</p></div>
        <div class="f1nm-col" style="--ac:#06B6D4"><span class="f1nm-tag">Extended</span><div class="f1nm-val">The Tottenham&ndash;Live Nation Charity Circuit</div><p class="f1nm-fn">Partnership identification. Credits the partners behind the circuit.</p></div>
        <div class="f1nm-col" style="--ac:#EC4899"><span class="f1nm-tag">Scaled</span><div class="f1nm-val">2025</div><p class="f1nm-fn">A timestamp, for a returning, yearly championship.</p></div>
      </div>
      <div class="f1nm-eg"><span>Assembled</span><b>F1 Drive Music Therapy Grand Prix &middot; The Tottenham&ndash;Live Nation Charity Circuit &middot; 2025</b></div>
    </div>

    <div class="cs-sec reveal"><h4 style="margin-top:0">Built to return, year on year.</h4></div>
    <div class="ch-intro reveal"><p>The structure was designed to scale from a one-off pilot into a named, dated championship, with each season building on the last.</p></div>
    <div class="f1tl reveal">
      <div class="f1tl-track">
        <div class="f1tl-node"><div class="f1tl-box f1tl-pilot">Pilot</div><span class="f1tl-y">Year 1</span></div>
        <div class="f1tl-node"><div class="f1tl-box">Music Therapy<br>Grand Prix <b>2025</b></div><span class="f1tl-y">Year 2</span></div>
        <div class="f1tl-node"><div class="f1tl-box"><b>2026</b></div><span class="f1tl-y">Year 3</span></div>
        <div class="f1tl-node"><div class="f1tl-box"><b>2027</b></div><span class="f1tl-y">Year 4</span></div>
      </div>
      <p class="f1tl-note">Each return carries marketing around previous winners and the incentive to come back, turning a single event into a fixture.</p>
    </div>

    <div class="cs-sec reveal"><h4 style="margin-top:0">Alternatives, same structure.</h4></div>
    <div class="ch-intro reveal"><p>A set of alternatives kept the system intact while shifting the tone, from a Grand Prix to a Grandstand to a Championship.</p></div>
    <div class="f1alt reveal">
      <div class="f1alt-c"><div class="f1alt-n">F1 Drive Tempo Grand Prix</div><div class="f1alt-s">The Tottenham&ndash;Live Nation Charity Cup</div><span class="f1alt-a">F1DTGP</span></div>
      <div class="f1alt-c"><div class="f1alt-n">F1 Drive Charity Grandstand</div><div class="f1alt-s">The Tottenham&ndash;Live Nation Circuit</div><span class="f1alt-a">F1DCG</span></div>
      <div class="f1alt-c"><div class="f1alt-n">F1 Drive Championship</div><div class="f1alt-s">The Live Nation &amp; Tottenham Charity Circuit</div><span class="f1alt-a">F1DCC</span></div>
    </div>
  </section>

  <section class="section-pad cs-chapter">
    <div class="cs-sec reveal"><h3>The look</h3><h4>From retro homage to a bolder direction.</h4></div>
    <div class="ch-intro reveal"><p>The first direction was a retro one, a vintage Grand Prix poster reworked for a modern karting event. We explored it widely, in classic illustration, event-information layouts and a London edition, before refining into a bolder, more photographic campaign.</p></div>
    <div class="f1-carousel reveal">{concepts}</div>
    <div class="mg-hint">Scroll through the concepts.</div>

    <div class="cs-sec reveal"><h4 style="margin-top:0">The refined direction.</h4></div>
    <div class="ch-intro reveal"><p>The campaign that ran led with the driver, the helmet and the neon of the grid, carried into a flexible set of colourways for every placement.</p></div>
    <div class="f1wide reveal"><img loading="lazy" src="images/f1/page/invite.jpg" alt="F1 Drive Music Therapy Grand Prix invite"/></div>
    <div class="f1cap">The invite.</div>
    <div class="f1wide reveal"><img loading="lazy" src="images/f1/page/colourways.jpg" alt="Four colourways of the invite"/></div>
    <div class="f1cap">Four colourways for every placement.</div>
  </section>

  <section class="section-pad cs-chapter">
    <div class="cs-sec reveal"><h3>In the world</h3><h4>Across the city, on the day.</h4></div>
    <div class="ch-intro reveal"><p>The identity rolled out across outdoor sites in the run-up to race day, from digital billboards to bus-stop posters.</p></div>
    {f'''<div class="f1pair reveal">
      <figure><img loading="lazy" src="images/f1/page/board.jpg" alt="F1 Drive Music Therapy Grand Prix on a digital billboard"/></figure>
      <figure><img loading="lazy" src="images/f1/page/busstop.jpg" alt="Bus-stop poster mockup"/></figure>
    </div>'''}
    <div class="f1cap">Digital billboard and bus-stop posters, across the city.</div>
  </section>

  <section class="section-pad cs-chapter">
    <div class="cs-sec reveal"><h3>The outcome</h3><h4>A one-off with a series in its DNA.</h4></div>
    <div class="ch-intro reveal"><p>F1 Drive went into its first charity Grand Prix with a name that works like a Formula 1 title and a campaign that earned its place on a billboard. The system was built so that the next race, and the one after, already have somewhere to go.</p></div>
  </section>

  <section class="section-pad pt"><div class="cs-next"><span class="eyebrow" style="color:var(--t3)">Next</span><a href="work-fpc.html" data-cursor="View">Future Planet Capital <span>&rarr;</span></a></div></section>
'''

out = TOP + "\n" + MIDDLE + BOTTOM
open("work-f1.html","w",encoding="utf-8").write(out)

banned=["ecosystem","elevate","holistic","leverage","seamless","robust","bespoke","synergy","unlock","empower","transformative","journey","genuinely","straightforward","honestly","curated","talent"]
low=MIDDLE.lower()
print("Banned:", [b for b in banned if re.search(r"\b"+b+r"\b", low)] or "none")
print("Em dashes:", MIDDLE.count("\u2014"), "| Bytes:", len(out))
