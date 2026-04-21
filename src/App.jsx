import { useState, useRef, useEffect, useCallback } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────
const mainProjects = [
  {
    name: "SimpleBuy",
    subtitle: "Plataforma para crear tiendas online",
    tag: "Back-End",
    tagColor: "indigo",
    images: ["/ReelSimpleBuy10.mp4"],
    description:
      "Proyecto Back-End orientado a facilitar la creación y gestión de tiendas online para negocios.",
    links: [{ label: "Sitio", url: "https://simplebuy.com.ar/home" }],
    imgClass: "bg-zinc-950",
  },
  {
    name: "Citax",
    subtitle: "Gestión de citas y automatización con IA",
    tag: "SaaS",
    tagColor: "violet",
    images: [
      "/www.citax.com.ar_.png",
      "/www.citax.com.ar_ (1).png",
      "/citaxchatwsp.png",
    ],
    description:
      "Demuestra lógica de negocio compleja, turnos, usuarios y foco en mantenibilidad y escalabilidad.",
    links: [{ label: "Sitio", url: "https://www.citax.com.ar/" }],
    imgClass: "object-cover",
  },
  {
    name: "Club Judicial VM",
    subtitle: "Portal institucional y comunidad",
    tag: "Web",
    tagColor: "sky",
    images: ["/clubjudicialvm.com.ar_home.png"],
    description:
      "Sitio institucional con enfoque en contenido, reservas y experiencia para socios.",
    links: [{ label: "Sitio", url: "https://clubjudicialvm.com.ar/" }],
    imgClass: "object-cover",
  },
  {
    name: "Ingeniería en Primera Persona",
    subtitle: "Charlas de profesionales para estudiantes",
    tag: "Evento",
    tagColor: "emerald",
    images: ["/ingprimerapersona1.png", "/ingprimerapersona.png"],
    description:
      "Evento universitario organizado en equipo donde profesionales compartieron sus experiencias laborales reales con los estudiantes.",
    links: [
      { label: "Sitio", url: "https://ingprimerapersona.web.app/" },
      { label: "GitHub", url: "https://github.com/mateyyyy/ingprimerapersona" },
    ],
    imgClass: "object-cover",
  },
  {
    name: "NASA Space Apps",
    subtitle: "Desafío Will it Rain",
    tag: "Hackathon",
    tagColor: "amber",
    images: ["/willitrain.png", "/willitrain1.png"],
    description:
      "Participación en el hackathon internacional de la NASA resolviendo el desafío 'Will it rain', creando predicción y visualización meteorológica.",
    links: [
      { label: "App", url: "https://will-it-rain-front.vercel.app/" },
      {
        label: "GitHub Backend",
        url: "https://github.com/mateyyyy/WillItRainBackEnd",
      },
    ],
    imgClass: "object-contain bg-zinc-950",
  },
];

const hobbyProjects = [
  {
    name: "Bot Twitter Inflación",
    subtitle: "Web Scraping y Automatización",
    tag: "Bot",
    tagColor: "rose",
    images: ["/diabot.png", "/diabot1.png"],
    description:
      "Bot para Twitter que realizaba scraping automatizado en páginas de un supermercado para publicar regularmente la inflación sobre ciertos productos.",
    links: [
      { label: "GitHub", url: "https://github.com/mateyyyy/BotSuperDia" },
    ],
    imgClass: "object-cover",
  },
  {
    name: "Dino IA V2",
    subtitle: "Red neuronal desde cero + evolución genética",
    tag: "ML",
    tagColor: "indigo",
    images: [
      "https://github.com/user-attachments/assets/8e6a4815-acc6-4ea3-983c-fa03f3de9a35",
    ],
    description:
      "Juego del Dino implementado desde cero, con perceptrón multicapa y algoritmos genéticos.",
    links: [{ label: "GitHub", url: "https://github.com/mateyyyy/DinoAiV2" }],
    imgClass: "object-cover",
  },
  {
    name: "Snake Game AI",
    subtitle: "Juego clásico + Red Neuronal",
    tag: "IA",
    tagColor: "violet",
    images: ["public/snake.png"],
    description:
      "Desarrollo del clásico juego Snake en Python, al que posteriormente le integré una red neuronal desde cero para que aprenda a jugar de manera autónoma.",
    links: [{ label: "GitHub", url: "https://github.com/mateyyyy/SnakeGame" }],
    imgClass: "object-cover",
  },

  {
    name: "SIU Guaraní Calculadora",
    subtitle: "Extensión de Chrome en producción",
    tag: "Extension",
    tagColor: "sky",
    images: ["/siuguarani.png"],
    description:
      "Extensión publicada en Chrome Web Store para calcular automáticamente el promedio en SIU Guaraní.",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/mateyyyy/SiuGuaraniPromedio",
      },
      {
        label: "Chrome Store",
        url: "https://chromewebstore.google.com/detail/siu-guarani-calculadora-d/mobhhadapaogikeffmlcicmfinnmheeh",
      },
    ],
    imgClass: "object-contain bg-zinc-950",
  },
];

