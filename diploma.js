// The milestone diploma, drawn in HTML/SVG instead of one PNG per milestone.
//
// To change a colour or add a milestone, edit DIPLOMA_MILESTONES. To change the
// layout or wording, edit renderDiploma(). diploma-preview.html shows every
// diploma at once, so open it after any change.
//
// Coordinates are in a 1414 x 2000 px page (A4 proportions), the same space the
// original PNG templates were measured in.

// hex is what the code uses; rgb and source are for people reading the table.
// 10-500 are sampled from the original parkrun certificates. 200-1000 (the clubs
// parkrun added in October 2026) are sampled from the official milestone T-shirts
// on shop.parkrun.com. `ink` is the colour of the number on the badge.
const DIPLOMA_MILESTONES = [
  { count: 10,   hex: '#ffffff', rgb: 'rgb(255, 255, 255)', ink: '#231f20', source: 'certificate (white, juniors only)' },
  { count: 25,   hex: '#a94a89', rgb: 'rgb(169, 74, 137)',  ink: '#ffffff', source: 'certificate (purple)' },
  { count: 50,   hex: '#ee1d23', rgb: 'rgb(238, 29, 35)',   ink: '#ffffff', source: 'certificate (red)' },
  { count: 100,  hex: '#231f20', rgb: 'rgb(35, 31, 32)',    ink: '#ffffff', source: 'certificate (black)' },
  { count: 200,  hex: '#78c0e4', rgb: 'rgb(120, 192, 228)', ink: '#20275a', source: 'T-shirt "Sky Blue"' },
  { count: 250,  hex: '#35bd9b', rgb: 'rgb(53, 189, 155)',  ink: '#ffffff', source: 'certificate (green)' },
  { count: 300,  hex: '#e07228', rgb: 'rgb(224, 114, 40)',  ink: '#ffffff', source: 'T-shirt "Orange"' },
  { count: 400,  hex: '#903048', rgb: 'rgb(144, 48, 72)',   ink: '#ffffff', source: 'T-shirt "Dk Red"' },
  { count: 500,  hex: '#1778be', rgb: 'rgb(23, 120, 190)',  ink: '#ffffff', source: 'certificate (blue)' },
  { count: 600,  hex: '#b4d848', rgb: 'rgb(180, 216, 72)',  ink: '#20275a', source: 'T-shirt "Lime"' },
  { count: 700,  hex: '#243054', rgb: 'rgb(36, 48, 84)',    ink: '#ffffff', source: 'T-shirt "Navy"' },
  { count: 800,  hex: '#b454b4', rgb: 'rgb(180, 84, 180)',  ink: '#ffffff', source: 'T-shirt "Purple / Grape"' },
  { count: 900,  hex: '#486c24', rgb: 'rgb(72, 108, 36)',   ink: '#ffffff', source: 'T-shirt "Grass Green"' },
  { count: 1000, hex: '#f0e454', rgb: 'rgb(240, 228, 84)',  ink: '#20275a', source: 'T-shirt "Yellow"' },
];

const DIPLOMA_W = 1414;
const DIPLOMA_H = 2000;
const DIPLOMA_GREEN = '#35bd9b';
const DIPLOMA_NAVY = '#20275a';
const DIPLOMA_RAY = '#3c457f';
const DIPLOMA_TEXT = '#231f20';
const DIPLOMA_PLACE = 'parkrun Wzniesienie Osowy';
const DIPLOMA_FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;800&family=Caveat+Brush&family=Zeyada&display=swap';

// The badge numbers on parkrun's certificates are set in Arial Rounded MT Bold
// (measured: 94% shape overlap with the originals, next best font 79%). It is a
// licensed system font, so it can't be shipped with the page: it is used where the
// device has it (Windows with Office, macOS, iOS) and Nunito stands in elsewhere.
const DIPLOMA_DIGIT_FONT = 'DiplomaDigits';
const DIPLOMA_DIGIT_FACE = `@font-face {
  font-family: '${DIPLOMA_DIGIT_FONT}';
  src: local('Arial Rounded MT Bold'), local('ArialRoundedMTBold'), url('diploma-assets/nunito-800-latin.woff2') format('woff2');
}`;

