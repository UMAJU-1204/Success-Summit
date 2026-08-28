// Si por cualquier motivo el CDN de GSAP no carga (red lenta, bloqueador,
// firewall corporativo), el resto del sitio (carruseles, videos, contadores)
// debe seguir funcionando igual — por eso se protege cada uso de gsap/ScrollTrigger.
const hasGSAP = (typeof gsap !== 'undefined') && (typeof ScrollTrigger !== 'undefined');
if (hasGSAP) { gsap.registerPlugin(ScrollTrigger); }

/* ================= custom cursor ================= */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX=0, mouseY=0, ringX=0, ringY=0;
window.addEventListener('mousemove', e=>{
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX+'px'; dot.style.top = mouseY+'px';
});
(function loop(){
  ringX += (mouseX-ringX)*0.18;
  ringY += (mouseY-ringY)*0.18;
  ring.style.left = ringX+'px'; ring.style.top = ringY+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.team-member,.pillar-toggle,.tilt').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('grow'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('grow'));
});

/* ================= scroll progress bar ================= */
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const pct = (h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
  progressBar.style.width = pct+'%';
  document.getElementById('backTop').classList.toggle('visible', h.scrollTop > window.innerHeight);
});
document.getElementById('backTop').addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior:'smooth'});
});

/* ================= reveal on scroll ================= */
if (hasGSAP) {
  document.querySelectorAll('.reveal').forEach(el=>{
    gsap.to(el,{
      opacity:1, y:0, duration:0.9, ease:'power3.out',
      scrollTrigger:{trigger:el, start:'top 85%'}
    });
  });
} else {
  // Sin GSAP: mostrar todo de inmediato para que nada quede invisible.
  document.querySelectorAll('.reveal').forEach(el=>{
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

/* ================= marquee bands (CSS puro, no depende de GSAP) ================= */
document.querySelectorAll('.marquee-track').forEach(track=>{
  track.classList.add('marquee-css');
});

/* ================= blobs parallax on mouse ================= */
if (hasGSAP) {
  document.getElementById('hero').addEventListener('mousemove', e=>{
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    gsap.to('.blob-pink',{x:x*40, y:y*40, duration:0.6});
    gsap.to('.blob-blue',{x:-x*40, y:-y*40, duration:0.6});
  });
}

/* ================= magnetic buttons ================= */
if (hasGSAP) {
  document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      gsap.to(btn,{x:x*0.35, y:y*0.35, duration:0.3});
    });
    btn.addEventListener('mouseleave', ()=> gsap.to(btn,{x:0,y:0,duration:0.4,ease:'elastic.out(1,0.4)'}));
  });
}

/* ================= tilt on cards (method + project) ================= */
if (hasGSAP) {
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width - 0.5;
      const y = (e.clientY - r.top)/r.height - 0.5;
      gsap.to(card,{rotateY:x*8, rotateX:-y*8, scale:1.02, duration:0.4, transformPerspective:800});
    });
    card.addEventListener('mouseleave', ()=>{
      gsap.to(card,{rotateY:0, rotateX:0, scale:1, duration:0.5});
    });
  });
}

/* ================= portfolio tabs ================= */
const tabs = document.querySelectorAll('.tab-btn');
const cards = document.querySelectorAll('.project-card');
tabs.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    tabs.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const status = btn.dataset.status;
    cards.forEach(c=>{
      c.classList.toggle('show', c.dataset.status===status);
    });
  });
});

/* expand project detail */
document.querySelectorAll('.expand-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const card = btn.closest('.project-card');
    card.classList.toggle('expanded');
    btn.textContent = card.classList.contains('expanded') ? 'Ver menos −' : 'Ver detalle +';
  });
});

/* ================= count-up stats ================= */
document.querySelectorAll('.stat-num').forEach(el=>{
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (!hasGSAP) { el.textContent = target + suffix; return; }
  ScrollTrigger.create({
    trigger: el, start:'top 85%', once:true,
    onEnter:()=>{
      let obj={val:0};
      gsap.to(obj,{val:target, duration:1.8, ease:'power2.out',
        onUpdate:()=>{ el.textContent = Math.floor(obj.val)+suffix; }});
    }
  });
});

