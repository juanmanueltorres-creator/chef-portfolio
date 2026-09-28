import { useEffect } from 'react';
import { AsciiImage } from './components/AsciiImage';
import { CollageImage } from './components/CollageImage';
import { OperationsFlow } from './components/OperationsFlow';
import { SectionLabel } from './components/SectionLabel';
import { chefPhoto, contacts, disciplines, experience, shiftPhotos, skills, teamPhoto, work } from './data/content';

function useEditorialMotion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .flow-reveal').forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .flow-reveal').forEach((node) => revealObserver.observe(node));

    const hero = document.querySelector<HTMLElement>('.hero__photo');
    let frame = 0;
    const onScroll = () => {
      if (!hero || reduced || window.matchMedia('(max-width: 760px)').matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => hero.style.setProperty('--parallax-y', `${Math.min(25, window.scrollY * 0.035)}px`));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      revealObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

function Hero() {
  return (
    <header className="hero" id="top">
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <nav className="masthead" aria-label="Navegación principal">
        <a href="#top" className="wordmark" aria-label="Juan Manuel Torres, home"><span>JMT</span><span className="wordmark__dot">●</span></a>
        <span className="masthead__location">CÓRDOBA, ARGENTINA</span>
        <div className="masthead__links"><a href="#work">TRABAJO</a><a href="#contact">CONTACTO <span aria-hidden="true">↗</span></a></div>
      </nav>
      <div className="hero__stage">
        <CollageImage className="hero__photo" src={chefPhoto} alt="Kitchen team at the counter, shown in the full group context" position="center 43%" caption="BEHIND EVERY PLATE / THERE’S A SHIFT" loading="eager" />
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow"><span>NOTAS DE TURNO Nº 01</span><span>2019 — 2026</span></p>
          <h1><span>JUAN</span><span>MANUEL</span><span>TORRES</span></h1>
          <p className="hero__disciplines">OPERACIONES <i>·</i> COCINA <i>·</i> PIZZA <i>·</i> BURGERS</p>
        </div>
        <span className="hero__crosshair" aria-hidden="true">+</span>
      </div>
      <div className="hero__bottom">
        <span>COCINAS REALES.<br />SERVICIO REAL.<br />OPERACIÓN REAL.</span>
        <nav className="shift-arc" aria-label="Explorar el turno"><a href="#systems"><b>01</b> PREPARACIÓN</a><a href="#shift"><b>02</b> CALOR</a><a href="#work"><b>03</b> ÚLTIMO PEDIDO</a><a href="#exhale"><b>04</b> RESPIRAR</a></nav>
        <span className="hero__bottom-meta">CÓRDOBA, ARGENTINA<br />COCINA / PRODUCCIÓN</span>
      </div>
    </header>
  );
}

function StationVisual({ visual }: { visual: string }) {
  if (visual === 'operations') {
    return <AsciiImage src={chefPhoto} alt="Kitchen team working behind the counter" position="center 43%" caption="SHIFT / 01" />;
  }
  if (visual === 'team') {
    return <AsciiImage src={teamPhoto} alt="Kitchen team together" position="center 45%" caption="PEOPLE / 05" />;
  }
  return (
    <div className={`station-visual station-visual--${visual}`} role="img" aria-label={`${visual} station schematic`}>
      <span className="station-visual__index">STATION / SCHEMATIC</span>
      {visual === 'pizza' && <><span className="pizza-ring" /><span className="pizza-mark pizza-mark--one" /><span className="pizza-mark pizza-mark--two" /><span className="pizza-mark pizza-mark--three" /><span className="station-visual__word">OVEN</span></>}
      {visual === 'burgers' && <><span className="burger-layer burger-layer--top" /><span className="burger-layer burger-layer--middle" /><span className="burger-layer burger-layer--bottom" /><span className="station-visual__word">ASSEMBLY</span></>}
      {visual === 'service' && <div className="ticket-lines"><i /><i /><i /><i /><b>18:42</b></div>}
      <span className="station-visual__hint">SYSTEM / FIELD NOTE</span>
    </div>
  );
}

function FoodSystem() {
  return (
    <section className="food-system section-pad" id="systems" aria-labelledby="system-title">
      <SectionLabel number="01" light>PREPARACIÓN / CON QUÉ TRABAJO</SectionLabel>
      <div className="food-system__heading"><h2 id="system-title">CADA ESTACIÓN<br /><span>Tiene un ritmo</span></h2><p>Antes del calor está la preparación.<br />Antes del pedido, un sistema.</p></div>
      <div className="discipline-grid">
        {disciplines.map((item, index) => (
          <article className="discipline reveal" key={item.title}>
            <StationVisual visual={item.visual} />
            <div className="discipline__heading"><span>0{index + 1}</span><h3>{item.title}</h3></div>
            <p>{item.details.map((detail, i) => <span key={detail}>{detail}{i < item.details.length - 1 && <i aria-hidden="true"> / </i>}</span>)}</p>
          </article>
        ))}
      </div>
      <p className="system-note"><span aria-hidden="true">✳</span> UN TURNO. MUCHAS PIEZAS EN MOVIMIENTO.</p>
    </section>
  );
}

function KitchenSystem() {
  return (
    <section className="kitchen-system section-pad" aria-labelledby="kitchen-title">
      <SectionLabel number="02" >EL MÉTODO / MISE EN PLACE</SectionLabel>
      <div className="system-statement reveal">
        <h2 id="kitchen-title">UNA COCINA<br /><span>ES UN SISTEMA</span></h2>
        <div className="system-statement__copy"><p>Los ingredientes se vuelven mise en place.<br />La mise en place se vuelve producción.<br />La producción se vuelve servicio.<br />El servicio depende de las personas.</p><p className="system-statement__last">Las operaciones conectan todo.</p></div>
      </div>
      <OperationsFlow />
      <div className="system-foot"><span>ENTRADA → SALIDA</span><span>EL TRABAJO ESTÁ EN LAS CONEXIONES.</span></div>
    </section>
  );
}

function Shift() {
  return (
    <section className="shift-section section-pad" id="shift" aria-labelledby="shift-title">
      <SectionLabel number="02B" light>CALOR / DENTRO DEL TURNO</SectionLabel>
      <div className="shift-heading reveal"><h2 id="shift-title">DENTRO DEL TURNO</h2><div><p>PERSONAS / PRESIÓN / PREPARACIÓN / REPETICIÓN</p><span>La comida es lo que se ve.<br />La operación es todo lo que hay detrás.</span></div></div>
      <div className="shift-collage" aria-label="Real kitchen photographs, shown in distinct editorial crops">
        {shiftPhotos.map((photo) => <CollageImage key={photo.variant} className={`shift-frame shift-frame--${photo.variant}`} src={photo.src} alt={photo.alt} position={photo.position} caption={photo.caption} />)}
        <span className="shift-collage__stamp" aria-hidden="true">ON<br />THE<br />LINE</span>
      </div>
      <div className="shift-years"><span>2019</span><span>2022</span><span>2026</span><small>AÑOS EN LA PRÁCTICA</small></div>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience-section section-pad" aria-labelledby="experience-title">
      <SectionLabel number="03" light>EXPERIENCE</SectionLabel>
      <div className="experience-heading"><p className="eyebrow">UNA PRÁCTICA EN MOVIMIENTO</p><h2 id="experience-title">2019 — 2026<br /><span>DETRÁS DEL MOSTRADOR</span></h2></div>
      <div className="experience-layout">
        <ol className="experience-list">
          {experience.map((item, index) => <li key={item.period} className="experience-item reveal"><span className="experience-item__number">{item.period}</span><div><h3>{item.label}</h3><p>{item.note}</p></div><span className="experience-item__arrow" aria-hidden="true">↗</span><span className="experience-item__index">0{index + 1}</span></li>)}
        </ol>
        <aside className="skills-list"><span className="eyebrow">CONOCIMIENTOS DE TRABAJO</span><div>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></aside>
      </div>
    </section>
  );
}

const stations = ['PIZZA', 'BURGERS', 'PREPARACIÓN', 'DELIVERY'];
const priorities = ['VELOCIDAD', 'CONSISTENCIA', 'COMUNICACIÓN', 'FLUJO LIMPIO'];

function Dashboard() {
  return (
    <section className="dashboard-section section-pad" aria-label="Static service study">
      <SectionLabel number="04" light>ESTUDIO DE SERVICIO</SectionLabel>
      <div className="dashboard-head"><div><span className="eyebrow">ÚLTIMO PEDIDO / EL PISO EN UN VISTAZO</span><h2>SERVICIO<br /><span>EN MOVIMIENTO</span></h2></div></div>
      <div className="dashboard-grid">
        <div className="dashboard-cell dashboard-cell--status"><span>01 / ESTADO DEL SERVICIO</span><strong><i /> ACTIVO</strong><small>EL TURNO ESTÁ EN MOVIMIENTO</small></div>
        <div className="dashboard-cell dashboard-cell--peak"><span>02 / VENTANA DE MAYOR RITMO</span><strong>18:42</strong><small>UN MOMENTO DEL SERVICIO</small></div>
        <div className="dashboard-cell dashboard-cell--stations"><span>03 / ESTACIONES</span><ul>{stations.map((station, i) => <li key={station}><i />{station}<b>0{i + 1}</b></li>)}</ul></div>
        <div className="dashboard-cell dashboard-cell--priorities"><span>04 / PRIORIDADES</span><ol>{priorities.map((priority, i) => <li key={priority}><b>0{i + 1}</b>{priority}</li>)}</ol></div>
      </div>
      <p className="dashboard-foot">Comunicación clara. Relevos limpios. Un pedido por vez.</p>
    </section>
  );
}

function Work() {
  return (
    <section className="work-section section-pad" id="work" aria-labelledby="work-title">
      <SectionLabel number="05" >ÚLTIMO PEDIDO / TRABAJO REAL</SectionLabel>
      <div className="work-heading"><h2 id="work-title">EL TRABAJO<br />LA PRUEBA</h2><p>SERVICIO REAL<br />SISTEMA EN MARCHA</p></div>
      <div className="work-grid">
        {work.map((item) => <article className={`work-card work-card--${item.variant} reveal`} key={item.number}>
          {item.image ? <CollageImage className="work-art__photo" src={item.image.src} alt={item.image.alt} /> : <div className={`work-art work-art--${item.variant}`} role="img" aria-label={`${item.title.toLowerCase()} estación esquemática editorial`}><span className="work-art__cross" aria-hidden="true">+</span><strong className="work-art__title">{item.title}</strong><span className="work-art__code">STATION 03<br />ASSEMBLY / OUTPUT</span><span className="work-art__graphic" aria-hidden="true" /></div>}
          <div className="work-card__meta"><span>{item.number} — {item.title}</span><span>{item.meta}</span></div>
        </article>)}
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="team-section section-pad" aria-labelledby="team-title">
      <SectionLabel number="06" >LAS PERSONAS</SectionLabel>
      <div className="team-layout">
        <div className="team-copy"><p className="eyebrow">NINGUNA ESTACIÓN TRABAJA SOLA</p><h2 id="team-title">LAS PERSONAS<br /><span>HACEN<br />FUNCIONAR<br />LA OPERACIÓN</span></h2><p className="team-copy__body">Las cocinas se construyen con coordinación, confianza y repetición.</p><span className="team-copy__arrow" aria-hidden="true">↗</span></div>
        <AsciiImage className="team-photo" src={teamPhoto} alt="A kitchen team standing together" position="center 45%" caption="BUILT TOGETHER" />
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="statement-section" aria-labelledby="statement-title">
      <SectionLabel number="07" light>EL PICO / LA PRESIÓN</SectionLabel>
      <div className="statement-words" id="statement-title"><span>FOOD</span><span>SYSTEMS</span><span>PEOPLE</span></div>
      <div className="statement-bottom"><p>Trabajar en cocinas me enseñó<br />a pensar en flujos de trabajo.</p><p>ENTRADAS.<br />CUELLOS DE BOTELLA.<br />TIEMPOS.<br />CONSISTENCIA.<br />PERSONAS.</p><p>ESA FORMA DE PENSAR<br />NUNCA SE FUE.</p></div>
      <span className="statement-cross" aria-hidden="true">×</span>
    </section>
  );
}

function Exhale() {
  return (
    <section className="exhale-section section-pad" id="exhale" aria-labelledby="exhale-title">
      <SectionLabel number="08" light>DESPUÉS DEL SERVICIO / RESPIRAR</SectionLabel>
      <div className="exhale-layout"><div><p className="eyebrow">SALE EL ÚLTIMO PEDIDO</p><h2 id="exhale-title">Y DESPUÉS,<br /><span>RESPIRAMOS</span></h2><p className="exhale-copy">Una bebida fría.<br />Un momento para descansar.</p></div><div className="fernet-collage" role="img" aria-label="Vaso de fernet con hielo, servido al final del turno"><CollageImage className="fernet-shot fernet-shot--main" src="/work/fernet-hielo.png" alt="Fernet con hielo servido desde una botella" position="58% 58%" caption="FERNET / HIELO" loading="eager" /><CollageImage className="fernet-shot fernet-shot--detail" src="/work/fernet-hielo.png" alt="Detalle del vaso y el hielo del fernet" position="79% 68%" caption="FRÍO / AMARGO" /><span className="fernet-collage__stamp">ÚLTIMO<br />TURNO</span><span className="fernet-collage__note">SERVIDO DESPUÉS<br />DEL SERVICIO</span></div></div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact-section section-pad" id="contact">
      <SectionLabel number="09" light>CUANDO ESTÉS LISTO</SectionLabel>
      <div className="contact-head"><p className="eyebrow">JUAN MANUEL TORRES<br />OPERACIONES · COCINA · PIZZA · BURGERS</p><h2>HABLEMOS</h2><span className="contact-head__mark" aria-hidden="true">JMT<br />↘</span></div>
      <div className="contact-bottom"><div><span className="eyebrow">CÓRDOBA · ARGENTINA</span><p>HECHO DE TURNOS REALES.</p></div><nav className="contact-links" aria-label="Enlaces de contacto">{contacts.filter((contact) => contact.href).map((contact) => <span className="contact-link" key={contact.label}><a href={contact.href} aria-label={`${contact.label}: ${contact.value || contact.href}`}><span>{contact.label}</span><b>{contact.value || contact.href} ↗</b></a></span>)}</nav></div>
      <a className="back-top" href="#top">VOLVER ARRIBA ↑</a>
    </footer>
  );
}

export function App() {
  useEditorialMotion();
  return <><Hero /><main id="main"><FoodSystem /><KitchenSystem /><Shift /><Experience /><Dashboard /><Work /><Team /><Statement /><Exhale /></main><Contact /></>;
}