// html-to-image can only embed web fonts from a stylesheet it is allowed to read,
// which for Google Fonts means the <link> must carry crossorigin="anonymous".
function ensureDiplomaFonts() {
  if (!document.getElementById('diploma-fonts')) {
    const link = document.createElement('link');
    link.id = 'diploma-fonts';
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';
    link.href = DIPLOMA_FONTS_HREF;
    document.head.appendChild(link);
  }
  if (!document.getElementById('diploma-digit-face')) {
    const style = document.createElement('style');
    style.id = 'diploma-digit-face';
    style.textContent = DIPLOMA_DIGIT_FACE;
    document.head.appendChild(style);
  }
}

function diplomaEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function diplomaStyle(milestone) {
  return DIPLOMA_MILESTONES.find(m => m.count === Number(milestone))
    || { count: Number(milestone), hex: DIPLOMA_GREEN, rgb: '', ink: '#ffffff', source: 'no colour defined' };
}

// "DYPLOMB200.png" -> { type: 'B', milestone: 200 }. The pipeline still names a
// template file per diploma; only the type and number in that name are used now.
function parseDiplomaTemplate(templateName) {
  const m = /DYPLOM([BW])(\d+)/i.exec(templateName || '');
  return m ? { type: m[1].toUpperCase(), milestone: parseInt(m[2], 10) } : null;
}

// Badge centre, in page coordinates.
const BADGE_X = 704;
const BADGE_Y = 832;

function badgeDigits(size, ink, attrs, content) {
  return `<text ${attrs} font-family="${DIPLOMA_DIGIT_FONT}, sans-serif" font-size="${size}" fill="${ink}">${content}</text>`;
}

// parkrun's milestone mark: the first digit large, the rest smaller and aligned to
// its top. Sizes below are measured from the original certificates.
const DIGIT_HEIGHT = 0.716;   // a digit's height as a fraction of the font size
const DIGIT_WIDTH = 0.556;    // a digit's advance width, likewise
const SMALL_DIGITS = 0.72;    // following digits, relative to the first

function milestoneMark(count, big) {
  const text = String(count);
  const small = Math.round(big * SMALL_DIGITS);
  const rest = text.length > 1
    ? `<tspan font-size="${small}" dy="${(-(big - small) * DIGIT_HEIGHT).toFixed(1)}">${text.slice(1)}</tspan>` : '';
  return { content: text[0] + rest, width: (big + (text.length - 1) * small) * DIGIT_WIDTH };
}

function runnerBadgeNumber(count, ink) {
  // Font size of the first digit, by how many digits have to fit in the disc.
  const digits = String(count).length;
  const big = count === 10 ? 370 : ({ 1: 279, 2: 279, 3: 242, 4: 200 }[digits] || 180);
  const mark = milestoneMark(count, big);
  const baseline = BADGE_Y + (big * DIGIT_HEIGHT) / 2 + 6;
  return badgeDigits(big, ink, `x="${BADGE_X}" y="${baseline.toFixed(1)}" text-anchor="middle"`, mark.content);
}

// Volunteering adds a cloud outline, with the number tucked into its open side.
function volunteerBadgeNumber(count, ink) {
  const big = 209;
  const mark = milestoneMark(count, big);
  const numberX = 97;                        // where the number starts, from the cloud's left edge
  const totalW = numberX + mark.width;
  const scale = Math.min(1.08, 400 / totalW);   // keeps four digits inside the disc
  return `<g transform="translate(${(BADGE_X - (totalW * scale) / 2).toFixed(1)} ${(BADGE_Y - 148 * scale).toFixed(1)}) scale(${scale.toFixed(3)})">
      <path d="M193,68 A60,60 0 1 0 77,76 A70,70 0 1 0 84,219" fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      ${badgeDigits(big, ink, `x="${numberX}" y="251"`, mark.content)}
    </g>`;
}