/* ================= confetti celebration ================= */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
function resizeCanvas(){canvas.width = window.innerWidth; canvas.height = window.innerHeight;}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const colors = ['#8CE86B','#FF9142','#2BB8FF','#FFD23F'];
let particles = [];
function burst(){
  for(let i=0;i<120;i++){
    particles.push({
      x: window.innerWidth/2,
      y: window.innerHeight/2,
      vx: (Math.random()-0.5)*18,
      vy: (Math.random()-0.9)*18,
      size: Math.random()*8+4,
      color: colors[Math.floor(Math.random()*colors.length)],
      life: 100
    });
  }
}
function animateConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.life -=1.4;
    ctx.globalAlpha = Math.max(p.life/100,0);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x,p.y,p.size,p.size);
  });
  particles = particles.filter(p=>p.life>0);
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateConfetti);
}
animateConfetti();
/* ================= fruto 2: confeti automático al llegar (2 veces) ================= */
(function(){
  const eco = document.getElementById('ecosistema');
  if(!eco) return;
  const ecoObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        burst();
        setTimeout(burst, 900);
        ecoObserver.unobserve(eco);
      }
    });
  }, {threshold:0.45});
  ecoObserver.observe(eco);
})();

/* ================= videos: NO autoplay — permanecen pausados hasta clic ================= */
/* (antes se reproducían muteados automáticamente al entrar en pantalla; ahora
   el usuario siempre debe dar clic en el ícono grande de play, ver setupVideo). */
/* ================= spotlight en tarjetas destacadas ================= */
document.querySelectorAll('.featured-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ================= digital grid effect (frases) ================= */
class DigitalGrid{
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mouse = {x:-9999, y:-9999};
    this.ripples = [];
    this.gap = 40;
    this.resize();
    window.addEventListener('resize', ()=> this.resize());
    canvas.addEventListener('mousemove', e=>{
      const r = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', ()=>{ this.mouse.x=-9999; this.mouse.y=-9999; });
    canvas.addEventListener('click', e=>{
      const r = canvas.getBoundingClientRect();
      this.ripples.push({x:e.clientX-r.left, y:e.clientY-r.top, r:0, alpha:1});
    });
    this.animate();
  }
  resize(){
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = r.width;
    this.canvas.height = r.height;
    this.buildGrid();
  }
  buildGrid(){
    this.points = [];
    for(let x=0; x<this.canvas.width+this.gap; x+=this.gap){
      for(let y=0; y<this.canvas.height+this.gap; y+=this.gap){
        this.points.push({ox:x, oy:y});
      }
    }
  }
  animate(){
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.points.forEach(p=>{
      const dx = this.mouse.x - p.ox, dy = this.mouse.y - p.oy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      let push = dist < 130 ? (130-dist)/130 : 0;

      let rippleBoost = 0;
      this.ripples.forEach(rp=>{
        const rdx = rp.x - p.ox, rdy = rp.y - p.oy;
        const rdist = Math.sqrt(rdx*rdx + rdy*rdy);
        const band = Math.abs(rdist - rp.r);
        if(band < 34){ rippleBoost = Math.max(rippleBoost, (34-band)/34 * rp.alpha); }
      });

      const size = 1.2 + push*3.2 + rippleBoost*4.5;
      const alpha = 0.12 + push*0.55 + rippleBoost*0.7;

      ctx.beginPath();
      ctx.fillStyle = `rgba(140,232,107,${Math.min(alpha,1)})`;
      ctx.arc(p.ox, p.oy, size, 0, Math.PI*2);
      ctx.fill();
    });

    this.ripples.forEach(rp=>{ rp.r += 7; rp.alpha -= 0.014; });
    this.ripples = this.ripples.filter(rp=> rp.alpha > 0);

    requestAnimationFrame(()=> this.animate());
  }
}
document.querySelectorAll('.digital-canvas').forEach(c => new DigitalGrid(c));


// ================================================================
// MÉTODO
// ================================================================
(function() {
  // Buscar los elementos (USANDO LAS CLASES CORRECTAS de tu HTML)
  const cards = document.querySelectorAll('.method-card');  // ✅ method-card (no method-card-lg)
  const dots = document.querySelectorAll('.method-dot');
  const prevBtn = document.getElementById('methodPrev');
  const nextBtn = document.getElementById('methodNext');
  
  // Si no hay tarjetas, salir
  if (!cards.length) {
    console.warn('⚠️ No se encontraron tarjetas .method-card');
    return;
  }
  
  let current = 0;
  const total = cards.length;

  console.log('✅ Método iniciado:', { total, cards: cards.length, dots: dots.length });

  function update(index) {
    // Validar límites
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    current = index;

    // 1. Actualizar tarjetas (method-card)
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });

    // 2. Actualizar dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    // 3. Actualizar botones
    if (prevBtn) {
      prevBtn.disabled = (current === 0);
      prevBtn.style.opacity = current === 0 ? '0.2' : '1';
      prevBtn.style.cursor = current === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
      nextBtn.disabled = (current === total - 1);
      nextBtn.style.opacity = current === total - 1 ? '0.2' : '1';
      nextBtn.style.cursor = current === total - 1 ? 'not-allowed' : 'pointer';
    }
  }

  // ================================================================
  // EVENTOS DE BOTONES
  // ================================================================
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      update(current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      update(current + 1);
    });
  }

  // ================================================================
  // EVENTOS DE DOTS
  // ================================================================
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      update(index);
    });
  });

  // ================================================================
  // TECLADO (Flechas izquierda/derecha)
  // ================================================================
  document.addEventListener('keydown', function(e) {
    const section = document.getElementById('metodo');
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      update(current - 1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      update(current + 1);
    }
  });

  // ================================================================
  // SWIPE EN MÓVILES
  // ================================================================
  let touchStartX = 0;
  const container = document.querySelector('.method-container');

  if (container) {
    container.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', function(e) {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          update(current + 1);
        } else {
          update(current - 1);
        }
      }
    }, { passive: true });
  }

  // ================================================================
  // INICIAR - Mostrar la primera tarjeta
  // ================================================================
  update(0);
})();