const additionalProjects = [
  {
    name: "Saber Raíz",
    tag: "E-commerce",
    tagColor: "emerald",
    images: ["/www.saberraiz.com.ar_.png"],
    description:
      "Landing e-commerce de blends naturales con foco en producto y conversión.",
    url: "https://www.saberraiz.com.ar/",
    imgClass: "object-cover",
  },
  {
    name: "Consultora Puerta de Augusta",
    tag: "Corporativo",
    tagColor: "sky",
    images: ["/www.consultorapuertadeaugusta.com.ar_.png"],
    description:
      "Sitio corporativo para servicios de consultoría estratégica y mejora continua.",
    url: "https://www.consultorapuertadeaugusta.com.ar/",
    imgClass: "object-cover",
  },
];

const _techStack = [
  {
    category: "Lenguajes",
    items: ["JavaScript", "Java", "Python", "C"],
    color: "indigo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    category: "Backend & DB",
    items: ["Node.js", "Express", "REST APIs", "MySQL", "MongoDB", "Prisma"],
    color: "violet",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    category: "Cloud & Tools",
    items: ["AWS EC2", "AWS S3", "Git", "GitHub", "Docker"],
    color: "sky",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
  },
  {
    category: "IA & Data",
    items: ["NumPy", "Pandas", "Matplotlib", "Machine Learning"],
    color: "emerald",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

const navItems = [
  { label: "Sobre mí", id: "about" },
  { label: "Stack", id: "stack" },
  { label: "Proyectos", id: "projects" },
  { label: "Hobby", id: "hobby" },
  { label: "Landings", id: "landings" },
  { label: "Contacto", id: "contact" },
];

const skillNodes = [
  {
    id: "react",
    label: "React",
    x: 28,
    y: 30,
    related: ["javascript", "node", "tailwind"],
    projects: ["SimpleBuy", "Citax", "Will it Rain"],
  },
  {
    id: "javascript",
    label: "JavaScript",
    x: 16,
    y: 56,
    related: ["react", "node", "express"],
    projects: ["SimpleBuy", "Citax", "Club Judicial VM"],
  },
  {
    id: "tailwind",
    label: "Tailwind",
    x: 38,
    y: 62,
    related: ["react", "javascript"],
    projects: ["Portfolio", "Citax"],
  },
  {
    id: "node",
    label: "Node.js",
    x: 52,
    y: 32,
    related: ["react", "javascript", "express", "mysql", "mongodb"],
    projects: ["SimpleBuy", "Citax", "Will it Rain"],
  },
  {
    id: "express",
    label: "Express",
    x: 66,
    y: 50,
    related: ["node", "javascript", "mysql", "mongodb"],
    projects: ["SimpleBuy", "Citax"],
  },
  {
    id: "mysql",
    label: "MySQL",
    x: 77,
    y: 30,
    related: ["node", "express"],
    projects: ["SimpleBuy"],
  },
  {
    id: "mongodb",
    label: "MongoDB",
    x: 80,
    y: 62,
    related: ["node", "express"],
    projects: ["Citax"],
  },
  {
    id: "docker",
    label: "Docker",
    x: 54,
    y: 76,
    related: ["node", "aws"],
    projects: ["Citax"],
  },
  {
    id: "aws",
    label: "AWS",
    x: 70,
    y: 80,
    related: ["docker", "node"],
    projects: ["SimpleBuy"],
  },
  {
    id: "python",
    label: "Python",
    x: 26,
    y: 82,
    related: ["ml"],
    projects: ["Dino IA V2", "Snake Game AI", "Bot Twitter Inflación"],
  },
  {
    id: "ml",
    label: "ML",
    x: 12,
    y: 84,
    related: ["python"],
    projects: ["Dino IA V2", "Snake Game AI"],
  },
];

const skillEdges = skillNodes.flatMap((node) =>
  node.related
    .filter((target) => node.id < target)
    .map((target) => [node.id, target]),
);

const tagColorMap = {
  indigo: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  violet: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  sky: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  rose: "bg-lime-500/10 text-lime-300 border-lime-500/20",
};

const _stackColorMap = {
  indigo: {
    icon: "text-emerald-400",
    dot: "bg-emerald-400",
    pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    glow: "rgba(16,185,129,0.12)",
  },
  violet: {
    icon: "text-teal-400",
    dot: "bg-teal-400",
    pill: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    glow: "rgba(45,212,191,0.12)",
  },
  sky: {
    icon: "text-cyan-400",
    dot: "bg-cyan-400",
    pill: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    glow: "rgba(34,211,238,0.12)",
  },
  emerald: {
    icon: "text-emerald-400",
    dot: "bg-emerald-400",
    pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    glow: "rgba(52,211,153,0.08)",
  },
};

// ─── HOOKS ────────────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useTypingEffect(words, speed = 80, deleteSpeed = 45, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx % words.length];
    let timeout;
    if (!isDeleting && displayed === word) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayed((prev) =>
            isDeleting ? prev.slice(0, -1) : word.slice(0, prev.length + 1),
          );
        },
        isDeleting ? deleteSpeed : speed,
      );
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIdx, words, speed, deleteSpeed, pause]);

  return displayed;
}

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((n) => document.getElementById(n.id));
      const scrollY = window.scrollY + 120;
      let current = "";
      sections.forEach((s) => {
        if (s && s.offsetTop <= scrollY) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return active;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────

// Chars used for the scramble effect
const SCRAMBLE_CHARS = "!<>-_\/[]{}—=+*^?#_01";

function ScrambleLetter({ targetChar, delay, duration = 600 }) {
  const [display, setDisplay] = useState(" ");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf;
    const globalDelay = delay;
    let start = null;

    const tick = (now) => {
      if (start === null) start = now;
      const elapsed = now - start;
      if (elapsed < globalDelay) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const scrambleElapsed = elapsed - globalDelay;
      const progress = Math.min(scrambleElapsed / duration, 1);

      if (progress >= 1) {
        setDisplay(targetChar);
        setDone(true);
        return;
      }
      if (Math.random() > progress * 0.85) {
        setDisplay(
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
        );
      } else {
        setDisplay(targetChar);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetChar, delay, duration]);

  return (
    <span
      style={{
        display: "inline-block",
        transition: done ? "none" : undefined,
        opacity: done ? 1 : 0.85,
      }}
    >
      {display}
    </span>
  );
}

function GlitchAssembleName() {
  const firstName = "MATÍAS";
  const lastName = "GIMÉNEZ";
  // Stagger: first name starts at 0, last name staggered after
  const firstDelay = 120; // ms between first-name letters
  const lastDelay = 180; // ms between last-name letters
  const lastStart = firstName.length * firstDelay + 300;

  const [showCmd, setShowCmd] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setShowCmd(true), 100);
    const t1 = setTimeout(() => setShowOutput(true), 600);
    const t2 = setTimeout(() => setShowName(true), 900);
    const t3 = setTimeout(
      () => setShowRole(true),
      900 + lastStart + lastName.length * lastDelay + 400,
    );
    return () => [t0, t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div
      className="select-none"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* whoami command line */}
      <div
        className="flex items-center gap-2 mb-3 text-[13px]"
        style={{
          opacity: showCmd ? 1 : 0,
          transform: showCmd ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <span style={{ color: "rgba(52,211,153,0.5)" }}>$</span>
        <span style={{ color: "rgba(52,211,153,0.4)" }}>whoami</span>
        <span
          className="typing-cursor"
          style={{
            opacity: showOutput ? 0 : 1,
            transition: "opacity 0.2s",
            background: "rgba(52,211,153,0.5)",
          }}
        />
      </div>

      {/* Returned output block */}
      {showOutput && (
        <div
          className="mb-1"
          style={{
            opacity: showOutput ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          {/* The big scrambled name */}
          {showName && (
            <h1
              className="font-black leading-[0.92] tracking-tight"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2.8rem, 9vw, 6.5rem)",
              }}
            >
              {/* First name — white, scrambles in */}
              <span className="block mb-1">
                {firstName.split("").map((ch, i) => (
                  <span
                    key={i}
                    style={{ color: "#fff", letterSpacing: "0.04em" }}
                  >
                    <ScrambleLetter
                      targetChar={ch}
                      delay={i * firstDelay}
                      duration={500}
                    />
                  </span>
                ))}
              </span>

              {/* Last name — gradient, scrambles in after first */}
              <span
                className="block gradient-text"
                style={{ letterSpacing: "0.05em" }}
              >
                {lastName.split("").map((ch, i) => (
                  <span key={i}>
                    <ScrambleLetter
                      targetChar={ch}
                      delay={lastStart + i * lastDelay}
                      duration={550}
                    />
                  </span>
                ))}
              </span>
            </h1>
          )}
        </div>
      )}

      {/* Role tag line beneath */}
      <div
        className="mt-4 flex items-center gap-3"
        style={{
          opacity: showRole ? 1 : 0,
          transform: showRole ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}
      >
        <span style={{ color: "rgba(52,211,153,0.35)", fontSize: 12 }}>//</span>
        <span
          style={{
            color: "rgba(52,211,153,0.65)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Backend Developer · Cybersecurity · San Luis, AR
        </span>
      </div>
    </div>
  );
}

function SkillSynergyNetwork() {
  const [hoveredSkillId, setHoveredSkillId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [pointer, setPointer] = useState(null);

  const activeSkillId = hoveredSkillId || selectedSkillId;
  const activeSkill = skillNodes.find((skill) => skill.id === activeSkillId);

  const pullNode = (skill) => {
    if (!pointer) return { x: skill.x, y: skill.y };
    const dx = pointer.x - skill.x;
    const dy = pointer.y - skill.y;
    const distance = Math.hypot(dx, dy) || 1;
    const pull = Math.max(0, 1 - distance / 40) * 3.6;
    return {
      x: skill.x + (dx / distance) * pull,
      y: skill.y + (dy / distance) * pull,
    };
  };

  const visibleEdges = activeSkillId
    ? skillEdges.filter(([a, b]) => a === activeSkillId || b === activeSkillId)
    : [];

  return (
    <div className="reveal reveal-delay-1 terminal-window rounded-3xl border border-white/8 bg-white/[0.025] p-5 md:p-6">
      <p className="mb-4 text-[12px] text-zinc-400">
        Pasá el cursor por una habilidad para ver su sinergia. Hacé click para
        ver proyectos relacionados.
      </p>

      <div
        className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-emerald-500/15 bg-black/35"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setPointer({ x, y });
        }}
        onMouseLeave={() => {
          setPointer(null);
          setHoveredSkillId(null);
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {visibleEdges.map(([a, b]) => {
            const from = skillNodes.find((skill) => skill.id === a);
            const to = skillNodes.find((skill) => skill.id === b);
            if (!from || !to) return null;

            const fromPulled = pullNode(from);
            const toPulled = pullNode(to);

            return (
              <line
                key={`${a}-${b}`}
                x1={fromPulled.x}
                y1={fromPulled.y}
                x2={toPulled.x}
                y2={toPulled.y}
                className="synergy-line"
              />
            );
          })}
        </svg>

        {skillNodes.map((skill) => {
          const isActive = activeSkillId === skill.id;
          const isConnected = activeSkillId
            ? isActive || skill.related.includes(activeSkillId)
            : false;
          const pulled = pullNode(skill);

          return (
            <button
              key={skill.id}
              type="button"
              onMouseEnter={() => setHoveredSkillId(skill.id)}
              onMouseLeave={() => setHoveredSkillId(null)}
              onClick={() =>
                setSelectedSkillId((current) =>
                  current === skill.id ? null : skill.id,
                )
              }
              className={`skill-node ${isActive ? "skill-node-active" : ""} ${isConnected ? "skill-node-connected" : ""}`}
              style={{ left: `${pulled.x}%`, top: `${pulled.y}%` }}
            >
              {skill.label}
            </button>
          );
        })}
      </div>

      {selectedSkillId && activeSkill && (
        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs uppercase tracking-widest text-emerald-300">
            {activeSkill.label} en proyectos
          </p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {activeSkill.projects.map((project) => (
              <li key={project}>• {project}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[#050508]/92 backdrop-blur-2xl border-b border-emerald-500/8"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-5xl px-5 md:px-10 h-14 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-sm font-bold tracking-tight hover:text-emerald-200 transition-colors duration-200 shell-title"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          MG.
        </button>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative px-3 py-1.5 rounded-lg text-[12px] font-medium tracking-wide transition-all duration-200 ${
                active === item.id
                  ? "text-emerald-200 bg-emerald-500/8"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/4"
              }`}
            >
              {active === item.id && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 dot-pulse" />
              )}
              {item.label}
            </button>
          ))}
        </div>
        <a
          href="mailto:matiasgimenez452@gmail.com"
          className="hidden md:inline-flex items-center gap-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-500/25 px-4 py-1.5 text-[12px] font-semibold text-emerald-200 transition-all duration-200 btn-magnetic"
        >
          Contacto
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </nav>
  );
}

function getHologramType(project) {
  const source =
    `${project.name} ${project.subtitle} ${project.tag}`.toLowerCase();
  if (/ia|ml|neuronal|autónom|autonom|bot|machine/.test(source)) return "ai";
  if (/hack|security|seguridad|ciber|firewall|ethic/.test(source))
    return "security";
  return "web";
}

function ProjectImageSlider({ images, project, onOpenGallery }) {
  const [hovered, setHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scanX, setScanX] = useState(50);
  const isVideo = images[0]?.endsWith(".mp4");
  const holoType = getHologramType(project);

  useEffect(() => {
    if (isVideo || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [images.length, isVideo]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    setScanX(Math.max(0, Math.min(100, xPercent)));
  };

  return (
    <div
      className="relative h-56 w-full overflow-hidden bg-zinc-950 group cursor-pointer"
      onClick={() => onOpenGallery(images)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setScanX(50);
      }}
      onMouseMove={handleMouseMove}
    >
      {isVideo ? (
        <video
          src={images[0]}
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-55"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        images.map((img, i) => (
          <img
            key={img}
            src={img}
            alt={`Preview ${i + 1}`}
            className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ${i === currentIndex ? "opacity-55" : "opacity-0"}`}
            loading="lazy"
          />
        ))
      )}

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="capsule-frame" />
        <div
          className={`hologram-panel ${hovered ? "hologram-panel-active" : ""}`}
        >
          <div className={`hologram-core hologram-${holoType}`} />
        </div>
        <div className="scan-line" style={{ left: `${scanX}%` }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md border border-cyan-300/25 px-5 py-2.5 text-[13px] font-medium text-cyan-100 shadow-xl">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {images.length > 1 ? "Ver galería" : "Ver proyecto"}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpenMedia }) {
  const colors = tagColorMap[project.tagColor] || tagColorMap.indigo;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-sm card-glow terminal-window">
      <ProjectImageSlider
        images={project.images}
        project={project}
        onOpenGallery={onOpenMedia}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] ${colors}`}
          >
            {project.tag}
          </span>
          <span className="text-[11px] text-zinc-600 font-mono">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3
          className="text-base font-bold text-white leading-tight"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {project.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
          {project.subtitle}
        </p>
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-zinc-400">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-white/5">
          {project.links.map((link) => (
            <a
              key={`${project.name}-${link.label}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/4 border border-white/8 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition-all hover:bg-emerald-800/50 hover:text-emerald-200 hover:border-emerald-500/30"
            >
              {link.label}
              <svg
                viewBox="0 0 24 24"
                width="10"
                height="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="opacity-60"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function MediaModal({ mediaModal, setMediaModal }) {
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    setModalIndex(0);
  }, [mediaModal]);

  useEffect(() => {
    const onKey = (e) => {
      if (!mediaModal) return;
      if (e.key === "Escape") setMediaModal(null);
      if (e.key === "ArrowRight")
        setModalIndex((p) => (p + 1) % mediaModal.length);
      if (e.key === "ArrowLeft")
        setModalIndex((p) => (p - 1 + mediaModal.length) % mediaModal.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mediaModal, setMediaModal]);

  if (!mediaModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/96 backdrop-blur-xl"
      onClick={() => setMediaModal(null)}
    >
      <button
        type="button"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105"
        onClick={(e) => {
          e.stopPropagation();
          setMediaModal(null);
        }}
        aria-label="Cerrar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {mediaModal.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex(
                (p) => (p - 1 + mediaModal.length) % mediaModal.length,
              );
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex((p) => (p + 1) % mediaModal.length);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-2 rounded-full bg-black/40 backdrop-blur-sm">
            {mediaModal.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === modalIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalIndex(i);
                }}
              />
            ))}
          </div>
        </>
      )}

      <div
        className="relative w-full max-w-[1200px] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {mediaModal[modalIndex].endsWith(".mp4") ? (
          <video
            key={mediaModal[modalIndex]}
            src={mediaModal[modalIndex]}
            controls
            autoPlay
            className="max-h-[85vh] w-auto max-w-[650px] rounded-2xl shadow-2xl border border-white/10 outline-none"
            style={{ backgroundColor: "#000" }}
          />
        ) : (
          <img
            key={mediaModal[modalIndex]}
            src={mediaModal[modalIndex]}
            alt={`Slide ${modalIndex + 1}`}
            className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain"
          />
        )}
      </div>
    </div>
  );
}