// Returns the diploma as an HTML string. type: 'B' (runs) or 'W' (volunteering).
function renderDiploma({ type, milestone, name, date }) {
  const style = diplomaStyle(milestone);
  const isVol = type === 'W';
  const club = `${isVol ? 'WOLONTARIUSZ' : 'PARKRUN'} ${style.count}`;

  const scallops = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `<circle cx="${(BADGE_X + Math.cos(a) * 243).toFixed(1)}" cy="${(BADGE_Y + Math.sin(a) * 243).toFixed(1)}" r="46"/>`;
  }).join('');

  const mont = "font-family=\"Montserrat, sans-serif\"";

  return `
<div class="diploma" style="position: relative; width: ${DIPLOMA_W}px; height: ${DIPLOMA_H}px; background: #ffffff; overflow: hidden;">
  <svg xmlns="http://www.w3.org/2000/svg" width="${DIPLOMA_W}" height="${DIPLOMA_H}" viewBox="0 0 ${DIPLOMA_W} ${DIPLOMA_H}" style="position: absolute; inset: 0;">
    <defs>
      <path id="diploma-arc" d="M318,476 Q704,424 1090,476"/>
    </defs>

    <!-- Ribbon: tails first, then the band over them, then the dark folds. -->
    <g fill="${DIPLOMA_GREEN}">
      <polygon points="158,444 229,433 242,523 317,582 183,600 201,517"/>
      <polygon points="1250,444 1179,433 1166,523 1091,582 1225,600 1207,517"/>
      <path d="M219,367 Q704,303 1189,367 L1176,521 Q704,463 232,521 Z"/>
    </g>
    <polygon points="240,523 310,515 317,582" fill="${DIPLOMA_NAVY}"/>
    <polygon points="1168,523 1098,515 1091,582" fill="${DIPLOMA_NAVY}"/>
    <text ${mont} font-weight="800" font-size="112" fill="#ffffff" letter-spacing="1">
      <textPath href="#diploma-arc" startOffset="50%" text-anchor="middle" textLength="752" lengthAdjust="spacingAndGlyphs">GRATULACJE</textPath>
    </text>

    <!-- Rosette -->
    <g fill="${DIPLOMA_GREEN}">
      <path d="M534,1036 L457,1160 Q451,1176 466,1176 L558,1163 L607,1240 Q616,1252 623,1238 L672,1088 Z"/>
      <path d="M874,1036 L951,1160 Q957,1176 942,1176 L850,1163 L801,1240 Q792,1252 785,1238 L736,1088 Z"/>
      <circle cx="${BADGE_X}" cy="${BADGE_Y}" r="250"/>
      ${scallops}
    </g>
    <polygon points="590,1084 604,1077 608,1090 590,1127 573,1119" fill="#ffffff"/>
    <polygon points="818,1084 804,1077 800,1090 818,1127 835,1119" fill="#ffffff"/>
    <circle cx="${BADGE_X}" cy="${BADGE_Y}" r="232" fill="#ffffff"/>
    <circle cx="${BADGE_X}" cy="${BADGE_Y}" r="216" fill="${style.hex}"/>
    ${isVol ? volunteerBadgeNumber(style.count, style.ink) : runnerBadgeNumber(style.count, style.ink)}

    <!-- Rays either side of the rosette -->
    <g stroke="${DIPLOMA_RAY}" stroke-width="7" stroke-linecap="round">
      <line x1="211" y1="757" x2="386" y2="794"/><line x1="202" y1="840" x2="381" y2="840"/><line x1="211" y1="923" x2="386" y2="887"/>
      <line x1="1197" y1="757" x2="1022" y2="794"/><line x1="1206" y1="840" x2="1027" y2="840"/><line x1="1197" y1="923" x2="1022" y2="887"/>
    </g>

    <!-- The line the name is written on, and the one for the date. -->
    <g stroke="${DIPLOMA_NAVY}" stroke-width="2.6" stroke-dasharray="9 7">
      <line x1="327" y1="1391" x2="1087" y2="1391"/>
      <line x1="952" y1="1688" x2="1348" y2="1688"/>
    </g>

    <text x="704" y="1478" text-anchor="middle" ${mont} font-weight="500" font-size="43" fill="${DIPLOMA_TEXT}">Z OKAZJI DOŁĄCZENIA DO KLUBU</text>
    <text x="704" y="1546" text-anchor="middle" ${mont} font-weight="800" font-size="57" fill="${DIPLOMA_GREEN}">${club}</text>

    <g ${mont} font-weight="400" font-size="23" fill="${DIPLOMA_TEXT}" text-anchor="middle">
      <text x="244" y="1737">PAUL SINTON-HEWITT CBE</text>
      <text x="244" y="1770">ZAŁOŻYCIEL PARKRUN</text>
      <text x="705" y="1770">KOORDYNATOR</text>
      <text x="1163" y="1737">DATA</text>
    </g>

    <text x="704" y="1921" text-anchor="middle" ${mont} font-weight="800" font-size="46" letter-spacing="1" fill="${DIPLOMA_GREEN}">#LOVEPARKRUN</text>
  </svg>

  <img src="diploma-assets/logo.png" alt="parkrun" style="position: absolute; left: 582px; top: 18px; width: 240px; height: 220px;">
  <img src="diploma-assets/sig-founder.png" alt="" style="position: absolute; left: 65px; top: 1592px; width: 413px; height: 110px;">
  <img src="diploma-assets/sig-coordinator.png" alt="" style="position: absolute; left: 498px; top: 1600px; width: 414px; height: 150px;">

  <div data-diploma-name style="position: absolute; left: 0; right: 0; top: 1264px; height: 150px; line-height: 150px; text-align: center; white-space: nowrap; font-family: 'Caveat Brush', cursive; font-size: 114px; color: rgb(50, 50, 50);">${diplomaEsc(name)}</div>
  <div style="position: absolute; right: 196px; top: 1640px; line-height: 60px; white-space: nowrap; font-family: 'Zeyada', cursive; font-size: 52px; color: rgb(113, 113, 165);">${diplomaEsc(date)}</div>
  <div style="position: absolute; left: 0; right: 0; top: 1696px; line-height: 56px; text-align: center; white-space: nowrap; font-family: 'Zeyada', cursive; font-size: 47px; color: rgb(113, 113, 165);">${DIPLOMA_PLACE}</div>
</div>`;
}

