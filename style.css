:root {
  --navy: #071a2b;
  --navy-2: #0d2940;
  --blue: #22a7f0;
  --cyan: #66d9ff;
  --ink: #102a43;
  --muted: #5f7285;
  --paper: #f4f8fb;
  --white: #ffffff;
  --line: #d8e3ec;
  --shadow: 0 18px 45px rgba(7, 26, 43, 0.10);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; color: var(--ink); background: var(--paper); font-family: Inter, "Segoe UI", Arial, sans-serif; line-height: 1.65; }
a { color: inherit; }

.site-header { position: sticky; top: 0; z-index: 1000; background: rgba(7, 26, 43, 0.94); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.10); }
.navbar { max-width: 1180px; height: 76px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 12px; color: var(--white); font-weight: 800; text-decoration: none; letter-spacing: .2px; }
.brand-mark { width: 38px; height: 38px; display: grid; place-items: center; color: var(--navy); background: linear-gradient(135deg, var(--cyan), var(--blue)); border-radius: 9px; font-size: 14px; box-shadow: 0 0 24px rgba(34,167,240,.30); }
.nav-links { display: flex; align-items: center; gap: 8px; }
.nav-links a { position: relative; padding: 11px 15px; color: #c8d5df; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; transition: .2s ease; }
.nav-links a:hover { color: var(--white); background: rgba(255,255,255,.07); }
.nav-links a.active { color: var(--white); background: rgba(34,167,240,.16); }
.nav-links a.active::after { content: ""; position: absolute; left: 14px; right: 14px; bottom: 5px; height: 2px; background: var(--cyan); border-radius: 3px; }
.menu-toggle { display: none; padding: 8px; background: transparent; border: 0; cursor: pointer; }
.menu-toggle span { display: block; width: 25px; height: 2px; margin: 5px; background: white; transition: .2s ease; }

.section-shell { max-width: 1180px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
.hero { min-height: calc(100vh - 76px); display: grid; grid-template-columns: 1.25fr .75fr; align-items: center; gap: 72px; padding-top: 80px; padding-bottom: 80px; }
.hero h1, .page-hero h1 { max-width: 880px; margin: 0 0 24px; color: var(--navy); font-size: clamp(44px, 6vw, 78px); line-height: 1.02; letter-spacing: -3px; }
.hero-text, .page-hero > p:not(.eyebrow) { max-width: 760px; color: var(--muted); font-size: 19px; }
.eyebrow { margin: 0 0 14px; color: #0879b7; font-size: 12px; font-weight: 900; letter-spacing: 2.1px; }
.button-group { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-height: 48px; padding: 11px 20px; border: 2px solid var(--blue); border-radius: 9px; font-weight: 800; text-decoration: none; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
.button:hover { transform: translateY(-2px); }
.button-primary { color: white; background: var(--blue); box-shadow: 0 10px 26px rgba(34,167,240,.25); }
.button-primary:hover { background: #148fd0; }
.button-secondary { color: var(--ink); background: transparent; border-color: #aabcca; }
.button-secondary:hover { background: white; box-shadow: var(--shadow); }

.hero-panel { position: relative; min-height: 430px; padding: 48px 38px; overflow: hidden; color: white; background: linear-gradient(145deg, var(--navy), var(--navy-2)); border-radius: 22px; box-shadow: 0 30px 70px rgba(7,26,43,.28); }
.blueprint-grid { position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(rgba(102,217,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(102,217,255,.7) 1px, transparent 1px); background-size: 28px 28px; }
.panel-label, .metric { position: relative; }
.panel-label { color: var(--cyan); font-size: 12px; font-weight: 900; letter-spacing: 2px; }
.metric { display: grid; grid-template-columns: 80px 1fr; align-items: center; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,.13); }
.metric strong { color: var(--cyan); font-size: 28px; }.metric span { color: #cfdae3; }

.section-block { padding-top: 72px; padding-bottom: 72px; }
.section-heading { max-width: 730px; margin-bottom: 34px; }
.section-heading h2, .page-hero h1 { margin-top: 0; }
.section-heading h2 { margin-bottom: 0; font-size: clamp(32px, 5vw, 52px); line-height: 1.1; letter-spacing: -1.7px; }
.card-grid, .project-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
.card, .project-card, .resume-card, .contact-card, .notice { background: white; border: 1px solid var(--line); border-radius: 15px; box-shadow: 0 8px 30px rgba(7,26,43,.05); }
.card { position: relative; padding: 34px; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.card:hover { transform: translateY(-5px); border-color: #9bdcff; box-shadow: var(--shadow); }
.card-number { color: var(--blue); font-size: 12px; font-weight: 900; letter-spacing: 1px; }
.card h3 { margin: 28px 0 10px; font-size: 23px; }.card p { margin: 0; color: var(--muted); }
.skill-list { display: flex; flex-wrap: wrap; gap: 12px; }
.skill-list span, .stacked-skills span { padding: 10px 15px; color: #164566; background: #e7f5fd; border: 1px solid #c6e9fb; border-radius: 999px; font-size: 13px; font-weight: 800; }

.page-hero { padding-top: 110px; padding-bottom: 70px; }.page-hero h1 { font-size: clamp(48px, 7vw, 76px); }
.project-grid { max-width: 1180px; margin: 0 auto; padding-bottom: 70px; }
.project-card { padding: 34px; }
.project-top { display: flex; justify-content: space-between; color: #0879b7; font-size: 12px; font-weight: 900; letter-spacing: 1.5px; }
.project-card h2 { margin: 36px 0 14px; font-size: 28px; line-height: 1.15; }.project-card p { color: var(--muted); }.project-card li { margin-bottom: 9px; }
.notice { margin-bottom: 80px; padding: 26px 30px; border-left: 5px solid var(--blue); }.notice p { margin: 5px 0 0; color: var(--muted); }

.resume-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; padding-bottom: 80px; }.resume-main { display: grid; gap: 24px; }.resume-card { padding: 34px; }.resume-card h2 { margin-top: 0; }.resume-card p { color: var(--muted); }.resume-list { padding-left: 20px; }.resume-list li { margin-bottom: 12px; }.stacked-skills { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.contact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; padding-bottom: 100px; }.contact-card { padding: 38px; }.contact-icon { width: 52px; height: 52px; margin-bottom: 28px; display: grid; place-items: center; color: white; background: var(--navy); border-radius: 12px; font-weight: 900; }.contact-card h2 { margin: 0 0 12px; }.contact-card p:not(.eyebrow) { color: var(--muted); }.text-link { color: #0879b7; font-weight: 900; text-decoration: none; }.text-link:hover { text-decoration: underline; }

footer { color: #c8d5df; background: var(--navy); }.footer-inner { max-width: 1180px; margin: 0 auto; padding: 28px 24px; display: flex; justify-content: space-between; gap: 20px; }.footer-inner p { margin: 0; }.footer-inner a { color: var(--cyan); font-weight: 800; text-decoration: none; }
.reveal { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }.reveal.visible { opacity: 1; transform: none; }

@media (max-width: 820px) {
  .menu-toggle { display: block; }
  .nav-links { position: absolute; top: 76px; left: 16px; right: 16px; padding: 14px; display: none; flex-direction: column; align-items: stretch; background: var(--navy-2); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; box-shadow: var(--shadow); }
  .nav-links.open { display: flex; }.nav-links a { padding: 13px 15px; }
  .hero { grid-template-columns: 1fr; min-height: auto; gap: 40px; }.hero-panel { min-height: 350px; }
  .card-grid, .project-grid, .contact-grid, .resume-layout { grid-template-columns: 1fr; }
  .resume-side { order: -1; }.stacked-skills { flex-direction: row; flex-wrap: wrap; }
}
@media (max-width: 520px) {
  .navbar { height: 68px; }.brand span:last-child { display: none; }.nav-links { top: 68px; }
  .hero, .page-hero { padding-top: 64px; }.hero h1, .page-hero h1 { letter-spacing: -1.8px; }
  .card, .project-card, .resume-card, .contact-card { padding: 26px; }.footer-inner { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .reveal { opacity: 1; transform: none; transition: none; } .button, .card { transition: none; } }