// ─── BOOT SEQUENCE ───────────────────────────────────────────────────────────
const BOOT_LINES = [
  { delay: 0, text: "Initializing secure environment...", type: "dim" },
  {
    delay: 120,
    text: "CPU / Memory check ........................ [OK]",
    type: "ok",
  },
  {
    delay: 240,
    text: "Network tunnel established ................ [OK]",
    type: "ok",
  },
  { delay: 360, text: "Loading portfolio services...", type: "dim" },
  {
    delay: 520,
    text: "Applying UI modules ....................... [OK]",
    type: "ok",
  },
  {
    delay: 690,
    text: "Enabling cybersecurity layer .............. [OK]",
    type: "ok",
  },
  { delay: 860, text: "Launching interface", type: "accent" },
  { delay: 980, text: "System ready.", type: "kernel" },
];

function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [phase, setPhase] = useState("lines"); // lines → progress → done
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const rafRef = useRef(null);

  // ── spawn lines ───────────────────────────────────────────────────────────
  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, { ...line, id: i }]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setPhase("progress"), 120);
        }
      }, line.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── progress bar ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "progress") return;
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setFadingOut(true);
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 260);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const lineColor = (type) => {
    if (type === "ok") return "#34d399";
    if (type === "kernel") return "#67e8f9";
    if (type === "accent") return "#a78bfa";
    return "#52525b";
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, #061010 0%, #050508 65%)",
        fontFamily: "'JetBrains Mono', monospace",
        opacity: fadingOut ? 0 : 1,
        filter: fadingOut ? "blur(2px)" : "blur(0px)",
        transition: "opacity 0.26s ease, filter 0.26s ease",
      }}
    >
      {/* Terminal output area */}
      <div className="flex-1 overflow-hidden px-6 pt-8 pb-4 flex flex-col justify-end">
        <div className="max-w-2xl w-full mx-auto space-y-[3px]">
          {visibleLines.map((line) => (
            <div
              key={line.id}
              className="text-[11px] md:text-[12px] leading-relaxed animate-[fadeSlide_0.18s_ease_both]"
              style={{ color: lineColor(line.type) }}
            >
              {line.text}
            </div>
          ))}

          {/* Blinking cursor after last line */}
          {phase === "lines" && visibleLines.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400/60">
              <span>$</span>
              <span className="typing-cursor" />
            </div>
          )}
        </div>
      </div>

      {/* Progress section */}
      {phase === "progress" && (
        <div className="px-6 pb-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-400">
                BOOTSTRAP
              </span>
              <span className="text-[10px] text-emerald-500/60 font-bold">
                {Math.round(progress * 100)}%
              </span>
            </div>

            {/* Outer track */}
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: "3px", background: "rgba(52,211,153,0.12)" }}
            >
              {/* Filled bar */}
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background:
                    "linear-gradient(90deg, #059669, #34d399, #67e8f9)",
                  boxShadow: "0 0 10px rgba(52,211,153,0.6)",
                  transition: "width 0.05s linear",
                }}
              />
            </div>

            {/* Segment ticks */}
            <div className="flex justify-between mt-1.5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-px h-1 rounded-full transition-colors duration-200"
                  style={{
                    background:
                      i / 20 <= progress
                        ? "rgba(52,211,153,0.7)"
                        : "rgba(52,211,153,0.15)",
                  }}
                />
              ))}
            </div>

            {/* Status text under bar */}
            <p
              className="mt-3 text-[10px] text-emerald-500/50 tracking-widest uppercase"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {progress < 0.45 && "Inicializando interfaz..."}
              {progress >= 0.45 &&
                progress < 0.8 &&
                "Aplicando módulos visuales..."}
              {progress >= 0.8 &&
                progress < 0.97 &&
                "Conexión segura establecida..."}
              {progress >= 0.97 && "\u2713 Ready"}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── EFFECTS ──────────────────────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const letters = "01";
    const fontSize = 16;
    let columns = Math.ceil(width / fontSize);
    let drops = Array(columns)
      .fill(1)
      .map(() => Math.random() * -160);

    let animationFrameId;
    let last = 0;
    const frameInterval = 1000 / 20;

    const draw = (now = 0) => {
      if (now - last < frameInterval) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      last = now;

      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.55) continue;
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.988) drops[i] = 0;
        drops[i] += 0.6;
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.ceil(width / fontSize);
      drops = Array(columns)
        .fill(1)
        .map(() => Math.random() * -100);
      ctx.clearRect(0, 0, width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas fixed inset-0 z-0 pointer-events-none mix-blend-screen"
    />
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────
function App() {
  const [mediaModal, setMediaModal] = useState(null);
  const [booted, setBooted] = useState(false);
  const active = useActiveSection();
  useScrollReveal();

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  const typingText = useTypingEffect([
    "Cybersecurity Enthusiast",
    "Backend Developer",
    "Back-End Engineer",
    "Problem Solver",
  ]);

  const handleOpenMedia = (mediaArray) => setMediaModal(mediaArray);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      <div
        className="relative min-h-screen bg-[#050508] text-emerald-50 selection:bg-emerald-500/20 selection:text-emerald-200 overflow-x-hidden"
        style={{
          opacity: booted ? 1 : 0,
          transition: booted ? "opacity 0.6s ease" : "none",
        }}
      >
        <MatrixRain />
        <div className="cyber-scanline pointer-events-none fixed inset-0 z-[2]" />

        {/* Dot grid */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(16,185,129,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <Navbar active={active} />

        <main className="relative z-10 mx-auto w-full max-w-5xl px-5 md:px-10">
          {/* ════════════════════════ HERO ══ */}
          <section className="pt-28 pb-20 md:pt-36 md:pb-28">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
              <div className="flex-1">
                {/* Name block — scramble effect */}
                <GlitchAssembleName />

                {/* Typing subtitle */}
                <div
                  className="mt-6 flex items-center gap-2 text-base md:text-lg text-zinc-500 font-light min-h-[2rem]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span style={{ color: "rgba(52,211,153,0.4)", fontSize: 14 }}>
                    &#x276F;
                  </span>
                  <span>{typingText}</span>
                  <span className="typing-cursor text-emerald-400" />
                </div>

                {/* Bio */}
                <p className="mt-5 max-w-xl text-zinc-500 text-[15px] leading-relaxed">
                  Analista en Sistemas · Estudiante avanzado de Ingeniería.
                  Resuelvo problemas reales con software robusto, escalable y
                  mantenible.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("projects")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all btn-magnetic shadow-xl shadow-emerald-900/30"
                  >
                    Ver proyectos
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/mateyyyy"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-all btn-magnetic"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="currentColor"
                      className="opacity-70"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/matias-gimenez-1a7a172bb/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-all btn-magnetic"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="currentColor"
                      className="opacity-70"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Avatar / initials card */}
              <div className="hidden md:flex flex-col items-center gap-4">
                <div className="relative float-slow">
                  <div className="h-40 w-40 rounded-3xl overflow-hidden border border-emerald-500/12 bg-gradient-to-br from-emerald-950/80 to-cyan-950/60 flex items-center justify-center">
                    <span
                      className="text-5xl font-black gradient-text"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      MG
                    </span>
                  </div>
                  {/* Decorative rings */}
                  <div className="absolute -inset-3 rounded-[2rem] border border-emerald-500/10 -z-10" />
                  <div className="absolute -inset-6 rounded-[2.5rem] border border-emerald-500/5 -z-10" />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-xs text-zinc-600 uppercase tracking-widest font-medium">
                    Villa Mercedes, San Luis
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Open to remote & local
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-14 grid grid-cols-3 md:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/8 terminal-strip">
              {[
                { value: "5+", label: "Proyectos productivos" },
                { value: "2+", label: "Años de experiencia" },
                { value: "10+", label: "Tecnologías" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.025] px-6 py-5 flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors terminal-cell"
                >
                  <span
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ════════════════════════ ABOUT ══ */}
          <section id="about" className="py-20 border-t border-white/5">
            <div className="reveal flex items-center gap-4 mb-12">
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-zinc-600 section-shell-label">
                01 — Sobre mí
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>
            <div className="grid md:grid-cols-[1fr_1.6fr] gap-14 items-start">
              <div className="reveal">
                <h2
                  className="text-3xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Construyo software
                  <br />
                  <span className="gradient-text">que escala.</span>
                </h2>
                <div className="mt-6 space-y-1">
                  {[
                    { label: "Rol", value: "Backend Developer" },
                    {
                      label: "Formación",
                      value: "Ing. en Sistemas (avanzado)",
                    },
                    { label: "Ubicación", value: "Mendoza, Argentina" },
                    { label: "Idiomas", value: "Español, Inglés (B2)" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 py-2 border-b border-white/5"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 w-24">
                        {item.label}
                      </span>
                      <span className="text-sm text-zinc-300">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="reveal reveal-delay-1 space-y-5">
                <p className="text-[16px] leading-relaxed text-zinc-300">
                  Soy Analista en Sistemas y estudiante avanzado de Ingeniería
                  en Sistemas, orientado al desarrollo{" "}
                  <span className="text-white font-semibold">Backend</span> con
                  fuerte interés en arquitectura de software, IA aplicada e
                  infraestructura cloud.
                </p>
                <p className="text-[15px] leading-relaxed text-zinc-400">
                  Trabajo con mentalidad de producto: priorizo la calidad
                  técnica, resultados medibles y soluciones que realmente
                  funcionan en producción. Aprendo rápido, me adapto bien y
                  disfruto los proyectos desafiantes.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "Node.js",
                    "Express",
                    "MySQL",
                    "MongoDB",
                    "AWS",
                    "REST APIs",
                    "Docker",
                    "Prisma",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="tech-pill rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════ STACK ══ */}
          <section id="stack" className="py-20 border-t border-white/5">
            <div className="reveal flex items-center gap-4 mb-12">
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-zinc-600 section-shell-label">
                02 — Stack Tecnológico
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>

            <SkillSynergyNetwork />
          </section>

          {/* ════════════════════════ PROJECTS ══ */}
          <section id="projects" className="py-20 border-t border-white/5">
            <div className="reveal flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-zinc-600 section-shell-label">
                03 — Proyectos
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>
            <p className="reveal reveal-delay-1 mb-12 text-sm text-zinc-500">
              Proyectos con impacto real y usuarios activos.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {mainProjects.map((project, i) => (
                <div
                  key={project.name}
                  className={`reveal reveal-delay-${(i % 2) + 1}`}
                >
                  <ProjectCard
                    project={project}
                    index={i}
                    onOpenMedia={handleOpenMedia}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ════════════════════════ HOBBY ══ */}
          <section id="hobby" className="py-20 border-t border-white/5">
            <div className="reveal flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-zinc-600 section-shell-label">
                04 — Proyectos Hobby
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>
            <p className="reveal reveal-delay-1 mb-12 text-sm text-zinc-500">
              Automatización, web scraping e Inteligencia Artificial aplicada.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {hobbyProjects.map((project, i) => (
                <div
                  key={project.name}
                  className={`reveal reveal-delay-${(i % 2) + 1}`}
                >
                  <ProjectCard
                    project={project}
                    index={i}
                    onOpenMedia={handleOpenMedia}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ════════════════════════ LANDINGS ══ */}
          <section id="landings" className="py-20 border-t border-white/5">
            <div className="reveal flex items-center gap-4 mb-4">
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-zinc-600 section-shell-label">
                05 — Landing Pages
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>
            <p className="reveal reveal-delay-1 mb-12 text-sm text-zinc-500">
              Sitios enfocados en conversión y experiencia de usuario.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {additionalProjects.map((project, i) => (
                <div
                  key={project.name}
                  className={`reveal reveal-delay-${(i % 2) + 1}`}
                >
                  <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-sm card-glow terminal-window">
                    <ProjectImageSlider
                      images={project.images}
                      project={project}
                      onOpenGallery={handleOpenMedia}
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tagColorMap[project.tagColor] || tagColorMap.sky}`}
                        >
                          {project.tag}
                        </span>
                      </div>
                      <h3
                        className="text-base font-bold text-white"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                      >
                        {project.name}
                      </h3>
                      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-zinc-400">
                        {project.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 border border-white/10 px-3 py-1.5 text-[12px] font-medium text-zinc-300 transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                        >
                          Ver sitio
                          <svg
                            viewBox="0 0 24 24"
                            width="10"
                            height="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="opacity-60"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>

          {/* ════════════════════════ CONTACT ══ */}
          <section id="contact" className="py-20 border-t border-white/5">
            <div className="reveal flex items-center gap-4 mb-12">
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-zinc-600 section-shell-label">
                06 — Contacto
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>

            <div className="reveal relative overflow-hidden rounded-3xl border border-emerald-500/12 bg-[#040a07]/80 p-8 md:p-12">
              <div className="contact-glow-1" />
              <div className="contact-glow-2" />

              <div className="relative md:flex items-center justify-between gap-10">
                <div className="mb-8 md:mb-0">
                  <h2
                    className="text-3xl md:text-4xl font-black text-white leading-tight"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    Trabajemos
                    <br />
                    <span className="gradient-text">juntos.</span>
                  </h2>
                  <p className="mt-4 text-[15px] text-zinc-400 max-w-sm leading-relaxed">
                    Estoy disponible para proyectos freelance, posiciones
                    full-time o simplemente para charlar sobre tecnología.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href="mailto:matiasgimenez452@gmail.com"
                    className="inline-flex items-center gap-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-500/25 px-6 py-3.5 text-sm font-bold text-emerald-100 transition-all btn-magnetic"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    matiasgimenez452@gmail.com
                  </a>
                  <div className="flex gap-3">
                    <a
                      href="https://www.linkedin.com/in/matias-gimenez-1a7a172bb/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all btn-magnetic"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="currentColor"
                        className="opacity-70"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/mateyyyy"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all btn-magnetic"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="currentColor"
                        className="opacity-70"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════ FOOTER ══ */}
          <footer className="py-8 border-t border-emerald-500/8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
              <span
                className="text-[11px] text-zinc-600"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <span className="signature-cyber">Matías Giménez</span> · San
                Luis, AR · 2025
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/mateyyyy"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/matias-gimenez-1a7a172bb/"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                LinkedIn
              </a>
              <a
                href="mailto:matiasgimenez452@gmail.com"
                className="footer-link"
              >
                Email
              </a>
            </div>
          </footer>
        </main>

        <MediaModal mediaModal={mediaModal} setMediaModal={setMediaModal} />
      </div>
    </>
  );
}

export default App;