/* Los proyectos de cada rama ahora se muestran siempre — solo se revelan
   visualmente al hacer scroll (ver animación .branch-card más abajo). Ya no
   existe el botón "Ver proyectos" ni el acordeón que ocultaba el contenido. */

/* ================= ramas: proyectos entrando tipo rama (zigzag) ================= */
if (hasGSAP) {
  document.querySelectorAll('.branch-card').forEach(card=>{
    gsap.to(card, {
      opacity:1, x:0, duration:1, ease:'power3.out',
      scrollTrigger:{trigger:card, start:'top 88%'}
    });
  });
} else {
  document.querySelectorAll('.branch-card').forEach(card=>{
    card.style.opacity = 1;
    card.style.transform = 'none';
  });
}

/* ================= frutos: barras de felicidad antes/ahora ================= */
document.querySelectorAll('.impact-bar-fill').forEach(fill=>{
  const pct = parseFloat(fill.dataset.percent) || 0;
  const pctLabel = fill.parentElement.nextElementSibling;
  if (!hasGSAP) {
    fill.style.height = pct + '%';
    if (pctLabel) pctLabel.textContent = Math.round(pct) + '%';
    return;
  }
  ScrollTrigger.create({
    trigger: fill, start:'top 90%', once:true,
    onEnter:()=>{
      gsap.to(fill,{height:pct+'%', duration:1.6, ease:'power3.out'});
      if(pctLabel){
        let obj={val:0};
        gsap.to(obj,{val:pct, duration:1.6, ease:'power3.out',
          onUpdate:()=>{ pctLabel.textContent = Math.round(obj.val)+'%'; }});
      }
    }
  });
});

/* ================= frutos: contador genérico para [data-target] ================= */
document.querySelectorAll('[data-target]').forEach(el=>{
  const target = parseFloat(el.dataset.target);
  if(isNaN(target)) return;
  const decimals = parseInt(el.dataset.decimals) || 0;
  if (!hasGSAP) {
    el.textContent = decimals ? target.toFixed(decimals) : Math.floor(target);
    return;
  }
  ScrollTrigger.create({
    trigger: el, start:'top 88%', once:true,
    onEnter:()=>{
      let obj={val:0};
      gsap.to(obj,{val:target, duration:1.8, ease:'power2.out',
        onUpdate:()=>{ el.textContent = decimals ? obj.val.toFixed(decimals) : Math.floor(obj.val); }});
    }
  });
});

