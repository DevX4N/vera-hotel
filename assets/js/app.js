/* =========================================================
   VÉRA — interações, galeria, journal e motor de reservas
   Sem dependências. Nenhum dado sai do navegador.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const IMG = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
  const WIDTHS = [480, 800, 1200, 1600, 2000];
  const srcset = id => WIDTHS.map(w => `${IMG(id, w)} ${w}w`).join(', ');
  const money = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function imgTag(id, alt = '', sizes = '100vw', cls = '') {
    return `<img ${cls ? `class="${cls}"` : ''} src="${IMG(id, 1200)}" srcset="${srcset(id)}" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" decoding="async" onload="this.classList.add('is-loaded')">`;
  }

  function hydrate(scope = document) {
    $$('img[data-u]', scope).forEach(img => {
      if (img.dataset.done) return;
      img.dataset.done = '1';
      const id = img.dataset.u;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.sizes = img.dataset.sizes || '100vw';
      img.srcset = srcset(id);
      img.src = IMG(id, 1200);
      const done = () => img.classList.add('is-loaded');
      if (img.complete && img.naturalWidth) done(); else img.addEventListener('load', done, { once: true });
    });
  }

  /* ---------------------------------------------------------
     DATA
     --------------------------------------------------------- */
  const ROOMS = {
    forest: {
      name: 'Forest Suite', size: 45, rate: 1290, img: '1615880484746-a134be9a6ecf', view: 'Vista para a floresta',
      perks: ['Banheira', 'Varanda privativa', 'Vista para a floresta', 'Cancelamento gratuito até 7 dias antes']
    },
    vera: {
      name: 'VÉRA Suite', size: 68, rate: 1890, img: '1596394516093-501ba68a0ba6', view: 'Vista panorâmica',
      perks: ['Lareira', 'Banheira', 'Terraço privativo', 'Cancelamento gratuito até 7 dias antes']
    },
    villa: {
      name: 'Private Villa', size: 110, rate: 2790, img: '1600585154340-be6161a56a0c', view: 'Deck sobre o vale',
      perks: ['Piscina privativa aquecida', 'Lareira', 'Deck panorâmico', 'Cancelamento gratuito até 7 dias antes']
    }
  };

  const EXTRAS = [
    { id: 'breakfast', name: 'Breakfast Experience', price: 120, per: 'night', img: '1482049016688-2d3e1b311543', desc: 'Café da manhã completo no deck ou no quarto, para dois.' },
    { id: 'dinner', name: 'Romantic Dinner', price: 480, img: '1414235077428-338989a2e8c0', desc: 'Sete tempos servidos no seu terraço, à luz de velas.' },
    { id: 'wine', name: 'Wine Experience', price: 290, img: '1506377247377-2a5b3b417ebb', desc: 'Degustação guiada de vinhos de altitude na adega.' },
    { id: 'massage', name: 'Massage', price: 320, img: '1544161515-4ab6ce6db874', desc: 'Massagem de 60 minutos com óleos da horta.' },
    { id: 'transfer', name: 'Airport Transfer', price: 250, img: '1447752875215-b2761acb3c5d', desc: 'Carro privativo entre o aeroporto e o VÉRA, um trecho.' }
  ];

  const GALLERY = [
    { id: '1600585154363-67eb9e2e2099', cat: 'architecture', cap: 'Pavilhão central ao anoitecer', r: '4/5' },
    { id: '1611892440504-42a792e24d32', cat: 'rooms', cap: 'Forest Suite, fim de tarde', r: '4/3' },
    { id: '1482192596544-9eb780fc7f66', cat: 'nature', cap: 'Neblina sobre a mata', r: '3/4' },
    { id: '1553361371-9b22f78e8b1d', cat: 'gastronomy', cap: 'Adega do TERRA', r: '4/5' },
    { id: '1745894118353-88e64617e064', cat: 'wellness', cap: 'Sauna a lenha', r: '1/1' },
    { id: '1776482128011-c707121f081a', cat: 'rooms', cap: 'Banheira da VÉRA Suite', r: '4/5' },
    { id: '1506905925346-21bda4d32df4', cat: 'nature', cap: 'Acima das nuvens, mirante leste', r: '3/2' },
    { id: '1432139555190-58524dae6a55', cat: 'gastronomy', cap: 'Menu de outono', r: '1/1' },
    { id: '1759300031446-88e81c8a26c9', cat: 'wellness', cap: 'Sauna finlandesa a lenha', r: '4/5' },
    { id: '1600573472592-401b489a3cdc', cat: 'architecture', cap: 'Brise de madeira da fachada norte', r: '4/3' },
    { id: '1753605788101-04d1e653e74a', cat: 'rooms', cap: 'Banho de luz, Private Villa', r: '1/1' },
    { id: '1511497584788-876760111969', cat: 'nature', cap: 'Primeira luz no vale', r: '4/5' },
    { id: '1560053608-13721e0d69e8', cat: 'gastronomy', cap: 'Salão do TERRA', r: '3/2' },
    { id: '1544367567-0f2fcb009e0b', cat: 'wellness', cap: 'Yoga ao entardecer', r: '3/2' },
    { id: '1600607687644-c7171b42498f', cat: 'rooms', cap: 'Quarto da Private Villa', r: '4/3' },
    { id: '1464822759023-fed622ff2c3b', cat: 'nature', cap: 'O vale visto do mirante', r: '4/3' },
    { id: '1504754524776-8f4f37790ca0', cat: 'gastronomy', cap: 'Café da manhã no deck', r: '4/5' },
    { id: '1600334129128-685c5582fd35', cat: 'wellness', cap: 'Pedras quentes', r: '4/3' }
  ];
  const CAT_LABEL = { architecture: 'Architecture', rooms: 'Rooms', nature: 'Nature', gastronomy: 'Gastronomy', wellness: 'Wellness' };

  const JOURNAL = [
    {
      slug: 'slowing-down', title: 'The Art of Slowing Down', cat: 'Ensaio', min: 6, date: 'Setembro 2026',
      img: '1519710164239-da123dc03ef4',
      excerpt: 'Desacelerar não é parar. É devolver a cada gesto o tempo que ele pede.',
      body: [
        'Nos primeiros dias, quase todos os hóspedes fazem a mesma coisa: acordam cedo, conferem o celular e procuram o que fazer. No terceiro dia, algo muda. O café da manhã se estende até as dez, a trilha vira um passeio sem mapa, o livro que veio na mala é finalmente aberto.',
        'Não é preguiça. É o corpo reencontrando um ritmo que a cidade vai apagando aos poucos: dormir quando escurece, acordar com a luz, comer quando se tem fome.',
        '<blockquote>O VÉRA não oferece um programa. Oferece espaço — e a permissão para não preenchê-lo.</blockquote>',
        'Por isso não há televisão nas suítes, nem uma agenda de atividades presa na porta. As experiências existem, e são muitas, mas nenhuma é obrigatória. O que mais ouvimos no check-out é alguma variação de “eu não fiz nada, e foi exatamente o que eu precisava”.',
        'Se você está chegando, um conselho da equipe: deixe o relógio na gaveta no primeiro dia. O sol avisa a hora do café, e a lareira avisa a hora de dormir.'
      ]
    },
    {
      slug: 'architecture', title: 'Architecture in Dialogue With Nature', cat: 'Arquitetura', min: 8, date: 'Agosto 2026',
      img: '1503387762-592deb58ef4e',
      excerpt: 'Como o Estúdio Campo Alto desenhou catorze suítes sem derrubar uma única araucária.',
      body: [
        'O primeiro levantamento do terreno não foi topográfico. Foi botânico. Antes de qualquer croqui, a equipe do Estúdio Campo Alto mapeou cada araucária com mais de vinte centímetros de diâmetro — foram 312 árvores.',
        'Os volumes do hotel nasceram dos vazios entre elas. Por isso nenhuma suíte é igual à outra: algumas giram alguns graus para desviar de um tronco, outras se elevam sobre pilotis para não tocar as raízes.',
        '<blockquote>A regra era simples: se a árvore estava aqui antes, ela fica. O projeto se adapta.</blockquote>',
        'Os materiais seguem a mesma lógica. O basalto dos muros saiu da escavação da própria obra. O concreto aparente foi moldado em fôrmas de tábua, e guarda a textura da madeira. As esquadrias de vidro duplo vão do piso ao teto, porque aqui a paisagem é o acabamento.',
        'Os beirais longos têm uma função precisa: no verão, bloqueiam o sol alto do meio-dia; no inverno, deixam o sol baixo entrar fundo nas suítes e aquecer o piso de concreto, que devolve esse calor durante a noite.'
      ]
    },
    {
      slug: 'weekend', title: 'A Weekend at VÉRA', cat: 'Roteiro', min: 5, date: 'Julho 2026',
      img: '1542718610-a1d656d1884c',
      excerpt: 'Sexta à tarde, domingo ao meio-dia. Um roteiro possível — e todos os desvios permitidos.',
      body: [
        'Sexta, 16h. Chegue com luz. Os últimos quatro quilômetros de estrada de terra são parte da experiência: é ali que o sinal do celular começa a falhar e a mata se fecha sobre o carro.',
        'Sexta, 19h. Sauna a lenha, ducha fria ao ar livre e ofurô sob o céu. Jante leve no TERRA e durma cedo.',
        'Sábado, 6h10. Vale a pena acordar para ver a neblina deixar o vale. O café é servido no deck, e ninguém tem pressa em tirar a mesa.',
        '<blockquote>Sábado é o dia de não decidir nada. A trilha das nascentes, um livro na biblioteca, uma massagem às três.</blockquote>',
        'Sábado, 20h. Jantar privativo no terraço, sete tempos à luz de velas. Depois, se o céu estiver limpo, o guia de astronomia leva você até o mirante.',
        'Domingo, 11h. Check-out até o meio-dia, mas a sauna segue aberta para você até a hora de partir.'
      ]
    },
    {
      slug: 'terra', title: 'Behind TERRA', cat: 'Gastronomia', min: 7, date: 'Junho 2026',
      img: '1551218808-94e220e084d2',
      excerpt: 'A chef Tereza Vidal sobre cozinhar com o que a serra oferece, e só com isso.',
      body: [
        'O cardápio do TERRA é escrito na segunda-feira, depois que a chef Tereza Vidal percorre a horta e recebe as ligações dos produtores do vale. Não existe uma carta fixa, e isso é deliberado.',
        '“Se a geada queimou a couve, não tem couve. Se choveu três dias seguidos, tem cogumelo na mata. A cozinha só precisa estar atenta.”',
        '<blockquote>Pinhão, truta de água fria, queijo serrano, mel de bracatinga. O território é a despensa.</blockquote>',
        'A adega segue a mesma filosofia: mais de trezentos rótulos, com foco nos vinhos de altitude de Santa Catarina, produzidos a menos de uma hora dali. As degustações acontecem numa sala escavada na encosta, onde a temperatura se mantém estável o ano inteiro.',
        'O menu degustação tem sete tempos e muda a cada semana. Restrições alimentares são recebidas com antecedência, e tratadas como ponto de partida, não como limitação.'
      ]
    },
    {
      slug: 'winter', title: 'Winter at VÉRA', cat: 'Estações', min: 4, date: 'Maio 2026',
      img: '1510798831971-661eb04b3739',
      excerpt: 'Geada nos campos, lareira acesa às quatro da tarde e o céu mais limpo do ano.',
      body: [
        'Entre junho e agosto, a temperatura na serra chega a ficar abaixo de zero nas madrugadas. É a estação preferida de boa parte da equipe — e de muitos hóspedes que voltam todo ano.',
        'As manhãs começam com os campos brancos de geada. Por volta das nove, o sol derrete tudo, e o vale reaparece verde.',
        '<blockquote>No inverno, a lareira é acesa às quatro da tarde e só apaga quando você dorme.</blockquote>',
        'O ar seco e frio deixa o céu especialmente limpo: é a melhor época para as sessões de observação das estrelas. O TERRA muda de ritmo, com caldos, pinhão, fondue de queijo serrano e vinhos tintos da região.',
        'Uma dica prática: traga casaco pesado, gorro e luvas. O resto — mantas, meias de lã, chá quente — nós providenciamos.'
      ]
    }
  ];

  const INSTA = ['1600585154363-67eb9e2e2099', '1495474472287-4d71bcdd2085', '1745894118353-88e64617e064', '1513836279014-a89f7a76ae86', '1553361371-9b22f78e8b1d', '1444703686981-a3abbc4d4fe3'];

  /* ---------------------------------------------------------
     SCROLL LOCK + FOCUS TRAP
     --------------------------------------------------------- */
  let locks = 0;
  const lock = () => {
    if (locks++ === 0) document.body.classList.add('is-locked');
    const c = document.getElementById('cursor'); if (c) c.classList.remove('is-on');
  };
  const unlock = () => { if (--locks <= 0) { locks = 0; document.body.classList.remove('is-locked'); } };

  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(el => el.offsetParent !== null || el === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  const toastEl = $('#toast');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
  }

  /* ---------------------------------------------------------
     HERO
     --------------------------------------------------------- */
  function initHero() {
    const slides = $$('.hero__slide');
    const caps = $$('.hero__caps li');
    slides[0].addEventListener('load', () => slides[0].classList.add('is-loaded'));
    // carrega os demais slides depois da primeira pintura
    const loadRest = () => slides.slice(1).forEach(s => {
      s.sizes = '100vw';
      s.srcset = srcset(s.dataset.src);
      s.src = IMG(s.dataset.src, 1600);
    });
    if (document.readyState === 'complete') setTimeout(loadRest, 800); else addEventListener('load', () => setTimeout(loadRest, 800));

    requestAnimationFrame(() => {
      root.classList.add('is-ready');
      $('.hero__title').classList.add('is-in');
    });

    if (reduced) return;
    let i = 0;
    setInterval(() => {
      if (document.hidden || scrollY > innerHeight) return;
      const next = (i + 1) % slides.length;
      if (!slides[next].complete || !slides[next].naturalWidth) return;
      slides[i].classList.remove('is-active');
      caps[i] && caps[i].classList.remove('is-active');
      i = next;
      slides[i].classList.add('is-active');
      caps[i] && caps[i].classList.add('is-active');
    }, 7000);
  }

  /* ---------------------------------------------------------
     REVEALS
     --------------------------------------------------------- */
  function initReveals() {
    $$('[data-split]').forEach(el => $$('.ln > span', el).forEach((s, i) => s.style.setProperty('--i', i)));
    const io = new IntersectionObserver(entries => {
      let n = 0;
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.hasAttribute('data-reveal')) el.style.setProperty('--d', `${(n++) * 90}ms`);
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('[data-split], [data-reveal], [data-mask], .loc__map').forEach(el => { if (!el.closest('.hero')) io.observe(el); });
    window.__vio = io;
  }

  /* ---------------------------------------------------------
     SCROLL ENGINE: header, relógio do dia, parallax, reel
     --------------------------------------------------------- */
  const hdr = $('#hdr');
  const dock = $('#dock'), clockTime = $('#dayclockTime'), clockLabel = $('#dayclockLabel'), clockDot = $('#dayclockDot');
  const mbar = $('#mbar'), foot = $('#footer');
  const navLinks = $$('.hdr__nav a');
  const navSecs = ['stay', 'experience', 'gastronomy', 'wellness', 'gallery', 'journal'].map(id => $('#' + id));
  const timed = $$('[data-time]');
  const darks = $$('[data-dark]');
  const parallaxEls = $$('[data-parallax]');
  const reel = $('#reel'), reelTrack = $('#reelTrack');
  const reelPhrases = $$('.reel__phrase');
  let reelOn = false, reelDist = 0;
  let lastY = scrollY;

  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const DAY_START = toMin('05:50'), DAY_END = toMin('23:40');
  const fmtMin = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`;

  function setupReel() {
    const desktop = innerWidth > 960 && !reduced;
    reelOn = desktop;
    if (!desktop) { reel.style.height = ''; reelTrack.style.transform = ''; return; }
    reelDist = Math.max(0, reelTrack.scrollWidth - innerWidth);
    reel.style.height = `${reelDist + innerHeight}px`;
  }

  function isDarkAt(y) {
    for (const s of darks) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom >= y) return true;
    }
    return false;
  }

  function onScroll() {
    const y = scrollY, vh = innerHeight;
    const heroH = $('.hero').offsetHeight;

    // header
    hdr.classList.toggle('is-solid', y > heroH - 90);
    if (!hdr.classList.contains('menu-open')) hdr.classList.toggle('is-hidden', y > heroH && y > lastY + 2);
    if (y < lastY - 2) hdr.classList.remove('is-hidden');
    lastY = y;

    // botões persistentes
    const past = y > heroH * 0.7;
    const inFooter = foot.getBoundingClientRect().top < vh * 0.75;
    dock.classList.toggle('is-on', past && !inFooter);
    mbar.classList.toggle('is-on', past && !inFooter);
    dock.classList.toggle('on-dark', isDarkAt(vh - 56));

    // relógio do dia: interpolação entre as horas das seções
    const mid = vh * 0.5;
    let minutes = DAY_START;
    for (let i = 0; i < timed.length; i++) {
      const r = timed[i].getBoundingClientRect();
      const t0 = toMin(timed[i].dataset.time);
      const t1 = timed[i + 1] ? toMin(timed[i + 1].dataset.time) : DAY_END;
      if (r.top <= mid && r.bottom > mid) {
        const p = clamp((mid - r.top) / r.height, 0, 1);
        minutes = t0 + (t1 - t0) * p;
        clockLabel.textContent = timed[i].dataset.moment;
        break;
      }
      if (i === timed.length - 1 && r.bottom <= mid) { minutes = DAY_END; clockLabel.textContent = timed[i].dataset.moment; }
    }
    clockTime.textContent = fmtMin(minutes);
    clockDot.style.setProperty('--p', `${(((minutes - DAY_START) / (DAY_END - DAY_START)) * 100).toFixed(2)}%`);

    // seção ativa no menu
    const cur = navSecs.find(s => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    navLinks.forEach(a => a.setAttribute('aria-current', cur && a.getAttribute('href') === '#' + cur.id ? 'true' : 'false'));

    // parallax
    if (!reduced) {
      for (const el of parallaxEls) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const f = parseFloat(el.dataset.parallax) || 0.1;
        const lim = vh * 0.08;
        const d = clamp((r.top + r.height / 2 - vh / 2) * -f, -lim, lim);
        el.style.transform = `translate3d(0, ${d.toFixed(1)}px, 0)`;
      }
    }

    // reel horizontal
    if (reelOn) {
      const r = reel.getBoundingClientRect();
      const p = clamp(-r.top / (reel.offsetHeight - vh), 0, 1);
      reelTrack.style.transform = `translate3d(${(-p * reelDist).toFixed(1)}px, 0, 0)`;
      for (const ph of reelPhrases) {
        const pr = ph.getBoundingClientRect();
        const c = pr.left + pr.width / 2;
        ph.classList.toggle('is-lit', c > innerWidth * 0.12 && c < innerWidth * 0.88);
      }
    }
  }

  let ticking = false;
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } };

  function initScroll() {
    setupReel();
    onScroll();
    addEventListener('scroll', requestTick, { passive: true });
    addEventListener('resize', () => { setupReel(); requestTick(); });
  }

  /* ---------------------------------------------------------
     NAVEGAÇÃO COM TRANSIÇÃO
     --------------------------------------------------------- */
  const veil = $('#veil');
  function goTo(hash) {
    const target = hash === '#top' ? document.body : $(hash);
    if (!target) return;
    const top = hash === '#top' ? 0 : target.getBoundingClientRect().top + scrollY - (hash === '#intro' ? 0 : 20);
    const far = Math.abs(top - scrollY) > innerHeight * 1.6;
    if (reduced || !far) { scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' }); return; }
    veil.classList.remove('is-out');
    veil.classList.add('is-in');
    setTimeout(() => {
      scrollTo({ top, behavior: 'auto' });
      hdr.classList.remove('is-hidden');
      veil.classList.add('is-out');
      veil.classList.remove('is-in');
      setTimeout(() => veil.classList.remove('is-out'), 900);
    }, 760);
  }

  function initNav() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[data-nav]');
      if (!a) return;
      const hash = a.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      e.preventDefault();
      if (menu.classList.contains('is-open')) { closeMenu(); setTimeout(() => goTo(hash), 420); }
      else goTo(hash);
      history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
    });
  }

  /* ---------------------------------------------------------
     MENU FULLSCREEN
     --------------------------------------------------------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    hdr.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    $('.hdr__menu-label').textContent = 'Close';
    lock();
    setTimeout(() => $('.menu__nav a').focus({ preventScroll: true }), 500);
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    hdr.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    $('.hdr__menu-label').textContent = 'Menu';
    unlock();
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 900);
  }
  function initMenu() {
    menuBtn.addEventListener('click', () => menu.classList.contains('is-open') ? closeMenu() : openMenu());
    menu.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeMenu(); menuBtn.focus(); }
      trapFocus(menu, e);
    });
    menu.addEventListener('click', e => { if (e.target.closest('[data-book]')) closeMenu(); });
  }

  /* ---------------------------------------------------------
     WELLNESS
     --------------------------------------------------------- */
  function initWellness() {
    const btns = $$('#wellList button');
    const imgs = $$('.well__stage img');
    const set = btn => {
      btns.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', b === btn); });
      imgs.forEach((im, i) => im.classList.toggle('is-active', i === +btn.dataset.img));
    };
    btns.forEach(b => {
      b.addEventListener('click', () => set(b));
      if (finePointer) b.addEventListener('mouseenter', () => set(b));
    });
    // pré-carrega as imagens do palco quando a seção se aproxima
    new IntersectionObserver((ens, o) => ens.forEach(en => {
      if (en.isIntersecting) { imgs.forEach(im => { im.loading = 'eager'; }); o.disconnect(); }
    }), { rootMargin: '400px' }).observe($('.well'));
  }

  /* ---------------------------------------------------------
     GALERIA + LIGHTBOX
     --------------------------------------------------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  let lbList = [], lbIndex = 0, lbOpener = null;

  function initGallery() {
    const m = $('#masonry');
    m.innerHTML = GALLERY.map((g, i) => `
      <figure class="m-item" data-cat="${g.cat}" data-reveal>
        <button type="button" data-lb="${i}" data-cursor="View" aria-label="Ampliar: ${esc(g.cap)}">
          ${imgTag(g.id, g.cap, '(min-width: 860px) 31vw, 48vw').replace('<img ', `<img style="aspect-ratio:${g.r}" `)}
        </button>
        <figcaption><span>${esc(g.cap)}</span><span>${CAT_LABEL[g.cat]}</span></figcaption>
      </figure>`).join('');
    $$('.m-item', m).forEach(el => window.__vio.observe(el));

    const filters = $$('#filters button');
    filters.forEach(btn => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', b === btn); });
      const items = $$('.m-item', m);
      items.forEach(it => it.classList.add('is-hiding'));
      setTimeout(() => {
        items.forEach(it => {
          const show = f === 'all' || it.dataset.cat === f;
          it.hidden = !show;
          if (show) { it.classList.add('is-in'); requestAnimationFrame(() => it.classList.remove('is-hiding')); }
        });
      }, reduced ? 0 : 320);
    }));

    m.addEventListener('click', e => {
      const b = e.target.closest('[data-lb]');
      if (!b) return;
      lbList = $$('.m-item:not([hidden]) [data-lb]', m).map(x => +x.dataset.lb);
      lbIndex = lbList.indexOf(+b.dataset.lb);
      lbOpener = b;
      openLb();
    });

    $('.lb__close').addEventListener('click', closeLb);
    $('.lb__nav--prev').addEventListener('click', () => stepLb(-1));
    $('.lb__nav--next').addEventListener('click', () => stepLb(1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb__fig')) closeLb(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') stepLb(-1);
      if (e.key === 'ArrowRight') stepLb(1);
      trapFocus(lb, e);
    });
    // swipe
    let sx = 0, sy = 0;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) stepLb(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeLb();
    });
  }
  function renderLb() {
    const g = GALLERY[lbList[lbIndex]];
    lbImg.classList.add('is-swapping');
    const pre = new Image();
    pre.src = IMG(g.id, 2000);
    const show = () => {
      lbImg.src = pre.src;
      lbImg.alt = g.cap;
      lbCap.textContent = `${g.cap} — ${CAT_LABEL[g.cat]}`;
      lbCount.textContent = `${lbIndex + 1} / ${lbList.length}`;
      requestAnimationFrame(() => lbImg.classList.remove('is-swapping'));
    };
    if (pre.complete) show(); else { pre.onload = show; pre.onerror = show; }
    // pré-carrega vizinhas
    [1, -1].forEach(d => { const n = GALLERY[lbList[(lbIndex + d + lbList.length) % lbList.length]]; new Image().src = IMG(n.id, 2000); });
  }
  function openLb() {
    lb.hidden = false; lock();
    renderLb();
    requestAnimationFrame(() => lb.classList.add('is-open'));
    setTimeout(() => $('.lb__close').focus(), 50);
  }
  function closeLb() {
    lb.classList.remove('is-open'); unlock();
    setTimeout(() => { lb.hidden = true; lbImg.removeAttribute('src'); }, 450);
    lbOpener && lbOpener.focus({ preventScroll: true });
  }
  function stepLb(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; renderLb(); }

  /* ---------------------------------------------------------
     JOURNAL
     --------------------------------------------------------- */
  const art = $('#article'), artScroll = $('#artScroll');
  let artOpener = null;
  function initJournal() {
    const [lead, ...rest] = JOURNAL;
    $('#jgrid').innerHTML = `
      <button type="button" class="jcard jcard--lead" data-art="${lead.slug}" data-cursor="Read" data-reveal>
        <div class="jcard__img mask" data-mask>${imgTag(lead.img, '', '(min-width: 860px) 54vw, 100vw')}</div>
        <p class="jcard__meta">${lead.cat} · ${lead.min} min de leitura</p>
        <h3>${lead.title}</h3>
        <p>${lead.excerpt}</p>
      </button>
      <div class="jlist">
        ${rest.map(a => `
          <button type="button" class="jcard jcard--row" data-art="${a.slug}" data-cursor="Read" data-reveal>
            <div><p class="jcard__meta">${a.cat} · ${a.min} min</p><h3>${a.title}</h3></div>
            <div class="jcard__img">${imgTag(a.img, '', '120px')}</div>
          </button>`).join('')}
      </div>`;
    $$('#jgrid [data-reveal], #jgrid [data-mask]').forEach(el => window.__vio.observe(el));
    $('#jgrid').addEventListener('click', e => {
      const b = e.target.closest('[data-art]');
      if (b) { artOpener = b; openArticle(b.dataset.art); }
    });
    art.addEventListener('keydown', e => { if (e.key === 'Escape') closeArticle(); trapFocus(art, e); });
  }
  function openArticle(slug) {
    const i = JOURNAL.findIndex(a => a.slug === slug);
    const a = JOURNAL[i], next = JOURNAL[(i + 1) % JOURNAL.length];
    artScroll.innerHTML = `
      <button class="art__close" type="button" aria-label="Fechar artigo"><i></i><i></i></button>
      <div class="art__hero">${imgTag(a.img, '', '100vw').replace('loading="lazy"', 'loading="eager"')}</div>
      <header class="art__head">
        <p class="eyebrow">${a.cat} · ${a.date} · ${a.min} min</p>
        <h1 id="artTitle">${a.title}</h1>
        <p class="lede">${a.excerpt}</p>
      </header>
      <div class="art__body">${a.body.map(p => p.startsWith('<blockquote>') ? p : `<p>${p}</p>`).join('')}</div>
      <footer class="art__next">
        <button type="button" data-next="${next.slug}"><span class="eyebrow">Próxima leitura</span><strong>${next.title}</strong></button>
        <button class="btn btn--solid" type="button" data-book>Book your stay</button>
      </footer>`;
    artScroll.scrollTop = 0;
    $('.art__close', artScroll).addEventListener('click', closeArticle);
    $('[data-next]', artScroll).addEventListener('click', e => {
      artScroll.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      setTimeout(() => openArticle(e.currentTarget.dataset.next), reduced ? 0 : 400);
    });
    if (art.hidden) {
      art.hidden = false; lock();
      requestAnimationFrame(() => requestAnimationFrame(() => art.classList.add('is-open')));
    }
    setTimeout(() => $('.art__close', artScroll).focus({ preventScroll: true }), 80);
  }
  function closeArticle() {
    art.classList.remove('is-open'); unlock();
    setTimeout(() => { art.hidden = true; }, 1000);
    artOpener && artOpener.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------
     MAPA TOPOGRÁFICO (SVG gerado)
     --------------------------------------------------------- */
  function initMap() {
    const svg = $('#topo');
    const NS = 'http://www.w3.org/2000/svg';
    const hills = [
      { x: 330, y: 250, n: 13, step: 17, s: 1.3 },
      { x: 620, y: 470, n: 9, step: 19, s: 4.1 },
      { x: 120, y: 540, n: 7, step: 18, s: 2.2 },
      { x: 700, y: 110, n: 6, step: 16, s: 5.7 }
    ];
    let d = '';
    const paths = [];
    hills.forEach(h => {
      for (let k = 1; k <= h.n; k++) {
        const r = k * h.step;
        let p = '';
        for (let a = 0; a <= Math.PI * 2 + 0.001; a += Math.PI / 48) {
          const w = 1 + 0.14 * Math.sin(3 * a + h.s + k * 0.12) + 0.07 * Math.sin(5 * a + h.s * 2) + 0.035 * Math.sin(9 * a + k * 0.3);
          const x = h.x + Math.cos(a) * r * w * 1.18;
          const y = h.y + Math.sin(a) * r * w * 0.92;
          p += (p ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        paths.push(`<path class="contour${k % 4 === 0 ? ' contour--major' : ''}" d="${p}Z"/>`);
      }
    });
    d += paths.join('');
    d += `<path class="river" d="M-10 380 C 90 360, 150 420, 230 400 S 380 330, 440 380 S 560 350, 620 300 S 760 260, 820 280"/>`;
    // rotas
    d += `<path class="route" d="M348 272 C 420 300, 520 330, 600 320 S 760 360, 800 372"/>`;
    d += `<path class="route" d="M340 280 C 320 360, 260 440, 200 500 S 120 600, 60 640"/>`;
    d += `<path class="route" d="M322 262 C 280 220, 220 190, 150 150"/>`;
    // cidade
    d += `<rect x="140" y="140" width="10" height="10" fill="none" stroke="#EDEAE2" stroke-width="1"/>`;
    d += `<text x="162" y="136">Centro</text><text class="t-small" x="162" y="152">20 min</text>`;
    d += `<text x="792" y="352" text-anchor="end">Florianópolis →</text><text class="t-small" x="792" y="398" text-anchor="end">2h30 · 190 km</text>`;
    d += `<text x="78" y="612">↙ Aeroporto</text><text class="t-small" x="78" y="628">1h40</text>`;
    // pin VÉRA
    d += `<circle class="pin-ring" cx="336" cy="268" r="14"/><circle class="pin" cx="336" cy="268" r="5"/>`;
    d += `<text class="t-serif" x="358" y="252">VÉRA</text><text class="t-small" x="360" y="272">Vale do Silêncio · 1.280 m</text>`;
    // norte + escala
    d += `<g transform="translate(740 40)"><path d="M0 22 L6 0 L12 22 L6 17 Z" fill="#EDEAE2"/><text class="t-small" x="6" y="40" text-anchor="middle">N</text></g>`;
    d += `<g transform="translate(40 40)"><path d="M0 0 H80 M0 -4 V4 M80 -4 V4" stroke="#EDEAE2" stroke-width="1"/><text class="t-small" x="0" y="20">1 km</text></g>`;
    svg.insertAdjacentHTML('beforeend', d);
  }

  /* ---------------------------------------------------------
     INSTAGRAM + ESTRELAS
     --------------------------------------------------------- */
  function initInsta() {
    $('#instaGrid').innerHTML = INSTA.map(id => `<a href="#" aria-label="Publicação de @stayvera (link de exemplo)" data-cursor="Open">${imgTag(id, '', '(min-width: 700px) 17vw, 34vw')}</a>`).join('');
    $('#instaGrid').addEventListener('click', e => { if (e.target.closest('a')) { e.preventDefault(); toast('Perfil de exemplo: @stayvera não é uma conta real.'); } });
    $('.insta__handle a').addEventListener('click', e => { e.preventDefault(); toast('Perfil de exemplo: @stayvera não é uma conta real.'); });
  }

  function initStars() {
    const c = $('#stars'), ctx = c.getContext('2d');
    let stars = [], w = 0, h = 0, raf = 0, visible = false, last = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    function size() {
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 5200);
      let seed = 7;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      stars = Array.from({ length: n }, () => ({ x: rnd() * w, y: rnd() * h * 0.75, r: rnd() * 1.1 + 0.2, a: rnd() * 0.7 + 0.15, s: rnd() * 2 + 0.4, o: rnd() * 6 }));
      draw(0);
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(t / 1000 * s.s + s.o);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = '#EDEAE2';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function loop(t) {
      if (!visible) return;
      if (t - last > 66) { draw(t); last = t; }
      raf = requestAnimationFrame(loop);
    }
    size();
    addEventListener('resize', size);
    if (reduced) return;
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    }).observe(c);
  }

  /* ---------------------------------------------------------
     CURSOR
     --------------------------------------------------------- */
  function initCursor() {
    if (!finePointer || reduced) return;
    const cur = $('#cursor'), label = $('span', cur);
    let x = -200, y = -200, tx = x, ty = y, on = false;
    addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      const t = !document.body.classList.contains('is-locked') && e.target.closest('[data-cursor]');
      if (t && !on) { label.textContent = t.dataset.cursor; cur.classList.add('is-on'); on = true; }
      else if (!t && on) { cur.classList.remove('is-on'); on = false; }
      else if (t) label.textContent = t.dataset.cursor;
    }, { passive: true });
    (function loop() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      cur.style.setProperty('--x', x.toFixed(1) + 'px');
      cur.style.setProperty('--y', y.toFixed(1) + 'px');
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseleave', () => { cur.classList.remove('is-on'); on = false; });
  }

  /* =========================================================
     MOTOR DE RESERVAS
     ========================================================= */
  const bk = $('#booking'), bkBody = $('#bkBody'), bkSteps = $('#bkSteps');
  const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const DOW1 = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const MON = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const MONL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const CODE = 'VR-28491';
  const MAX_NIGHTS = 21;

  const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fromKey = k => { const [y, m, dd] = k.split('-').map(Number); return new Date(y, m - 1, dd); };
  const nightsBetween = (a, b) => Math.round((b - a) / 864e5);
  const fmtShort = d => `${DOW[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`;
  const fmtLong = d => `${d.getDate()} de ${MONL[d.getMonth()]} de ${d.getFullYear()}`;
  const dayNum = d => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);

  // disponibilidade simulada, determinística por data e acomodação
  function isBooked(room, d) {
    const n = dayNum(d), dow = d.getDay();
    if (room === 'forest') return (n * 37) % 23 < 2;
    if (room === 'vera') return (n * 53) % 19 < 3 || (dow === 6 && n % 4 === 0);
    if (room === 'villa') return (n * 29) % 17 < 3 || ((dow === 5 || dow === 6) && n % 3 !== 1);
    return false;
  }
  const allBooked = d => Object.keys(ROOMS).every(r => isBooked(r, d));
  function roomFree(room, a, b) {
    for (let d = new Date(a); d < b; d = addDays(d, 1)) if (isBooked(room, d)) return false;
    return true;
  }
  function nextFree(room, a, nights) {
    for (let i = 1; i <= 90; i++) {
      const s = addDays(a, i);
      if (roomFree(room, s, addDays(s, nights))) return s;
    }
    return null;
  }

  const S = {
    view: 'search', step: 1,
    checkIn: null, checkOut: null, target: 'in', month: 0,
    guests: 2, room: 'any', selected: null,
    guest: { name: '', email: '', phone: '', arrival: '', occasion: '', notes: '' },
    extras: new Set(), pay: 'card', card: { name: '', num: '', exp: '', cvc: '' }, terms: false,
    confirmed: null
  };
  let bkOpener = null;

  const nights = () => (S.checkIn && S.checkOut ? nightsBetween(S.checkIn, S.checkOut) : 0);
  const extraCost = x => (x.per === 'night' ? x.price * nights() : x.price);
  function totals() {
    const r = S.selected ? ROOMS[S.selected] : null;
    const stay = r ? r.rate * nights() : 0;
    const ex = EXTRAS.filter(x => S.extras.has(x.id)).map(x => ({ ...x, cost: extraCost(x) }));
    return { stay, ex, total: stay + ex.reduce((s, x) => s + x.cost, 0) };
  }

  function openBooking(opts = {}) {
    bkOpener = document.activeElement;
    if (S.view === 'done') resetBooking();
    if (opts.room) { S.room = opts.room; if (S.view !== 'search' && S.view !== 'results') { S.view = 'search'; S.step = 1; } }
    if (opts.view) S.view = opts.view;
    render();
    bk.hidden = false; lock();
    requestAnimationFrame(() => requestAnimationFrame(() => bk.classList.add('is-open')));
    setTimeout(() => bkBody.focus({ preventScroll: true }), 100);
  }
  function closeBooking() {
    bk.classList.remove('is-open'); unlock();
    setTimeout(() => { bk.hidden = true; }, 1000);
    bkOpener && bkOpener.focus && bkOpener.focus({ preventScroll: true });
  }
  function resetBooking() {
    Object.assign(S, { view: 'search', step: 1, checkIn: null, checkOut: null, target: 'in', month: 0, guests: 2, room: 'any', selected: null, extras: new Set(), pay: 'card', terms: false, confirmed: null });
    S.guest = { name: '', email: '', phone: '', arrival: '', occasion: '', notes: '' };
    S.card = { name: '', num: '', exp: '', cvc: '' };
  }
  function go(view, step) {
    S.view = view; if (step) S.step = step;
    render();
    bkBody.scrollTop = 0;
    bkBody.focus({ preventScroll: true });
  }

  function renderSteps() {
    $$('li', bkSteps).forEach(li => {
      const n = +li.dataset.step;
      li.classList.toggle('is-current', n === S.step);
      li.classList.toggle('is-done', n < S.step);
      if (n === S.step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
  }

  function render() {
    renderSteps();
    const v = { search: vSearch, results: vResults, guest: vGuest, extras: vExtras, payment: vPayment, done: vDone, manage: vManage }[S.view];
    bkBody.innerHTML = `<div class="bk-view">${v()}</div>`;
    hydrate(bkBody);
    bind[S.view] && bind[S.view]();
  }

  /* ---------- views ---------- */
  function vSearch() {
    const r = S.room !== 'any' ? ROOMS[S.room] : null;
    const n = nights();
    return `
    <div class="bk-search">
      <div class="bk-search__img">
        <img data-u="${r ? r.img : '1542273917363-3b1817f69a2d'}" data-sizes="42vw" alt="">
        <p>${r ? r.name : 'Where time<br><em>slows down.</em>'}</p>
      </div>
      <div class="bk-search__form">
        <h2 id="bkTitle">Book your <em>stay.</em></h2>
        <p class="bk-sub">Escolha as datas, o número de hóspedes e a acomodação. Check-in a partir das 15h, check-out até as 12h.</p>

        <div class="datefields" role="group" aria-label="Datas">
          <button type="button" class="datefield ${S.target === 'in' ? 'is-target' : ''}" data-target="in">
            <span class="flabel">Check-in</span>
            <strong class="${S.checkIn ? '' : 'is-empty'}">${S.checkIn ? fmtShort(S.checkIn) : 'Escolha a data'}</strong>
          </button>
          <button type="button" class="datefield ${S.target === 'out' ? 'is-target' : ''}" data-target="out">
            <span class="flabel">Check-out</span>
            <strong class="${S.checkOut ? '' : 'is-empty'}">${S.checkOut ? fmtShort(S.checkOut) : 'Escolha a data'}</strong>
          </button>
        </div>

        <div class="cal" id="cal">${calendar()}</div>

        <div class="bk-row">
          <div class="field-box">
            <span class="flabel" id="gLabel">Guests</span>
            <div class="stepper" role="group" aria-labelledby="gLabel">
              <button type="button" data-g="-1" aria-label="Menos um hóspede" ${S.guests <= 1 ? 'disabled' : ''}>−</button>
              <output aria-live="polite">${S.guests} ${S.guests === 1 ? 'adulto' : 'adultos'}</output>
              <button type="button" data-g="1" aria-label="Mais um hóspede" ${S.guests >= 2 ? 'disabled' : ''}>+</button>
            </div>
            <p class="hint">Todas as suítes acomodam até 2 adultos. Para grupos, escreva para a concierge.</p>
          </div>
          <fieldset class="field-box" style="margin:0">
            <legend class="flabel" style="padding:0;float:left;width:100%;margin-bottom:10px">Room</legend>
            <div class="chips">
              ${[['any', 'Todas'], ['forest', 'Forest Suite'], ['vera', 'VÉRA Suite'], ['villa', 'Private Villa']].map(([v, l]) =>
                `<label class="chip"><input type="radio" name="room" value="${v}" ${S.room === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}
            </div>
          </fieldset>
        </div>

        <div class="bk-actions">
          <p class="summary-line">${n ? `<strong>${n} ${n === 1 ? 'noite' : 'noites'}</strong> · ${S.checkIn.getDate()} ${MON[S.checkIn.getMonth()]} – ${S.checkOut.getDate()} ${MON[S.checkOut.getMonth()]}` : 'Selecione check-in e check-out no calendário.'}</p>
          <button class="btn btn--solid" type="button" id="checkAvail">Check availability</button>
        </div>
        <p class="bk-error" id="searchErr" role="alert"></p>
        <p class="hint" style="margin-top:28px">Já tem uma reserva? <button type="button" class="link" style="font:inherit;letter-spacing:0;text-transform:none;padding-bottom:1px" data-manage>Gerenciar reserva</button></p>
      </div>
    </div>`;
  }

  function monthGrid(offset) {
    const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    let h = `<div class="cal__month"><h3>${MONL[first.getMonth()]} ${first.getFullYear()}</h3><div class="cal__grid" role="grid">`;
    h += DOW1.map((d, i) => `<span class="cal__dow" aria-hidden="true" title="${DOW[i]}">${d}</span>`).join('');
    for (let i = 0; i < first.getDay(); i++) h += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const date = new Date(first.getFullYear(), first.getMonth(), d);
      const k = key(date);
      const past = date < today;
      const full = !past && allBooked(date);
      const tooFar = S.checkIn && !S.checkOut && S.target === 'out' && date > S.checkIn && nightsBetween(S.checkIn, date) > MAX_NIGHTS;
      // como check-out, uma data lotada ainda é válida (não se dorme nela)
      const disabled = past || tooFar || (full && !(S.target === 'out' && S.checkIn && date > S.checkIn));
      const cls = ['cal__day'];
      if (full && !past) cls.push('is-booked');
      if (+date === +today) cls.push('is-today');
      if (S.checkIn && +date === +S.checkIn) cls.push('is-start');
      if (S.checkIn && S.checkOut) cls.push('has-end');
      if (S.checkOut && +date === +S.checkOut) cls.push('is-end');
      if (S.checkIn && S.checkOut && date > S.checkIn && date < S.checkOut) cls.push('is-range');
      const label = `${fmtLong(date)}${full && !past ? ', sem disponibilidade' : ''}`;
      h += `<button type="button" class="${cls.join(' ')}" data-date="${k}" ${disabled ? 'disabled' : ''} aria-label="${label}" aria-pressed="${(S.checkIn && +date === +S.checkIn) || (S.checkOut && +date === +S.checkOut) ? 'true' : 'false'}">${d}</button>`;
    }
    return h + '</div></div>';
  }
  function calendar() {
    return `
      <div class="cal__nav">
        <button type="button" data-m="-1" aria-label="Mês anterior" ${S.month <= 0 ? 'disabled' : ''}>←</button>
        <button type="button" data-m="1" aria-label="Próximo mês" ${S.month >= 11 ? 'disabled' : ''}>→</button>
      </div>
      ${monthGrid(S.month)}${monthGrid(S.month + 1)}
      <p class="cal__legend"><span>Toque na data de chegada e depois na de saída.</span><span><s>00</s> sem disponibilidade</span></p>`;
  }

  function vResults() {
    const n = nights();
    const order = S.room === 'any' ? Object.keys(ROOMS) : [S.room, ...Object.keys(ROOMS).filter(k => k !== S.room)];
    const cards = order.map(id => {
      const r = ROOMS[id];
      const free = roomFree(id, S.checkIn, S.checkOut);
      const alt = free ? null : nextFree(id, S.checkIn, n);
      return `
      <article class="rcard ${free ? '' : 'is-off'}">
        <div class="rcard__img"><img data-u="${r.img}" data-sizes="(min-width: 760px) 40vw, 100vw" alt="${r.name}"></div>
        <div class="rcard__body">
          <h3>${r.name}</h3>
          <p class="rcard__facts"><span>Até 2 hóspedes</span><span>${r.size} m²</span><span>King bed</span><span>${r.view}</span></p>
          <ul class="rcard__perks">${r.perks.map(p => `<li>${p}</li>`).join('')}</ul>
          <div class="rcard__price">
            <p><span class="n">${money(r.rate)}</span><br><small>por noite</small></p>
            <p class="t"><small>Total · ${n} ${n === 1 ? 'noite' : 'noites'}</small><strong>${money(r.rate * n)}</strong></p>
          </div>
          <div class="rcard__cta">
            ${free
              ? `<button class="btn btn--solid" type="button" data-select="${id}">Select room</button>`
              : `<p class="rcard__off">Indisponível nessas datas.</p>${alt ? `<button class="btn btn--line" type="button" data-alt="${key(alt)}">Ver a partir de ${fmtShort(alt)}</button>` : ''}`}
          </div>
        </div>
      </article>`;
    }).join('');
    const anyFree = order.some(id => roomFree(id, S.checkIn, S.checkOut));
    return `
    <div class="bk-results">
      <button class="back" type="button" data-back="search">← Alterar busca</button>
      <div class="bk-results__head">
        <div>
          <h2 id="bkTitle">${anyFree ? 'Available <em>for you.</em>' : 'Fully <em>booked.</em>'}</h2>
          <p class="pill"><span><b>${fmtShort(S.checkIn)}</b> → <b>${fmtShort(S.checkOut)}</b></span><span>${n} ${n === 1 ? 'noite' : 'noites'}</span><span>${S.guests} ${S.guests === 1 ? 'adulto' : 'adultos'}</span></p>
        </div>
        <p class="hint" style="max-width:34ch">Tarifas em reais, com impostos inclusos. Cancelamento gratuito até 7 dias antes do check-in.</p>
      </div>
      ${cards}
    </div>`;
  }

  function summary() {
    const r = ROOMS[S.selected];
    const t = totals();
    const n = nights();
    return `
    <aside class="bk-co__aside">
      <div class="sum" id="sum">
        <button class="sum-toggle" type="button" aria-expanded="false" aria-controls="sumBody"><span>Resumo da reserva</span><span><strong>${money(t.total)}</strong><i aria-hidden="true">⌄</i></span></button>
        <div class="sum__img"><img data-u="${r.img}" data-sizes="380px" alt=""></div>
        <div class="sum__body" id="sumBody">
          <h3>${r.name}</h3>
          <dl>
            <div><dt>Check-in</dt><dd>${fmtShort(S.checkIn)}<br><small class="muted">a partir das 15h</small></dd></div>
            <div><dt>Check-out</dt><dd>${fmtShort(S.checkOut)}<br><small class="muted">até as 12h</small></dd></div>
            <div><dt>Hóspedes</dt><dd>${S.guests} ${S.guests === 1 ? 'adulto' : 'adultos'}</dd></div>
            <div><dt>Noites</dt><dd>${n}</dd></div>
          </dl>
          <ul class="sum__lines">
            <li><span>${n} × ${money(r.rate)}</span><span>${money(t.stay)}</span></li>
            ${t.ex.map(x => `<li><span>${x.name}${x.per === 'night' ? ` × ${n}` : ''}</span><span>${money(x.cost)}</span></li>`).join('')}
          </ul>
          <div class="sum__total"><span>Total</span><strong>${money(t.total)}</strong></div>
          <p class="sum__note">Impostos inclusos. Cancelamento gratuito até ${fmtShort(addDays(S.checkIn, -7))}.</p>
        </div>
      </div>
    </aside>`;
  }

  function vGuest() {
    const g = S.guest;
    const arrivals = ['15h – 17h', '17h – 19h', '19h – 21h', 'Depois das 21h'];
    const occasions = ['Nenhuma em especial', 'Lua de mel', 'Aniversário', 'Pedido de casamento', 'Aniversário de casamento'];
    return `
    <div class="bk-co">
      <div class="bk-co__main">
        <button class="back" type="button" data-back="results">← Voltar às acomodações</button>
        <h2 id="bkTitle" style="margin-top:12px">Guest <em>details.</em></h2>
        <p class="bk-sub">Usamos estes dados só para preparar a sua chegada.</p>
        <form class="form" id="guestForm" novalidate>
          <div class="fld full"><label for="gName">Nome completo</label><input id="gName" name="name" autocomplete="name" value="${esc(g.name)}" required><p class="err" id="gNameErr"></p></div>
          <div class="fld"><label for="gEmail">E-mail</label><input id="gEmail" name="email" type="email" autocomplete="email" inputmode="email" value="${esc(g.email)}" required><p class="err" id="gEmailErr"></p></div>
          <div class="fld"><label for="gPhone">Telefone</label><input id="gPhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(00) 00000-0000" value="${esc(g.phone)}" required><p class="err" id="gPhoneErr"></p></div>
          <div class="fld"><label for="gArrival">Chegada prevista</label><select id="gArrival" name="arrival"><option value="">Ainda não sei</option>${arrivals.map(a => `<option ${g.arrival === a ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
          <div class="fld"><label for="gOcc">Ocasião</label><select id="gOcc" name="occasion">${occasions.map(o => `<option ${g.occasion === o ? 'selected' : ''}>${o}</option>`).join('')}</select></div>
          <div class="fld full"><label for="gNotes">Pedidos especiais</label><textarea id="gNotes" name="notes" placeholder="Restrições alimentares, travesseiro extra, surpresas…">${esc(g.notes)}</textarea></div>
        </form>
        <div class="bk-foot">
          <p class="hint">Etapa 2 de 5</p>
          <button class="btn btn--solid" type="button" id="toExtras">Continue to extras</button>
        </div>
      </div>
      ${summary()}
    </div>`;
  }

  function vExtras() {
    const n = nights();
    return `
    <div class="bk-co">
      <div class="bk-co__main">
        <button class="back" type="button" data-back="guest">← Guest details</button>
        <h2 id="bkTitle" style="margin-top:12px">Make it <em>yours.</em></h2>
        <p class="bk-sub">Extras opcionais. Você também pode adicioná-los durante a estadia, sujeito à disponibilidade.</p>
        <div class="extras" role="group" aria-label="Extras">
          ${EXTRAS.map(x => `
          <label class="extra">
            <input type="checkbox" value="${x.id}" ${S.extras.has(x.id) ? 'checked' : ''}>
            <div class="extra__img"><img data-u="${x.img}" data-sizes="88px" alt=""></div>
            <div><h4>${x.name}</h4><p>${x.desc}</p></div>
            <div class="extra__side"><strong>${money(x.price)}${x.per === 'night' ? '<small class="muted"> /noite</small>' : ''}</strong><span class="extra__tog" aria-hidden="true"></span></div>
          </label>`).join('')}
        </div>
        ${n > 1 ? `<p class="hint" style="margin-top:14px">O café da manhã é cobrado por noite: ${n} × ${money(120)}.</p>` : ''}
        <div class="bk-foot">
          <p class="hint">Etapa 3 de 5</p>
          <button class="btn btn--solid" type="button" id="toPay">Continue to payment</button>
        </div>
      </div>
      ${summary()}
    </div>`;
  }

  function vPayment() {
    const c = S.card;
    const t = totals();
    return `
    <div class="bk-co">
      <div class="bk-co__main">
        <button class="back" type="button" data-back="extras">← Extras</button>
        <h2 id="bkTitle" style="margin-top:12px">Secure <em>payment.</em></h2>
        <p class="bk-sub">Cobramos a primeira noite agora. O restante é pago no check-out.</p>
        <div class="paytabs" role="tablist" aria-label="Forma de pagamento">
          <button type="button" role="tab" aria-selected="${S.pay === 'card'}" data-pay="card">Cartão de crédito</button>
          <button type="button" role="tab" aria-selected="${S.pay === 'pix'}" data-pay="pix">Pix</button>
        </div>
        ${S.pay === 'card' ? `
        <form class="form" id="payForm" novalidate>
          <div class="fld full"><label for="cName">Nome impresso no cartão</label><input id="cName" autocomplete="cc-name" value="${esc(c.name)}"><p class="err" id="cNameErr"></p></div>
          <div class="fld full"><label for="cNum">Número do cartão</label><input id="cNum" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" maxlength="19" value="${esc(c.num)}"><p class="err" id="cNumErr"></p></div>
          <div class="fld"><label for="cExp">Validade</label><input id="cExp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" maxlength="5" value="${esc(c.exp)}"><p class="err" id="cExpErr"></p></div>
          <div class="fld"><label for="cCvc">CVC</label><input id="cCvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" value="${esc(c.cvc)}"><p class="err" id="cCvcErr"></p></div>
        </form>` : `
        <div class="pix"><strong>Pix com confirmação imediata</strong><p>Ao confirmar, geramos o QR Code no valor da primeira noite. Ele expira em 30 minutos.</p></div>`}
        <label class="check" style="margin-top:24px"><input type="checkbox" id="terms" ${S.terms ? 'checked' : ''}><span>Li e aceito a política de cancelamento: gratuito até 7 dias antes do check-in; depois, cobrança da primeira noite.</span></label>
        <p class="err bk-error" id="termsErr"></p>
        <p class="demo-note">Site de demonstração: nenhum pagamento é processado e nenhum dado sai do seu navegador. Não use dados reais de cartão.</p>
        <div class="bk-foot">
          <p class="hint">Agora: <strong>${money(ROOMS[S.selected].rate)}</strong> · Total ${money(t.total)}</p>
          <button class="btn btn--solid" type="button" id="confirm">Confirm booking</button>
        </div>
      </div>
      ${summary()}
    </div>`;
  }

  function vDone() {
    const b = S.confirmed;
    const r = ROOMS[b.room];
    const ci = fromKey(b.checkIn), co = fromKey(b.checkOut);
    return `
    <div class="bk-done">
      <div class="bk-done__img"><img data-u="${r.img}" data-sizes="50vw" alt=""></div>
      <div class="bk-done__txt">
        <p class="eyebrow">Reserva confirmada</p>
        <h2 id="bkTitle">Your stay <em>begins here.</em></h2>
        <div class="code"><span class="flabel">Número da reserva</span><strong>${b.code}</strong></div>
        <dl class="done-list">
          <div><dt>Check-in</dt><dd>${fmtShort(ci)} · 15h</dd></div>
          <div><dt>Check-out</dt><dd>${fmtShort(co)} · 12h</dd></div>
          <div><dt>Acomodação</dt><dd>${r.name}</dd></div>
          <div><dt>Hóspedes</dt><dd>${b.guests} ${b.guests === 1 ? 'adulto' : 'adultos'}</dd></div>
          <div><dt>Extras</dt><dd>${b.extras.length ? b.extras.map(id => EXTRAS.find(x => x.id === id).name).join(', ') : 'Nenhum'}</dd></div>
          <div><dt>Total</dt><dd>${money(b.total)}</dd></div>
        </dl>
        <p class="muted">Guarde este número: ele é o que você vai usar para gerenciar a reserva. Até ${fmtShort(ci)}, ${esc(b.name.split(' ')[0] || '')}.</p>
        <div style="display:flex;flex-wrap:wrap;gap:12px">
          <button class="btn btn--solid" type="button" id="addCal">Add to calendar</button>
          <button class="btn btn--line" type="button" data-bk-close>Back to VÉRA</button>
        </div>
      </div>
    </div>`;
  }

  function vManage() {
    return `
    <div class="bk-results" style="max-width:720px">
      <button class="back" type="button" data-back="search">← Nova reserva</button>
      <h2 id="bkTitle" style="margin-top:12px">Manage <em>booking.</em></h2>
      <p class="bk-sub">Informe o número da reserva e o e-mail usado na compra.</p>
      <form class="form" id="manageForm" novalidate>
        <div class="fld"><label for="mCode">Número da reserva</label><input id="mCode" placeholder="VR-00000" autocomplete="off"></div>
        <div class="fld"><label for="mEmail">E-mail</label><input id="mEmail" type="email" autocomplete="email"></div>
        <div class="full"><button class="btn btn--solid" type="submit">Find my booking</button></div>
      </form>
      <div id="manageOut" style="margin-top:32px" role="status"></div>
    </div>`;
  }

  /* ---------- storage (conveniência local, opcional) ---------- */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('vera-booking') || 'null'); } catch { return null; } },
    set(v) { try { localStorage.setItem('vera-booking', JSON.stringify(v)); } catch { /* sem armazenamento */ } }
  };

  /* ---------- validação ---------- */
  function setErr(id, msg) {
    const input = $('#' + id, bkBody), p = $('#' + id + 'Err', bkBody);
    if (p) p.textContent = msg || '';
    if (input) { input.closest('.fld').classList.toggle('has-error', !!msg); input.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (msg && p) input.setAttribute('aria-describedby', id + 'Err'); }
    return !msg;
  }
  const onlyDigits = s => s.replace(/\D/g, '');

  /* ---------- binds ---------- */
  const bind = {
    search() {
      const cal = $('#cal', bkBody);
      const rerender = () => { const top = bkBody.scrollTop; render(); bkBody.scrollTop = top; };
      $$('[data-target]', bkBody).forEach(b => b.addEventListener('click', () => {
        S.target = b.dataset.target;
        if (S.target === 'out' && !S.checkIn) S.target = 'in';
        rerender();
        const f = $(`[data-target="${S.target}"]`, bkBody); f && f.focus();
      }));
      cal.addEventListener('click', e => {
        const m = e.target.closest('[data-m]');
        if (m) { S.month = clamp(S.month + +m.dataset.m, 0, 11); rerender(); return; }
        const b = e.target.closest('[data-date]');
        if (!b || b.disabled) return;
        const d = fromKey(b.dataset.date);
        if (S.target === 'in' || !S.checkIn || d <= S.checkIn || S.checkOut) {
          if (allBooked(d)) return;
          S.checkIn = d; S.checkOut = null; S.target = 'out';
        } else {
          S.checkOut = d; S.target = 'in';
        }
        $('#searchErr', bkBody).textContent = '';
        rerender();
        const again = $(`[data-date="${b.dataset.date}"]`, bkBody); again && again.focus();
      });
      // pré-visualização do intervalo no desktop
      if (finePointer) cal.addEventListener('mouseover', e => {
        if (!S.checkIn || S.checkOut) return;
        const b = e.target.closest('[data-date]');
        if (!b) return;
        const h = fromKey(b.dataset.date);
        $$('[data-date]', cal).forEach(x => { const d = fromKey(x.dataset.date); x.classList.toggle('is-range', d > S.checkIn && d < h); });
      });
      $$('[data-g]', bkBody).forEach(b => b.addEventListener('click', () => { S.guests = clamp(S.guests + +b.dataset.g, 1, 2); rerender(); }));
      $$('input[name="room"]', bkBody).forEach(i => i.addEventListener('change', () => {
        S.room = i.value;
        const r = S.room !== 'any' ? ROOMS[S.room] : null;
        const img = $('.bk-search__img img', bkBody);
        img.classList.remove('is-loaded'); delete img.dataset.done;
        img.dataset.u = r ? r.img : '1542273917363-3b1817f69a2d';
        hydrate(bkBody);
        $('.bk-search__img p', bkBody).innerHTML = r ? r.name : 'Where time<br><em>slows down.</em>';
      }));
      $('#checkAvail', bkBody).addEventListener('click', () => {
        const err = $('#searchErr', bkBody);
        if (!S.checkIn) { err.textContent = 'Escolha a data de check-in no calendário.'; return; }
        if (!S.checkOut) { err.textContent = 'Escolha a data de check-out no calendário.'; return; }
        go('results', 1);
      });
    },
    results() {
      $$('[data-select]', bkBody).forEach(b => b.addEventListener('click', () => { S.selected = b.dataset.select; go('guest', 2); }));
      $$('[data-alt]', bkBody).forEach(b => b.addEventListener('click', () => {
        const n = nights();
        S.checkIn = fromKey(b.dataset.alt); S.checkOut = addDays(S.checkIn, n);
        S.month = clamp((S.checkIn.getFullYear() - today.getFullYear()) * 12 + S.checkIn.getMonth() - today.getMonth(), 0, 11);
        go('results', 1);
        toast(`Datas alteradas para ${fmtShort(S.checkIn)} – ${fmtShort(S.checkOut)}.`);
      }));
    },
    guest() {
      const f = $('#guestForm', bkBody);
      f.addEventListener('input', e => { if (e.target.name) S.guest[e.target.name] = e.target.value; });
      f.addEventListener('change', e => { if (e.target.name) S.guest[e.target.name] = e.target.value; });
      const phone = $('#gPhone', bkBody);
      phone.addEventListener('input', () => {
        const d = onlyDigits(phone.value).slice(0, 11);
        phone.value = d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
        S.guest.phone = phone.value;
      });
      $('#toExtras', bkBody).addEventListener('click', () => {
        const g = S.guest;
        const ok = [
          setErr('gName', g.name.trim().split(/\s+/).length < 2 ? 'Informe nome e sobrenome.' : ''),
          setErr('gEmail', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim()) ? '' : 'Informe um e-mail válido, como nome@email.com.'),
          setErr('gPhone', onlyDigits(g.phone).length < 10 ? 'Informe um telefone com DDD.' : '')
        ].every(Boolean);
        if (!ok) { const first = $('[aria-invalid="true"]', bkBody); first && first.focus(); return; }
        go('extras', 3);
      });
    },
    extras() {
      $$('.extra input', bkBody).forEach(i => i.addEventListener('change', () => {
        i.checked ? S.extras.add(i.value) : S.extras.delete(i.value);
        const top = bkBody.scrollTop; render(); bkBody.scrollTop = top;
        const again = $(`.extra input[value="${i.value}"]`, bkBody); again && again.focus({ preventScroll: true });
      }));
      $('#toPay', bkBody).addEventListener('click', () => go('payment', 4));
    },
    payment() {
      $$('[data-pay]', bkBody).forEach(b => b.addEventListener('click', () => { S.pay = b.dataset.pay; const top = bkBody.scrollTop; render(); bkBody.scrollTop = top; $(`[data-pay="${S.pay}"]`, bkBody).focus(); }));
      $('#terms', bkBody).addEventListener('change', e => { S.terms = e.target.checked; $('#termsErr', bkBody).textContent = ''; });
      if (S.pay === 'card') {
        const num = $('#cNum', bkBody), exp = $('#cExp', bkBody), cvc = $('#cCvc', bkBody), nm = $('#cName', bkBody);
        nm.addEventListener('input', () => { S.card.name = nm.value; });
        num.addEventListener('input', () => { num.value = onlyDigits(num.value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); S.card.num = num.value; });
        exp.addEventListener('input', () => { const d = onlyDigits(exp.value).slice(0, 4); exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; S.card.exp = exp.value; });
        cvc.addEventListener('input', () => { cvc.value = onlyDigits(cvc.value).slice(0, 4); S.card.cvc = cvc.value; });
      }
      $('#confirm', bkBody).addEventListener('click', e => {
        let ok = true;
        if (S.pay === 'card') {
          const c = S.card;
          const [mm, yy] = c.exp.split('/').map(Number);
          const now = new Date();
          const expOk = mm >= 1 && mm <= 12 && yy >= 0 && (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1));
          ok = [
            setErr('cName', c.name.trim().length < 3 ? 'Informe o nome como aparece no cartão.' : ''),
            setErr('cNum', onlyDigits(c.num).length < 16 ? 'O número do cartão tem 16 dígitos.' : ''),
            setErr('cExp', expOk ? '' : 'Use o formato MM/AA com uma data futura.'),
            setErr('cCvc', onlyDigits(c.cvc).length < 3 ? 'O CVC tem 3 ou 4 dígitos.' : '')
          ].every(Boolean);
        }
        if (!S.terms) { $('#termsErr', bkBody).textContent = 'Aceite a política de cancelamento para continuar.'; ok = false; }
        if (!ok) { const first = $('[aria-invalid="true"]', bkBody) || $('#terms', bkBody); first.focus(); return; }
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Confirming';
        setTimeout(() => {
          const t = totals();
          S.confirmed = { code: CODE, room: S.selected, checkIn: key(S.checkIn), checkOut: key(S.checkOut), guests: S.guests, extras: [...S.extras], total: t.total, name: S.guest.name.trim(), email: S.guest.email.trim().toLowerCase() };
          store.set(S.confirmed);
          S.card = { name: '', num: '', exp: '', cvc: '' };
          go('done', 5);
        }, reduced ? 200 : 1400);
      });
    },
    done() {
      $('#addCal', bkBody).addEventListener('click', () => downloadICS(S.confirmed));
    },
    manage() {
      $('#manageForm', bkBody).addEventListener('submit', e => {
        e.preventDefault();
        const code = $('#mCode', bkBody).value.trim().toUpperCase();
        const email = $('#mEmail', bkBody).value.trim().toLowerCase();
        const out = $('#manageOut', bkBody);
        const saved = store.get();
        if (!code || !email) { out.innerHTML = '<p class="bk-error">Preencha o número da reserva e o e-mail.</p>'; return; }
        if (saved && saved.code === code && saved.email === email) {
          const r = ROOMS[saved.room];
          out.innerHTML = `
            <dl class="done-list">
              <div><dt>Acomodação</dt><dd>${r.name}</dd></div>
              <div><dt>Hóspedes</dt><dd>${saved.guests}</dd></div>
              <div><dt>Check-in</dt><dd>${fmtShort(fromKey(saved.checkIn))}</dd></div>
              <div><dt>Check-out</dt><dd>${fmtShort(fromKey(saved.checkOut))}</dd></div>
            </dl>
            <p class="hint" style="margin-top:14px">Para alterar datas ou cancelar, escreva para reservas@stayvera.com.br informando ${saved.code}.</p>
            <button class="btn btn--line" type="button" id="mCal" style="margin-top:18px">Add to calendar</button>`;
          $('#mCal', out).addEventListener('click', () => downloadICS(saved));
        } else {
          out.innerHTML = `<p class="bk-error">Não encontramos uma reserva ${esc(code)} com esse e-mail neste navegador. Confira o número ou faça uma nova reserva.</p>`;
        }
      });
    }
  };

  function downloadICS(b) {
    const r = ROOMS[b.room];
    const ci = b.checkIn.replace(/-/g, '');
    const co = key(addDays(fromKey(b.checkOut), 1)).replace(/-/g, '');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VERA Boutique Hotel//Reservas//PT', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${b.code}-${ci}@stayvera.com.br`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ci}`, `DTEND;VALUE=DATE:${co}`,
      `SUMMARY:VÉRA — ${r.name}`,
      'LOCATION:VÉRA Boutique Hotel & Retreat\\, Vale do Silêncio\\, Serra Catarinense - SC',
      `DESCRIPTION:Reserva ${b.code}. Check-in a partir das 15h\\, check-out até as 12h. Where time slows down.`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `vera-${b.code}.ics` });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Arquivo de calendário gerado.');
  }

  function initBooking() {
    document.addEventListener('click', e => {
      const room = e.target.closest('[data-book-room]');
      if (room) { e.preventDefault(); openBooking({ room: room.dataset.bookRoom }); return; }
      const b = e.target.closest('[data-book]');
      if (b) {
        e.preventDefault();
        if (!art.hidden) closeArticle();
        openBooking();
        return;
      }
      const m = e.target.closest('[data-manage]');
      if (m) { e.preventDefault(); if (bk.hidden) openBooking({ view: 'manage' }); else go('manage', 1); return; }
      if (e.target.closest('[data-bk-close]')) { closeBooking(); return; }
      const back = e.target.closest('[data-back]');
      if (back && bk.contains(back)) {
        const v = back.dataset.back;
        go(v, { search: 1, results: 1, guest: 2, extras: 3 }[v]);
      }
      const st = e.target.closest('.sum-toggle');
      if (st) { const s = st.closest('.sum'); s.classList.toggle('is-open'); st.setAttribute('aria-expanded', s.classList.contains('is-open')); }
    });
    bk.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeBooking();
      trapFocus(bk, e);
    });
  }

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  hydrate();
  initReveals();
  initHero();
  initScroll();
  initNav();
  initMenu();
  initWellness();
  initGallery();
  initJournal();
  initMap();
  initInsta();
  initStars();
  initCursor();
  initBooking();
  // links profundos: /#stay etc.
  if (location.hash && $(location.hash)) setTimeout(() => $(location.hash).scrollIntoView(), 60);
})();
