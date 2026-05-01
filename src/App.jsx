import {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
} from "react";
import Lenis from "lenis";
import { GitHubCalendar } from "react-github-calendar";

const Story3D = lazy(() => import("./Story3D"));

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef([]);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trails = trailRef.current;
    let mouseX = -100,
      mouseY = -100;
    const hoverSelectors = "a, button, .project-img-wrap";

    const isHoverTarget = (el) => el && el.closest(hoverSelectors);

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onOver = (e) => {
      if (isHoverTarget(e.target)) {
        document.body.classList.add("cursor-hover");
      }
    };
    const onOut = (e) => {
      if (isHoverTarget(e.target) && !isHoverTarget(e.relatedTarget)) {
        document.body.classList.remove("cursor-hover");
      }
    };
    const onDown = () => document.body.classList.add("cursor-down");
    const onUp = () => document.body.classList.remove("cursor-down");
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    const animate = () => {
      posRef.current.x += (mouseX - posRef.current.x) * 0.18;
      posRef.current.y += (mouseY - posRef.current.y) * 0.18;
      if (cursor) {
        cursor.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`;
      }
      trails.forEach((dot, i) => {
        if (dot) {
          const delay = (i + 1) * 0.08;
          const tx = posRef.current.x;
          const ty = posRef.current.y;
          dot.style.transform = `translate(${tx - 2}px, ${ty - 2}px)`;
          dot.style.opacity = (1 - (i + 1) / trails.length) * 0.35;
          dot.style.transitionDelay = `${delay}s`;
        }
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRef.current[i] = el;
          }}
          className="cursor-trail"
          style={{ transition: `transform ${0.1 + i * 0.06}s ease` }}
        />
      ))}
    </>
  );
}

const _storyProjects = [
  {
    name: "SimpleBuy",
    year: "2023",
    tag: "Back-End",
    problem:
      "Los negocios locales no tenían forma sencilla de vender online sin depender de plataformas caras o complejas. Montar una tienda requería conocimientos técnicos que la mayoría no tenía.",
    solution:
      "Construí una plataforma que permite crear y gestionar tiendas online en minutos. [← COMPLETAR con detalles técnicos: arquitectura, tecnologías clave, decisiones de diseño]",
    image: "/ReelSimpleBuy10.mp4",
    isVideo: true,
    color: "#2a3a32",
  },
  {
    name: "Citax",
    year: "2024",
    tag: "SaaS",
    problem:
      "Los negocios de turnos (peluquerías, consultorios, estudios) perdían clientes por no poder gestionar citas fuera del horario laboral. El teléfono como único canal era un cuello de botella.",
    solution:
      "Un SaaS con gestión de turnos automatizada e integración con IA para responder consultas por WhatsApp. [← COMPLETAR con detalles: cómo funciona la IA, qué stack usaste, métricas si tenés]",
    images: [
      "/www.citax.com.ar_.png",
      "/www.citax.com.ar_ (1).png",
      "/citaxchatwsp.png",
    ],
    image: "/www.citax.com.ar_.png",
    isVideo: false,
    color: "#1e2d3d",
  },
  {
    name: "Club Judicial VM",
    year: "[← COMPLETAR]",
    tag: "Web",
    problem:
      "[← COMPLETAR: qué problema tenía el club antes del sitio? Sin reservas online, sin visibilidad, sin comunicación con socios?]",
    solution:
      "[← COMPLETAR: qué construiste, qué funcionalidades tiene, cómo mejoró la experiencia de los socios]",
    image: "/clubjudicialvm.com.ar_home.png",
    isVideo: false,
    color: "#2d2820",
  },
  {
    name: "Ingeniería en Primera Persona",
    year: "2023",
    tag: "Evento",
    problem:
      "[← COMPLETAR: qué problema existía para los estudiantes de ingeniería? Falta de contacto con el mundo laboral real?]",
    solution:
      "[← COMPLETAR: cómo organizaron el evento, qué impacto tuvo, cuántos asistentes, qué construiste técnicamente para el sitio]",
    images: ["/ingprimerapersona1.png", "/ingprimerapersona.png"],
    image: "/ingprimerapersona1.png",
    isVideo: false,
    color: "#1a2035",
  },
  {
    name: "NASA Space Apps",
    year: "2023",
    tag: "Hackathon",
    problem:
      "La predicción de lluvia hiperlocal era poco accesible para agricultores y personas sin conocimientos meteorológicos. Los datos de la NASA no llegaban a quienes más los necesitaban.",
    solution:
      "[← COMPLETAR: qué stack usaron, cómo procesaron los datos de la NASA, qué lograron en el hackathon, resultado/posición]",
    images: ["/willitrain.png", "/willitrain1.png"],
    image: "/willitrain.png",
    isVideo: false,
    color: "#0d1a2e",
  },
];

const STORY_MUSIC_URL = "/story-music.mp3";

const resolveStoryAsset = (p) => {
  if (p.startsWith("http")) return p;
  const clean = p.startsWith("/public/")
    ? p.slice(8)
    : p.startsWith("public/")
      ? p.slice(7)
      : p.startsWith("/")
        ? p.slice(1)
        : p;
  return import.meta.env.BASE_URL + encodeURI(clean);
};

const mainProjects = [
  {
    name: "SimpleBuy",
    subtitle: "Plataforma para crear tiendas online",
    tag: "Back-End",
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
    images: ["/ingprimerapersona1.png", "/ingprimerapersona.png"],
    description:
      "Evento universitario organizado en equipo donde profesionales compartieron sus experiencias laborales.",
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
    images: ["/willitrain.png", "/willitrain1.png"],
    description:
      "Hackathon internacional de la NASA: predicción y visualización meteorológica.",
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
    images: ["/diabot.png", "/diabot1.png"],
    description:
      "Bot que realizaba scraping automatizado en páginas de supermercado para publicar regularmente la inflación.",
    links: [
      { label: "GitHub", url: "https://github.com/mateyyyy/BotSuperDia" },
    ],
    imgClass: "object-cover",
  },
  {
    name: "Dino IA V2",
    subtitle: "Red neuronal desde cero + evolución genética",
    tag: "ML",
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
    images: ["public/snake.png"],
    description:
      "Snake en Python con red neuronal desde cero para que aprenda a jugar de forma autónoma.",
    links: [{ label: "GitHub", url: "https://github.com/mateyyyy/SnakeGame" }],
    imgClass: "object-cover",
  },
  {
    name: "SIU Guaraní Calculadora",
    subtitle: "Extensión de Chrome en producción",
    tag: "Extension",
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
    images: ["/www.saberraiz.com.ar_.png"],
    description:
      "Landing e-commerce de blends naturales con foco en producto y conversión.",
    url: "https://www.saberraiz.com.ar/",
    imgClass: "object-cover",
  },
  {
    name: "Consultora Puerta de Augusta",
    tag: "Corporativo",
    images: ["/www.consultorapuertadeaugusta.com.ar_.png"],
    description:
      "Sitio corporativo para servicios de consultoría estratégica y mejora continua.",
    url: "https://www.consultorapuertadeaugusta.com.ar/",
    imgClass: "object-cover",
  },
];

const storyTimeline = [
  {
    name: "Bot Twitter Inflacion + SIU Guarani",
    year: "2024",
    tag: "Hobby",
    problem:
      "Me interesaba construir proyectos chicos pero concretos que resolvieran problemas reales: automatizar relevamientos de precios y mejorar una herramienta que estudiantes usan todos los dias.",
    solution:
      "Arme un bot de scraping para publicar variaciones de precios y una extension de Chrome para calcular promedios en SIU Guarani de forma automatica.",
    images: ["/diabot.png", "/siuguarani.png", "/diabot1.png"],
    image: "/diabot.png",
    isVideo: false,
    color: "#35261d",
  },
  {
    name: "SimpleBuy",
    year: "2025",
    tag: "Back-End",
    problem:
      "Los negocios locales no tenian forma sencilla de vender online sin depender de plataformas caras o complejas. Montar una tienda requeria conocimientos tecnicos que la mayoria no tenia.",
    solution:
      "Construi una plataforma que permite crear y gestionar tiendas online en minutos. [COMPLETAR con detalles tecnicos: arquitectura, tecnologias clave, decisiones de diseno]",
    image: "/ReelSimpleBuy10.mp4",
    isVideo: true,
    color: "#2a3a32",
  },
  {
    name: "Club Judicial VM",
    year: "2025",
    tag: "Web",
    problem:
      "La institucion necesitaba una presencia digital mas clara para comunicar actividades, mejorar la experiencia de sus socios y ordenar mejor el acceso a la informacion.",
    solution:
      "Disene y desarrolle un portal institucional con foco en contenido, estructura clara y una experiencia mas moderna para socios y visitantes.",
    image: "/clubjudicialvm.com.ar_home.png",
    isVideo: false,
    color: "#2d2820",
  },
  {
    name: "Ingenieria en Primera Persona",
    year: "2025",
    tag: "Evento",
    problem:
      "Hacia falta acercar experiencias laborales reales a estudiantes de ingenieria para conectar la carrera con salidas concretas y referentes del mundo profesional.",
    solution:
      "Participe en la organizacion del evento y en la construccion del sitio, ayudando a presentar el contenido de forma clara y atractiva para estudiantes y asistentes.",
    images: ["/ingprimerapersona1.png", "/ingprimerapersona.png"],
    image: "/ingprimerapersona1.png",
    isVideo: false,
    color: "#1a2035",
  },
  {
    name: "Dino IA + Snake Game AI",
    year: "2025",
    tag: "Hobby IA",
    problem:
      "Quise profundizar en redes neuronales y algoritmos geneticos llevando la teoria a experimentos visuales, iterables y divertidos de entrenar.",
    solution:
      "Desarrolle dos juegos con IA desde cero: un Dino con evolucion genetica y un Snake con red neuronal para explorar aprendizaje, simulacion y ajuste de heuristicas.",
    images: [
      "https://github.com/user-attachments/assets/8e6a4815-acc6-4ea3-983c-fa03f3de9a35",
      "/snake.png",
    ],
    image: "/snake.png",
    isVideo: false,
    color: "#172a24",
  },
  {
    name: "Saber Raiz + Puerta de Augusta",
    year: "2025",
    tag: "Landings",
    problem:
      "Dos marcas muy distintas necesitaban presencia web clara y profesional, con foco en identidad, confianza y conversion desde el primer scroll.",
    solution:
      "Construi landings con una narrativa visual mas cuidada, priorizando jerarquia de contenido, producto y servicios para comunicar mejor cada propuesta.",
    images: [
      "/www.saberraiz.com.ar_.png",
      "/www.consultorapuertadeaugusta.com.ar_.png",
    ],
    image: "/www.saberraiz.com.ar_.png",
    isVideo: false,
    color: "#4a3426",
  },
  {
    name: "Citax",
    year: "2026",
    tag: "SaaS",
    problem:
      "Los negocios de turnos (peluquerias, consultorios, estudios) perdian clientes por no poder gestionar citas fuera del horario laboral. El telefono como unico canal era un cuello de botella.",
    solution:
      "Un SaaS con gestion de turnos automatizada e integracion con IA para responder consultas por WhatsApp. [COMPLETAR con detalles: como funciona la IA, que stack usaste, metricas si tenes]",
    images: [
      "/www.citax.com.ar_.png",
      "/www.citax.com.ar_ (1).png",
      "/citaxchatwsp.png",
    ],
    image: "/www.citax.com.ar_.png",
    isVideo: false,
    color: "#1e2d3d",
  },
  {
    name: "NASA Space Apps",
    year: "2026",
    tag: "Hackathon",
    problem:
      "La prediccion de lluvia hiperlocal era poco accesible para agricultores y personas sin conocimientos meteorologicos. Los datos de la NASA no llegaban a quienes mas los necesitaban.",
    solution:
      "[COMPLETAR: que stack usaron, como procesaron los datos de la NASA, que lograron en el hackathon, resultado/posicion]",
    images: ["/willitrain.png", "/willitrain1.png"],
    image: "/willitrain.png",
    isVideo: false,
    color: "#0d1a2e",
  },
];

const storyTotalProjects = storyTimeline.length;

// MAPA DE ECLIPSE — tiempos exactos + mood para el sistema de animación
const storyProjectSync = [
  // 13.9s — "All that you touch / And all that you see..."
  { textSync: 13.9, mediaSync: 15.1, nextSlide: 27.5, mood: "intro" },

  // 27.5s — "And all that you love / And all that you hate..."
  { textSync: 27.5, mediaSync: 28.7, nextSlide: 41.2, mood: "building" },

  // 41.2s — "And all that you give / And all that you deal..."
  { textSync: 41.2, mediaSync: 42.4, nextSlide: 55.0, mood: "building" },

  // 55.0s — "And all you create / And all you destroy..."
  { textSync: 55.0, mediaSync: 56.2, nextSlide: 68.8, mood: "energetic" },

  // 68.8s — "And everyone you meet / And all that you slight..."
  { textSync: 68.8, mediaSync: 70.0, nextSlide: 82.5, mood: "energetic" },

  // 82.5s — "And all that is now / And all that is gone..."
  { textSync: 82.5, mediaSync: 83.7, nextSlide: 93.0, mood: "intense" },

  // 93.0s — "And everything under the sun is in tune..." (remate épico)
  { textSync: 93.0, mediaSync: 94.2, nextSlide: 102.5, mood: "climax-prep" },

  // 102.5s — "But the sun is eclipsed by the moon." (corte seco final)
  { textSync: 102.5, mediaSync: 104.0, nextSlide: 110.0, mood: "climax-drop" },
];

const storySlides = [
  { type: "intro", sync: { nextSlide: 3.0 } },
  ...storyTimeline.flatMap((project, index) => {
    return [
      {
        type: "project",
        project,
        projectIndex: index,
        sync: storyProjectSync[index],
      },
    ];
  }),
  { type: "outro", sync: { nextSlide: null } },
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
    x: 30,
    y: 25,
    related: ["javascript", "node", "tailwind"],
    projects: ["SimpleBuy", "Citax", "Will it Rain"],
  },
  {
    id: "javascript",
    label: "JavaScript",
    x: 18,
    y: 48,
    related: ["react", "node", "express"],
    projects: ["SimpleBuy", "Citax", "Club Judicial VM"],
  },
  {
    id: "tailwind",
    label: "Tailwind",
    x: 42,
    y: 18,
    related: ["react", "javascript"],
    projects: ["Portfolio", "Citax"],
  },
  {
    id: "node",
    label: "Node.js",
    x: 52,
    y: 42,
    related: ["react", "javascript", "express", "mysql", "mongodb", "aws"],
    projects: ["SimpleBuy", "Citax", "Will it Rain"],
  },
  {
    id: "express",
    label: "Express",
    x: 38,
    y: 68,
    related: ["node", "javascript", "mysql", "mongodb"],
    projects: ["SimpleBuy", "Citax"],
  },
  {
    id: "mysql",
    label: "MySQL",
    x: 82,
    y: 45,
    related: ["node", "express"],
    projects: ["SimpleBuy"],
  },
  {
    id: "mongodb",
    label: "MongoDB",
    x: 72,
    y: 72,
    related: ["node", "express"],
    projects: ["Citax"],
  },
  {
    id: "docker",
    label: "Docker",
    x: 68,
    y: 22,
    related: ["node", "aws"],
    projects: ["Citax"],
  },
  {
    id: "aws",
    label: "AWS",
    x: 85,
    y: 25,
    related: ["docker", "node"],
    projects: ["SimpleBuy"],
  },
  {
    id: "python",
    label: "Python",
    x: 18,
    y: 78,
    related: ["ml", "javascript"],
    projects: ["Dino IA V2", "Snake Game AI", "Bot Twitter Inflación"],
  },
  {
    id: "ml",
    label: "ML",
    x: 32,
    y: 84,
    related: ["python"],
    projects: ["Dino IA V2", "Snake Game AI"],
  },
];

const skillEdges = skillNodes.flatMap((node) =>
  node.related.filter((t) => node.id < t).map((t) => [node.id, t]),
);

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
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
      const scrollY = window.scrollY + 120;
      let current = "";
      navItems.forEach((n) => {
        const s = document.getElementById(n.id);
        if (s && s.offsetTop <= scrollY) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return active;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav className={`nav-root ${scrolled ? "scrolled" : ""}`}>
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "0 32px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="nav-logo"
        >
          MG.
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`nav-link ${active === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <a
          href="mailto:matiasgimenez452@gmail.com"
          className="btn-primary"
          style={{ padding: "8px 18px", fontSize: 12 }}
        >
          Contacto
        </a>
      </div>
    </nav>
  );
}

// ─── SKILL SYNERGY ────────────────────────────────────────────────────────────
function SkillSynergyNetwork() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const activeId = hoveredId || selectedId;
  const activeSkill = skillNodes.find((s) => s.id === activeId);

  return (
    <div
      className="reveal reveal-delay-1"
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        padding: "20px 24px",
        background: "var(--cream-alt)",
      }}
    >
      <p style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 16 }}>
        Pasá el cursor por una habilidad para ver su sinergia. Hacé click para
        ver proyectos relacionados.
      </p>
      <div
        style={{
          position: "relative",
          height: 320,
          width: "100%",
          overflow: "hidden",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--cream)",
        }}
        onMouseLeave={() => setHoveredId(null)}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {skillEdges.map(([a, b]) => {
            const from = skillNodes.find((s) => s.id === a);
            const to = skillNodes.find((s) => s.id === b);
            if (!from || !to) return null;
            const isEdgeActive = activeId && (a === activeId || b === activeId);
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={isEdgeActive ? "synergy-line" : ""}
                stroke={isEdgeActive ? "var(--sage)" : "var(--border-dark)"}
                strokeWidth={isEdgeActive ? "0.25" : "0.12"}
                opacity={activeId && !isEdgeActive ? 0.2 : 1}
              />
            );
          })}
        </svg>
        {skillNodes.map((skill) => {
          const isActive = activeId === skill.id;
          const isConnected = activeId
            ? isActive || skill.related.includes(activeId)
            : false;
          return (
            <button
              key={skill.id}
              type="button"
              onMouseEnter={() => setHoveredId(skill.id)}
              onClick={() =>
                setSelectedId((c) => (c === skill.id ? null : skill.id))
              }
              className={`skill-node ${isActive ? "skill-node-active" : ""} ${isConnected ? "skill-node-connected" : ""}`}
              style={{
                left: `${skill.x}%`,
                top: `${skill.y}%`,
                opacity: activeId && !isConnected ? 0.35 : 1,
              }}
            >
              {skill.label}
            </button>
          );
        })}
      </div>
      {selectedId && activeSkill && (
        <div
          style={{
            marginTop: 16,
            padding: "14px 18px",
            border: "1px solid var(--sage-light)",
            borderRadius: 10,
            background: "var(--sage-pale)",
          }}
        >
          <p
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--sage)",
              marginBottom: 8,
            }}
          >
            {activeSkill.label} en proyectos
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {activeSkill.projects.map((p) => (
              <li
                key={p}
                style={{
                  fontSize: 13,
                  color: "var(--ink-mid)",
                  padding: "2px 0",
                }}
              >
                — {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── IMAGE SLIDER ─────────────────────────────────────────────────────────────
function ProjectImageSlider({ images, onOpenGallery }) {
  const [idx, setIdx] = useState(0);
  const isVideo = images[0]?.endsWith(".mp4");

  useEffect(() => {
    setIdx(0);
  }, [images]);

  useEffect(() => {
    if (isVideo || images.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % images.length), 3200);
    return () => clearInterval(t);
  }, [images.length, isVideo]);
  const resolve = (p) => {
    if (p.startsWith("http")) return p;
    const clean = p.startsWith("/public/")
      ? p.slice(8)
      : p.startsWith("public/")
        ? p.slice(7)
        : p.startsWith("/")
          ? p.slice(1)
          : p;
    return import.meta.env.BASE_URL + encodeURI(clean);
  };
  return (
    <div
      className="project-img-wrap"
      style={{
        position: "relative",
        height: 220,
        overflow: "hidden",
        background: "var(--cream-alt)",
        cursor: "pointer",
      }}
      onClick={() => onOpenGallery(images)}
    >
      {isVideo ? (
        <video
          src={resolve(images[0])}
          muted
          loop
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          className="img-zoom"
        />
      ) : (
        <img
          src={resolve(images[idx])}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          className="img-zoom"
        />
      )}
      {images.length > 1 && !isVideo && (
        <>
          <button
            type="button"
            className="slider-arrow left"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((p) => (p - 1 + images.length) % images.length);
            }}
          >
            {"<"}
          </button>
          <button
            type="button"
            className="slider-arrow right"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((p) => (p + 1) % images.length);
            }}
          >
            {">"}
          </button>
        </>
      )}
      {images.length > 1 && !isVideo && (
        <div className="slider-dots">
          {images.map((_, i) => (
            <div
              key={i}
              className={`slider-dot ${i === idx ? "active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROJECT ROW (expandable editorial style) ─────────────────────────────────
function ProjectRow({ project, index, onOpenMedia }) {
  const [open, setOpen] = useState(false);
  const [snakeActive, setSnakeActive] = useState(false);
  const isSnake = project.name === "Snake Game AI";

  useEffect(() => {
    if (!snakeActive) return;
    const t = setTimeout(() => setSnakeActive(false), 1600);
    return () => clearTimeout(t);
  }, [snakeActive]);

  const triggerSnake = () => {
    if (!isSnake) return;
    setSnakeActive(true);
  };

  return (
    <div>
      <div
        className={`project-row ${isSnake ? "snake-row" : ""} ${snakeActive ? "snake-pass-active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        onPointerDown={triggerSnake}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            triggerSnake();
            setOpen((o) => !o);
          }
        }}
      >
        {isSnake && <div className="snake-pass" aria-hidden="true" />}
        <span className="project-row-num">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <div className="project-row-title">{project.name}</div>
          <div className="project-row-sub">{project.subtitle}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="tag-pill sage">{project.tag}</span>
          <svg
            className="project-row-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
      <div className={`project-expanded ${open ? "open" : ""}`}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            padding: "20px 0 24px",
          }}
        >
          <ProjectImageSlider
            images={project.images}
            onOpenGallery={onOpenMedia}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--ink-mid)",
                  marginBottom: 20,
                }}
              >
                {project.description}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  style={{ fontSize: 12, padding: "8px 16px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING CARD ─────────────────────────────────────────────────────────────
function LandingCard({ project, onOpenMedia }) {
  return (
    <article
      className="landing-card"
      onClick={(e) => {
        // Find the "Ver sitio" link and click it, or just do nothing on the wrapper
      }}
    >
      <div className="landing-card-media">
        <ProjectImageSlider
          images={project.images}
          onOpenGallery={onOpenMedia}
        />
      </div>
      <div className="landing-card-body">
        <div className="landing-card-header">
          <h3 className="landing-card-name">{project.name}</h3>
          <span className="tag-pill">{project.tag}</span>
        </div>
        <p className="landing-card-desc">{project.description}</p>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="contact-link"
          style={{ fontSize: 12, alignSelf: "flex-start" }}
          onClick={(e) => e.stopPropagation()}
        >
          Ver sitio{" "}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ marginLeft: 4 }}
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </article>
  );
}