// Shrinks a long name until it fits on the page. Call once the diploma is in the
// document and its fonts have loaded.
function fitDiplomaName(root) {
  const el = root.querySelector('[data-diploma-name]');
  if (!el) return;
  const probe = document.createElement('span');
  probe.textContent = el.textContent;
  el.textContent = '';
  el.appendChild(probe);
  let size = 114;
  el.style.fontSize = `${size}px`;
  while (size > 48 && probe.offsetWidth > DIPLOMA_W - 160) {
    size -= 4;
    el.style.fontSize = `${size}px`;
  }
}

// Renders one diploma off-screen and saves it as a one-page A4 PDF.
// Needs html-to-image and jsPDF loaded on the page.
async function downloadDiplomaPdf({ type, milestone, name, date }, fileName) {
  ensureDiplomaFonts();
  const holder = document.createElement('div');
  // Off-screen rather than display:none, which would give html-to-image nothing to measure.
  holder.style.cssText = 'position: fixed; left: -20000px; top: 0; pointer-events: none;';
  holder.innerHTML = renderDiploma({ type, milestone, name, date });
  document.body.appendChild(holder);
  try {
    await Promise.all([
      document.fonts.load("114px 'Caveat Brush'"), document.fonts.load("52px 'Zeyada'"),
      document.fonts.load(`200px '${DIPLOMA_DIGIT_FONT}'`), document.fonts.load("800 57px 'Montserrat'"),
      document.fonts.load("500 43px 'Montserrat'"), document.fonts.load("400 23px 'Montserrat'"),
    ]);
    await document.fonts.ready;
    await Promise.all(Array.from(holder.querySelectorAll('img')).map(img => img.decode().catch(() => {})));
    const node = holder.firstElementChild;
    fitDiplomaName(node);
    // 2481 px across, the resolution of the old PNG templates (300 dpi on A4).
    const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2481 / DIPLOMA_W, backgroundColor: '#ffffff' });
    const doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    doc.addImage(dataUrl, 'PNG', 0, 0, 595.28, 841.89, undefined, 'FAST');
    doc.save(fileName);
  } finally {
    holder.remove();
  }
}