/* ================= fruto 1: anillo de progreso (plan de calidad) ================= */
document.querySelectorAll('.progress-ring').forEach(ring=>{
  const pct = parseFloat(ring.dataset.percent) || 0;
  const fill = ring.querySelector('.ring-fill');
  if(!fill) return;
  const r = parseFloat(fill.getAttribute('r')) || 88;
  const circumference = 2 * Math.PI * r;
  fill.style.strokeDasharray = circumference;
  fill.style.strokeDashoffset = circumference;
  if (!hasGSAP) {
    fill.style.strokeDashoffset = circumference * (1 - pct/100);
    return;
  }
  ScrollTrigger.create({
    trigger: ring, start:'top 88%', once:true,
    onEnter:()=>{
      const offset = circumference * (1 - pct/100);
      gsap.to(fill,{strokeDashoffset:offset, duration:1.8, ease:'power3.out'});
    }
  });
});

/* La tira de fotos de "Tierra Fértil" ahora es una animación CSS pura
   (equipoMarqueeScroll) — todas las fotos se mueven juntas en un loop
   continuo, sin necesitar JS. Ver .equipo-marquee-track en styles.css. */

/* ================= subproyectos: mini carrusel de 3 fotos por tarjeta ================= */
(function(){
  const carousels = document.querySelectorAll('.sub-carousel');
  if(!carousels.length) return;

  const controllers = [];
  carousels.forEach(carousel=>{
    const slides = Array.from(carousel.querySelectorAll('.sub-slide'));
    if(slides.length < 2) return;
    let idx = 0;
    let timer = null;
    function showSlide(next){
      slides[idx].classList.remove('is-active');
      idx = next;
      slides[idx].classList.add('is-active');
    }
    function start(){
      if(timer) return;
      timer = setInterval(()=> showSlide((idx+1) % slides.length), 4000);
    }
    function stop(){
      clearInterval(timer);
      timer = null;
    }
    controllers.push({el:carousel, start, stop});
  });

  const subObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const ctrl = controllers.find(c=>c.el===entry.target);
      if(!ctrl) return;
      if(entry.isIntersecting) ctrl.start(); else ctrl.stop();
    });
  }, {threshold:0.3});
  controllers.forEach(c=> subObserver.observe(c.el));
})();

// ================================================================
// VIDEOS — autoplay muteado al entrar en pantalla + clic en
// CUALQUIER parte de esa pantalla para reproducir/pausar (toggle)
// ================================================================
function setupVideo(videoId, wrapSelector) {
  const video = document.getElementById(videoId);
  const wrap = document.querySelector(wrapSelector);
  if (!video || !wrap) return;

  function syncHint() {
    // El ícono grande de play solo debe ocultarse cuando el video ya se está
    // reproduciendo CON audio (tras el clic del usuario). Mientras solo es la
    // vista previa muda automática, el ícono permanece visible invitando a
    // dar play.
    wrap.classList.toggle('is-playing', !video.paused && !video.muted);
  }
  video.addEventListener('volumechange', syncHint);

  video.addEventListener('play', syncHint);
  video.addEventListener('pause', syncHint);
  syncHint();

  // El presentador de clicker también puede disparar el video (ver bloque
  // "MODO CLICKER"). Además, cualquier clic directo sobre el video/ícono de
  // play lo reproduce de inmediato con audio, sin depender del avance del
  // presentador — así siempre hay que "dar play" para escuchar el audio.
  wrap.addEventListener('click', (e) => {
    e.stopPropagation();
    if (video.paused) {
      video.muted = false;
      video.dataset.presenterPlayed = '1';
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  });
}

setupVideo('video1', '#videoUno .video-wrap');
setupVideo('video2', '#metodo .video-wrap');
setupVideo('videoCierre', '#cierreVideoWrap');

const nav = document.querySelector('.nav');
const trigger = document.querySelector('.nav-trigger');

// Ocultar al hacer scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  
  if (currentScroll > 100) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }
});

// Mostrar al pasar mouse en la zona superior
trigger.addEventListener('mouseenter', () => {
  nav.classList.remove('hidden');
});

// Mostrar al pasar mouse sobre el nav
nav.addEventListener('mouseenter', () => {
  nav.classList.remove('hidden');
});