// ─── MEDIA MODAL ─────────────────────────────────────────────────────────────
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
  const resolve = (p) => {
    if (p.startsWith("http")) return p;
    const clean = p.startsWith("/public/")
      ? p.slice(8)
      : p.startsWith("public/")
        ? p.slice(7)
        : p.startsWith("/")
          ? p.slice(1)
          : p;
    return import.meta.env.BASE_URL + encodeURI(clean);
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(26,24,20,0.92)",
        backdropFilter: "blur(12px)",
      }}
      onClick={() => setMediaModal(null)}
    >
      <button
        type="button"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setMediaModal(null);
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      {mediaModal.length > 1 && (
        <>
          <button
            type="button"
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex(
                (p) => (p - 1 + mediaModal.length) % mediaModal.length,
              );
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex((p) => (p + 1) % mediaModal.length);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
      <div
        style={{
          maxWidth: 1200,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {mediaModal[modalIndex].endsWith(".mp4") ? (
          <video
            key={mediaModal[modalIndex]}
            src={resolve(mediaModal[modalIndex])}
            controls
            autoPlay
            style={{
              maxHeight: "85vh",
              width: "auto",
              maxWidth: 650,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        ) : (
          <img
            key={mediaModal[modalIndex]}
            src={resolve(mediaModal[modalIndex])}
            alt=""
            style={{
              maxHeight: "85vh",
              width: "auto",
              maxWidth: "100%",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
              objectFit: "contain",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ num, label }) {
  return (
    <div
      className="reveal"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 40,
      }}
    >
      <span className="section-label">
        {num} — {label}
      </span>
      <div className="section-rule" />
    </div>
  );
}

// ─── PEEKING BOT ──────────────────────────────────────────────────────────────
function PeekingBot() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hobbySection = document.getElementById("hobby");
      if (hobbySection) {
        const rect = hobbySection.getBoundingClientRect();
        // Visible when the hobby section is roughly in the middle of the screen
        const isNear =
          rect.top < window.innerHeight * 0.7 &&
          rect.bottom > window.innerHeight * 0.3;
        setIsVisible(isNear);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resolve = (p) => {
    if (p.startsWith("http")) return p;
    const clean = p.startsWith("/public/")
      ? p.slice(8)
      : p.startsWith("/")
        ? p.slice(1)
        : p;
    return import.meta.env.BASE_URL + clean;
  };

  return (
    <div
      style={{
        position: "fixed",
        right: isVisible ? "-100px" : "-250px",
        bottom: "15%",
        transform: `rotate(${isVisible ? "-12deg" : "0deg"})`,
        transformOrigin: "bottom right",
        transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: -1,
        pointerEvents: "none",
        width: "180px",
        filter: "drop-shadow(-8px 12px 24px rgba(0,0,0,0.12))",
      }}
    >
      <img
        src={resolve("/botdia.png")}
        alt="Bot asomándose"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}

// ─── PROJECT GALLERY ───────────────────────────────────────────────────────────
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
    if (active) {
      setCurrent(0);
      setAnimating(false);
    }
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, current, animating]);

  if (!active) return null;

  const p = projects[current];
  const mediaList =
    Array.isArray(p.images) && p.images.length ? p.images : [p.image];
  const bgSrc = resolveStoryAsset(mediaList[0]);
  const isVideo =
    p.isVideo ||
    (typeof mediaList[0] === "string" && mediaList[0].endsWith(".mp4"));

  return (
    <div className="pgal-overlay" onClick={onClose}>
      {/* Background image/video — blurred */}
      <div className="pgal-bg" key={current}>
        {isVideo ? (
          <video
            src={bgSrc}
            muted
            autoPlay
            loop
            playsInline
            className="pgal-bg-media"
          />
        ) : (
          <img src={bgSrc} alt="" className="pgal-bg-media" />
        )}
      </div>
      <div className="pgal-bg-gradient" />

      {/* Content card */}
      <div
        className={`pgal-card ${animating ? (dir > 0 ? "pgal-exit-left" : "pgal-exit-right") : "pgal-enter"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tag + counter */}
        <div className="pgal-card-top">
          <span className="pgal-tag">{p.tag}</span>
          <span className="pgal-counter">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
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
      <button
        className="pgal-arrow pgal-arrow-prev"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        aria-label="Anterior"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="pgal-arrow pgal-arrow-next"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        aria-label="Siguiente"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="pgal-dots" onClick={(e) => e.stopPropagation()}>
        {projects.map((_, i) => (
          <button
            key={i}
            className={`pgal-dot ${i === current ? "pgal-dot-active" : ""}`}
            onClick={() => go(i, i > current ? 1 : -1)}
          />
        ))}
      </div>

      {/* Close */}
      <button className="pgal-close" onClick={onClose} aria-label="Cerrar">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  return (
    <span className="hero-clock">
      {hh}
      <span className="hero-clock-colon">:</span>
      {mm}
      <span className="hero-clock-colon">:</span>
      {ss}
    </span>
  );
}

// ─── HERO BOOT ────────────────────────────────────────────────────────────────
function HeroBoot({ onStartStory }) {
  return (
    <section className="hero-boot">
      <div className="hero-center">
        <h1 className="hero-name-min">
          <span className="hero-nm-first">Matías</span>
          <span className="hero-nm-last">Giménez</span>
        </h1>
        <button
          className="hero-story-btn"
          onClick={() => {
            onStartStory?.();
          }}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          Explorar en 3D
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </button>
      </div>
    </section>
  );
}

// ─── FEATURED 3D SECTION ──────────────────────────────────────────────────────
function Featured3D({ onStartStory }) {
  return (
    <section
      className="reveal featured-3d-section"
      style={{
        maxWidth: 1200,
        margin: "80px auto",
        padding: "0 32px",
      }}
    >
      <div className="featured-3d-container" onClick={onStartStory}>
        <div className="featured-3d-content">
          <div className="featured-3d-tag">Experiencia Inmersiva</div>
          <h2 className="featured-3d-title">Explora mi Portfolio en 3D</h2>
          <p className="featured-3d-desc">
            Interactúa con mis proyectos en un entorno tridimensional. Camina por el galpón, descubre detalles y vive una experiencia única.
          </p>
          <button className="featured-3d-btn">
            Entrar al Mundo 3D
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </button>
        </div>
        <div className="featured-3d-image-wrap">
          <img src="public/preview3d.png" alt="3D Portfolio Preview" className="featured-3d-img" />
          <div className="featured-3d-overlay" />
        </div>
      </div>
    </section>
  );
}

// ─── PROJECT GRID ──────────────────────────────────────────────────
function ProjectGrid({ projects, onOpenMedia }) {
  return (
    <div className="proj-grid">
      {projects.map((p, i) => (
        <article
          key={p.name}
          className="proj-card reveal"
          style={{ transitionDelay: `${i * 0.07}s` }}
        >
          <div className="proj-card-media">
            <ProjectImageSlider images={p.images} onOpenGallery={onOpenMedia} />
          </div>
          <div className="proj-card-body">
            <div className="proj-card-header">
              <span className="tag-pill sage">{p.tag}</span>
              <span className="proj-card-year">{p.year || ""}</span>
            </div>
            <h3 className="proj-card-name">{p.name}</h3>
            <p className="proj-card-sub">{p.subtitle}</p>
            <p className="proj-card-desc">{p.description}</p>
            <div className="proj-card-links">
              {p.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  style={{ fontSize: 12, padding: "8px 16px" }}
                >
                  {link.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const [mediaModal, setMediaModal] = useState(null);
  const [storyActive, setStoryActive] = useState(false);
  const [storyUnlocked, setStoryUnlocked] = useState(true);
  const [storySession, setStorySession] = useState(0);
  const active = useActiveSection();
  useScrollReveal();
  useSmoothScroll();

  const handleOpenMedia = (arr) => setMediaModal(arr);
  const handleStartStory = () => {
    setStorySession((s) => s + 1);
    setStoryActive(true);
  };
  const handleFinishStory = () => setStoryUnlocked(true);

  const S = { maxWidth: 960, margin: "0 auto", padding: "0 32px" };
  const divider = { borderTop: "1px solid var(--border)", margin: 0 };

  return (
    <>
      <CustomCursor />
      <Navbar active={active} />

      <main style={{ minHeight: "100vh" }}>
        {/* HERO */}
        <HeroBoot onStartStory={() => setStoryActive(true)} />

        <Featured3D onStartStory={() => setStoryActive(true)} />

        {storyUnlocked && (
          <>
            <hr style={divider} />

            {/* ABOUT */}
            <section
              id="about"
              style={{ ...S, paddingTop: 72, paddingBottom: 72 }}
            >
              <SectionHeader num="01" label="Sobre mí" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.6fr",
                  gap: 56,
                  alignItems: "start",
                }}
              >
                <div className="reveal">
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 600,
                      color: "var(--ink)",
                      lineHeight: 1.2,
                      marginBottom: 24,
                    }}
                  >
                    Construyo software
                    <br />
                    <em style={{ color: "var(--sage)" }}>que escala.</em>
                  </h2>
                  {[
                    { label: "Rol", value: "Backend Developer" },
                    {
                      label: "Formación",
                      value: "Ing. en Sistemas (avanzado)",
                    },
                    { label: "Ubicación", value: "San Luis, Argentina" },
                    { label: "Idiomas", value: "Español, Inglés B2" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        gap: 16,
                        padding: "10px 0",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--ink-faint)",
                          width: 80,
                          flexShrink: 0,
                          paddingTop: 2,
                        }}
                      >
                        {item.label}
                      </span>
                      <span style={{ fontSize: 14, color: "var(--ink-mid)" }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="reveal reveal-delay-1">
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.8,
                      color: "var(--ink-mid)",
                      marginBottom: 16,
                    }}
                  >
                    Soy Analista en Sistemas orientado al desarrollo{" "}
                    <strong style={{ color: "var(--ink)" }}>Backend</strong> con
                    fuerte interés en arquitectura de software, IA aplicada e
                    infraestructura cloud.
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.8,
                      color: "var(--ink-muted)",
                      marginBottom: 24,
                    }}
                  >
                    Trabajo con mentalidad de producto: priorizo calidad
                    técnica, resultados medibles y soluciones que realmente
                    funcionan en producción.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      "Node.js",
                      "Express",
                      "MySQL",
                      "MongoDB",
                      "AWS",
                      "REST APIs",
                      "Docker",
                      "Prisma",
                    ].map((t) => (
                      <span key={t} className="tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="reveal reveal-delay-2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 56,
                  overflowX: "auto",
                  paddingBottom: 16,
                }}
              >
                <div style={{ color: "var(--ink)" }}>
                  <GitHubCalendar username="mateyyyy" colorScheme="dark" />
                </div>
              </div>
            </section>

            <hr style={divider} />

            {/* STACK */}
            <section
              id="stack"
              style={{ ...S, paddingTop: 72, paddingBottom: 72 }}
            >
              <SectionHeader num="02" label="Stack Tecnológico" />
              <SkillSynergyNetwork />
            </section>

            <hr style={divider} />

            {/* PROJECTS */}
            <section
              id="projects"
              style={{ ...S, paddingTop: 72, paddingBottom: 72 }}
            >
              <SectionHeader num="03" label="Proyectos" />
              <p
                className="reveal"
                style={{
                  fontSize: 13,
                  color: "var(--ink-muted)",
                  marginBottom: 24,
                  marginTop: -24,
                }}
              >
                Proyectos con impacto real y usuarios activos.
              </p>
              <ProjectGrid
                projects={mainProjects}
                onOpenMedia={handleOpenMedia}
              />
            </section>

            <hr style={divider} />

            {/* HOBBY */}
            <section
              id="hobby"
              style={{ ...S, paddingTop: 72, paddingBottom: 72 }}
            >
              <SectionHeader num="04" label="Proyectos Hobby" />
              <p
                className="reveal"
                style={{
                  fontSize: 13,
                  color: "var(--ink-muted)",
                  marginBottom: 24,
                  marginTop: -24,
                }}
              >
                Automatización, web scraping e Inteligencia Artificial aplicada.
              </p>
              <ProjectGrid
                projects={hobbyProjects}
                onOpenMedia={handleOpenMedia}
              />
            </section>

            <hr style={divider} />

            {/* LANDINGS */}
            <section
              id="landings"
              style={{ ...S, paddingTop: 72, paddingBottom: 72 }}
            >
              <SectionHeader num="05" label="Landing Pages" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  marginTop: 8,
                }}
              >
                {additionalProjects.map((p, i) => (
                  <div key={p.name} className={`reveal reveal-delay-${i}`}>
                    <LandingCard project={p} onOpenMedia={handleOpenMedia} />
                  </div>
                ))}
              </div>
            </section>

            <hr style={divider} />

            {/* CONTACT */}
            <section
              id="contact"
              style={{ ...S, paddingTop: 72, paddingBottom: 72 }}
            >
              <SectionHeader num="06" label="Contacto" />
              <div
                className="reveal"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 64,
                  alignItems: "center",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2.2rem,5vw,3.5rem)",
                      fontWeight: 700,
                      color: "var(--ink)",
                      lineHeight: 1.05,
                      marginBottom: 20,
                    }}
                  >
                    Trabajemos
                    <br />
                    <em style={{ color: "var(--sage)" }}>juntos.</em>
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--ink-muted)",
                      lineHeight: 1.7,
                      maxWidth: 360,
                    }}
                  >
                    Disponible para proyectos freelance, posiciones full-time o
                    simplemente para charlar sobre tecnología.
                  </p>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <a
                    href="mailto:matiasgimenez452@gmail.com"
                    className="btn-primary"
                    style={{ justifyContent: "center", padding: "14px 24px" }}
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
                  <div style={{ display: "flex", gap: 12 }}>
                    <a
                      href="https://www.linkedin.com/in/matias-gimenez-1a7a172bb/"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost"
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/mateyyyy"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost"
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer
              style={{
                borderTop: "1px solid var(--border)",
                padding: "24px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: 960,
                margin: "0 auto",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  color: "var(--ink-muted)",
                }}
              >
                Matías Giménez · 2025
              </span>
              <div style={{ display: "flex", gap: 20 }}>
                {[
                  { l: "GitHub", h: "https://github.com/mateyyyy" },
                  {
                    l: "LinkedIn",
                    h: "https://www.linkedin.com/in/matias-gimenez-1a7a172bb/",
                  },
                  { l: "Email", h: "mailto:matiasgimenez452@gmail.com" },
                ].map((a) => (
                  <a
                    key={a.l}
                    href={a.h}
                    target={a.h.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="footer-link"
                  >
                    {a.l}
                  </a>
                ))}
              </div>
            </footer>
          </>
        )}
      </main>

      <MediaModal mediaModal={mediaModal} setMediaModal={setMediaModal} />
      <PeekingBot />

      {!storyActive && (
        <button
          className="fab-3d-btn"
          onClick={() => setStoryActive(true)}
          style={{
            position: "fixed",
            bottom: "clamp(16px, 4vw, 32px)",
            right: "clamp(16px, 4vw, 32px)",
            zIndex: 50,
            background: "var(--ink-main, #1a1814)",
            color: "var(--bg-main, #fcfbf8)",
            border: "none",
            borderRadius: "30px",
            padding: "clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            transition: "transform 0.2s ease, opacity 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span className="fab-text">Ver 3D</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </button>
      )}
      <Suspense fallback={null}>
        <Story3D
          projects={storyTimeline}
          active={storyActive}
          onClose={() => setStoryActive(false)}
        />
      </Suspense>
    </>
  );
}

export default App;
