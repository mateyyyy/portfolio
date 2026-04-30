const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');
let css = fs.readFileSync('src/index.css', 'utf8');

// ── 1. Replace all story-related components in App.jsx ────────────────────────
// Find and replace from StoryVerticalCarousel onwards to just before LiveClock

const vcStart = app.indexOf('// ─── STORY VERTICAL CAROUSEL ─────────────────────────────────────────────────');
const lcStart = app.indexOf('// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────');

const newStoryComponents = `// ─── PROJECT GALLERY ───────────────────────────────────────────────────────────
// Full-screen project gallery overlay, triggered by "Ver historia"
// All projects from storyTimeline displayed as scrollable cards
// Navigation: arrow keys, click arrows, escape to close

function ProjectGallery({ active, onClose }) {
  const projects = storyTimeline;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1); // 1=next, -1=prev
  const [animating, setAnimating] = useState(false);
  const total = projects.length;

  const go = (next, direction) => {
    if (animating) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 420);
  };

  const goNext = () => go((current + 1) % total, 1);
  const goPrev = () => go((current - 1 + total) % total, -1);

  // Reset on open
  useEffect(() => {
    if (active) { setCurrent(0); setAnimating(false); }
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, current, animating]);

  if (!active) return null;

  const p = projects[current];
  const mediaList = Array.isArray(p.images) && p.images.length ? p.images : [p.image];
  const bgSrc = resolveStoryAsset(mediaList[0]);
  const isVideo = p.isVideo || (typeof mediaList[0] === 'string' && mediaList[0].endsWith('.mp4'));

  return (
    <div className="pgal-overlay" onClick={onClose}>

      {/* Background image/video — blurred */}
      <div className="pgal-bg" key={current}>
        {isVideo ? (
          <video src={bgSrc} muted autoPlay loop playsInline className="pgal-bg-media" />
        ) : (
          <img src={bgSrc} alt="" className="pgal-bg-media" />
        )}
      </div>
      <div className="pgal-bg-gradient" />

      {/* Content card */}
      <div
        className={\`pgal-card \${animating ? (dir > 0 ? 'pgal-exit-left' : 'pgal-exit-right') : 'pgal-enter'}\`}
        onClick={e => e.stopPropagation()}
      >
        {/* Tag + counter */}
        <div className="pgal-card-top">
          <span className="pgal-tag">{p.tag}</span>
          <span className="pgal-counter">{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        </div>

        {/* Year */}
        <p className="pgal-year">{p.year}</p>

        {/* Title */}
        <h2 className="pgal-title">{p.name}</h2>

        {/* Divider */}
        <div className="pgal-rule" />

        {/* Info */}
        <div className="pgal-info">
          <div className="pgal-info-block">
            <p className="pgal-info-label">El desafío</p>
            <p className="pgal-info-text">{p.problem}</p>
          </div>
          <div className="pgal-info-block">
            <p className="pgal-info-label">La solución</p>
            <p className="pgal-info-text">{p.solution}</p>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button className="pgal-arrow pgal-arrow-prev" onClick={e => { e.stopPropagation(); goPrev(); }} aria-label="Anterior">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button className="pgal-arrow pgal-arrow-next" onClick={e => { e.stopPropagation(); goNext(); }} aria-label="Siguiente">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Dots */}
      <div className="pgal-dots" onClick={e => e.stopPropagation()}>
        {projects.map((_, i) => (
          <button
            key={i}
            className={\`pgal-dot \${i === current ? 'pgal-dot-active' : ''}\`}
            onClick={() => go(i, i > current ? 1 : -1)}
          />
        ))}
      </div>

      {/* Close */}
      <button className="pgal-close" onClick={onClose} aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

    </div>
  );
}

`;

app = app.substring(0, vcStart) + newStoryComponents + app.substring(lcStart);

// ── 2. Remove old StoryMode invocation from the App component render tree ─────
// Replace StoryMode usage with ProjectGallery
// Find the story section in the main app render
app = app.replace(
  /const \[storyActive, setStoryActive\] = useState\(false\);/,
  'const [storyActive, setStoryActive] = useState(false);'
);

// Replace <StoryMode ... /> usage with <ProjectGallery .../>
app = app.replace(
  /\s*<StoryMode[\s\S]*?\/>/,
  '\n      <ProjectGallery active={storyActive} onClose={() => setStoryActive(false)} />'
);