// Volver a ocultar si el mouse sale del nav y no está en el trigger
nav.addEventListener('mouseleave', () => {
  if (window.scrollY > 100) {
    setTimeout(() => {
      if (!nav.matches(':hover') && !trigger.matches(':hover')) {
        nav.classList.add('hidden');
      }
    }, 300);
  }
});


// ================================================================
// MODO CLICKER — cada click (o tecla de control remoto / mouse)
// avanza a la siguiente parte de la presentación: siguiente sección,
// reproducir video con sonido, abrir rama, destacar cada sub-proyecto.
// ================================================================
(function () {

  // ---------- utilidades ----------
  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  const FLASH_COLORS = ['#8CE86B', '#FF9142', '#2BB8FF', '#FFD23F'];
  let flashCursor = 0;

  function flashSectionButtons(section) {
    if (!section) return;
    const color = FLASH_COLORS[flashCursor % FLASH_COLORS.length];
    flashCursor++;
    const targets = qa(
      '.btn, .pillar-toggle, .status-chip, .celebrate-btn, .nav-cta, .savings-card, .impact-bar-col, .leadtime-row',
      section
    );
    targets.forEach((el) => {
      el.style.setProperty('--flash-color', color);
      el.classList.remove('clicker-flash');
      // fuerza reflow para poder re-disparar la animación en clicks seguidos
      void el.offsetWidth;
      el.classList.add('clicker-flash');
      setTimeout(() => el.classList.remove('clicker-flash'), 800);
    });
  }

  function flashEl(el, color) {
    if (!el) return;
    el.style.setProperty('--flash-color', color || FLASH_COLORS[flashCursor % FLASH_COLORS.length]);
    el.classList.remove('clicker-flash');
    void el.offsetWidth;
    el.classList.add('clicker-flash');
    setTimeout(() => el.classList.remove('clicker-flash'), 900);
  }

  // ---------- etiquetas legibles para el HUD ----------
  const SECTION_LABELS = {
    hero: 'Inicio',
    videoUno: 'Nuestra historia',
    equipo: 'Tierra fértil · Equipo',
    metodo: 'Nuestras raíces',
    tronco: 'Tronco · Modelo',
    quote3: 'Frase',
    ramas: 'Ramas · Portada',
    'rama-1': 'Rama 1 · GIT en la Nube',
    'rama-2': 'Rama 2 · Procesos Inteligentes',
    'rama-3': 'Rama 3 · Nuevas tecnologías',
    resultados: 'Frutos · Plan de Calidad',
    ecosistema: 'Frutos · Licenciamiento',
    felicidad: 'Frutos · Felicidad',
    leadtime: 'Frutos · Lead time',
    cierre: 'Cierre · Eslogan',
    cierreVideo: 'Cierre · Video de despedida',
    footerSection: 'Cierre · Pie de página'
  };

  // ---------- HUD ----------
  const hud = document.getElementById('clickerHud');
  function updateHud(sectionId) {
    if (!hud) return;
    const label = SECTION_LABELS[sectionId] || sectionId || 'Inicio';
    q('.hud-label', hud).textContent = label;
    q('.hud-count', hud).textContent = Presenter.pointer() + ' / ' + Presenter.total();
  }

  // ---------- construir la secuencia de pasos ----------
  const SECTION_CONFIG = [
    { id: 'videoUno', video: 'video1' },
    { id: 'equipo' },
    { id: 'metodo', video: 'video2' },
    { id: 'tronco' },
    { id: 'quote3' },
    { id: 'ramas' },
    { id: 'rama-1', pillar: true },
    { id: 'rama-2', pillar: true },
    { id: 'rama-3', pillar: true },
    { id: 'resultados' },
    { id: 'ecosistema' },
    { id: 'felicidad' },
    { id: 'leadtime' },
    { id: 'cierre' },
    { id: 'cierreVideo', video: 'videoCierre' },
    { id: 'footerSection' }
  ];

  function buildSteps() {
    const steps = [];
    SECTION_CONFIG.forEach((cfg) => {
      const section = document.getElementById(cfg.id);
      if (!section) return;

      steps.push({ type: 'scroll', sectionId: cfg.id, section: section });

      if (cfg.video) {
        const video = document.getElementById(cfg.video);
        if (video) steps.push({ type: 'video', sectionId: cfg.id, section: section, video: video });
      }

      if (cfg.pillar) {
        const toggle = q('.pillar-toggle', section);
        if (toggle) steps.push({ type: 'toggle', sectionId: cfg.id, section: section, toggle: toggle });
        qa('.sub-card', section).forEach((card) => {
          steps.push({ type: 'card', sectionId: cfg.id, section: section, card: card });
        });
      }
    });
    return steps;
  }

  // ---------- ejecutar un paso ----------
  function executeStep(step) {
    if (!step) return;

    if (step.type === 'scroll') {
      step.section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else if (step.type === 'video') {
      step.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const v = step.video;
      v.muted = false;
      if (!v.dataset.presenterPlayed) {
        v.currentTime = 0;
      }
      v.dataset.presenterPlayed = '1';
      v.play().catch(() => {
        // si el navegador bloquea audio, reintenta silenciado
        v.muted = true;
        v.play().catch(() => {});
      });
      const hint = q('.video-click-hint', step.section);
      flashEl(hint);

    } else if (step.type === 'toggle') {
      const pillar = step.toggle.closest('.pillar');
      if (pillar && !pillar.classList.contains('open')) {
        step.toggle.click();
      }
      step.toggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flashEl(step.toggle);

    } else if (step.type === 'card') {
      step.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flashEl(step.card);
    }

    flashSectionButtons(step.section);
    updateHud(step.sectionId);
  }

  // ---------- controlador ----------
  const Presenter = (function () {
    let steps = [];
    let ptr = 0; // índice del PRÓXIMO paso a ejecutar
    const videoStepIndex = new Map();

    function init() {
      steps = buildSteps();
      steps.forEach((s, i) => {
        if (s.type === 'video') videoStepIndex.set(s.video, i);
      });

      // videos: sin loop + al terminar, avanzar automáticamente
      videoStepIndex.forEach((idx, video) => {
        video.removeAttribute('loop');
        video.addEventListener('ended', () => {
          if (ptr === idx + 1) next();
        });
      });

      updateHud(null);
    }

    function next() {
      if (ptr >= steps.length) return;
      const step = steps[ptr];
      executeStep(step);
      ptr++;
    }

    function prev() {
      if (ptr <= 0) {
        const hero = document.getElementById('hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
        ptr = 0;
        updateHud(null);
        return;
      }
      ptr--;
      executeStep(steps[ptr]);
    }

    function jumpToSection(id) {
      if (id === 'hero') {
        const hero = document.getElementById('hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
        ptr = 0;
        updateHud(null);
        return;
      }
      const idx = steps.findIndex((s) => s.sectionId === id);
      if (idx === -1) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      executeStep(steps[idx]);
      ptr = idx + 1;
    }

    return {
      init: init,
      next: next,
      prev: prev,
      jumpToSection: jumpToSection,
      pointer: function () { return ptr; },
      total: function () { return steps.length; }
    };
  })();

  Presenter.init();
  window.Presenter = Presenter; // disponible por si se quiere depurar desde consola

  // ---------- elementos que NO deben disparar el avance genérico ----------
  // (ya tienen su propio comportamiento al hacer click directo sobre ellos)
  const NO_ADVANCE_SELECTOR = [
    'a', '.pillar-toggle', '.celebrate-btn', '.back-top',
    '.expand-btn', '.tab-btn', '.nav', 'input', 'textarea', 'select'
  ].join(', ');

  document.addEventListener('click', (e) => {
    if (e.target.closest(NO_ADVANCE_SELECTOR)) return;
    Presenter.next();
  });

  // ---------- enlaces internos (#nav, CTA) sincronizados con el presentador ----------
  qa('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      Presenter.jumpToSection(id);
    });
  });

  // ---------- botón "volver arriba" también reinicia el presentador ----------
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      Presenter.jumpToSection('hero');
    });
  }

  // ---------- teclado: flechas / espacio / retroceso ----------
  document.addEventListener('keydown', (e) => {
    const advanceKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Spacebar', 'Enter'];
    const backKeys = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'];
    if (advanceKeys.indexOf(e.key) !== -1) {
      e.preventDefault();
      Presenter.next();
    } else if (backKeys.indexOf(e.key) !== -1) {
      e.preventDefault();
      Presenter.prev();
    }
  });

})();