// Fix the hero button to use setStoryActive  
app = app.replace(
  /onStartStory=\{.*?\}/g,
  'onStartStory={() => setStoryActive(true)}'
);

fs.writeFileSync('src/App.jsx', app);

// ── 3. Replace story CSS with gallery CSS ─────────────────────────────────────
// Find story root css start
const storyCssStart = css.indexOf('/* ─── STORY ROOT ──');
const storyCssEnd = css.indexOf('/* ─── VERTICAL TRACK');

let galCSS = `/* ─── PROJECT GALLERY OVERLAY ──────────────────────────────────────────────── */
.pgal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 9, 8, 0.92);
  backdrop-filter: blur(4px);
  animation: pgal-fade-in 0.35s ease both;
}
@keyframes pgal-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Background media */
.pgal-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.pgal-bg-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(28px) saturate(0.6) brightness(0.4);
  transform: scale(1.08);
  animation: pgal-bg-fade 0.6s ease both;
}
@keyframes pgal-bg-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.pgal-bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 100% at 50% 50%, transparent 30%, rgba(8,7,6,0.7) 100%),
    linear-gradient(to bottom, rgba(8,7,6,0.5) 0%, transparent 20%, transparent 80%, rgba(8,7,6,0.8) 100%);
  pointer-events: none;
}

/* Main content card */
.pgal-card {
  position: relative;
  z-index: 2;
  max-width: 640px;
  width: 100%;
  padding: clamp(32px, 5vw, 56px);
  color: #f8f6f2;
  will-change: transform, opacity;
}
.pgal-enter {
  animation: pgal-card-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.pgal-exit-left {
  animation: pgal-card-out-left 0.35s cubic-bezier(0.4, 0, 1, 1) both;
}
.pgal-exit-right {
  animation: pgal-card-out-right 0.35s cubic-bezier(0.4, 0, 1, 1) both;
}
@keyframes pgal-card-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pgal-card-out-left {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-12px); }
}
@keyframes pgal-card-out-right {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(12px); }
}

.pgal-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pgal-tag {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(248, 246, 242, 0.45);
  padding: 5px 10px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 2px;
}
.pgal-counter {
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(248, 246, 242, 0.3);
  letter-spacing: 0.1em;
}

.pgal-year {
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(248, 246, 242, 0.35);
  letter-spacing: 0.14em;
  margin: 0 0 8px;
}
.pgal-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.05;
  color: #f8f6f2;
  margin: 0 0 20px;
}
.pgal-rule {
  width: 40px;
  height: 1px;
  background: rgba(255,255,255,0.18);
  margin-bottom: 24px;
}

.pgal-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.pgal-info-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pgal-info-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(248, 246, 242, 0.38);
  margin: 0;
}
.pgal-info-text {
  font-size: 13.5px;
  line-height: 1.7;
  color: rgba(248, 246, 242, 0.78);
  margin: 0;
}

/* Navigation arrows */
.pgal-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  backdrop-filter: blur(8px);
}
.pgal-arrow:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border-color: rgba(255,255,255,0.25);
}
.pgal-arrow-prev { left: clamp(12px, 3vw, 48px); }
.pgal-arrow-next { right: clamp(12px, 3vw, 48px); }

/* Dots */
.pgal-dots {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}
.pgal-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.25);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}
.pgal-dot-active {
  background: rgba(255,255,255,0.85);
  width: 20px;
  border-radius: 2px;
}

/* Close button */
.pgal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
}
.pgal-close:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

@media (max-width: 640px) {
  .pgal-info { grid-template-columns: 1fr; gap: 16px; }
  .pgal-arrow { display: none; }
}

`;

if (storyCssStart !== -1 && storyCssEnd !== -1) {
  css = css.substring(0, storyCssStart) + galCSS + css.substring(storyCssEnd);
} else if (storyCssStart !== -1) {
  // Find end by looking for next major comment
  const nextSection = css.indexOf('\n/* ─── ', storyCssStart + 10);
  if (nextSection !== -1) {
    css = css.substring(0, storyCssStart) + galCSS + css.substring(nextSection);
  }
}

fs.writeFileSync('src/index.css', css);

console.log('Done.');
