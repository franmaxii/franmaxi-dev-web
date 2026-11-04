// Piezas de marca: cada entrada se exporta como PNG con `npm run brand`.
// Para sumar un posteo, copiá una entrada y cambiá los textos.

const WEB = 'franmaxi.dev';

const frame = ({ tag = '', tagColor = 'volt', body, footerLeft = WEB, footerRight = 'Tucumán, AR', art = '', kind = '' }) => `
    ${art}
    <div class="frame ${kind}">
        <div class="row">
            <img class="logo" src="logo/logo-sobre-oscuro.svg" alt="">
            ${tag ? `<span class="tag ${tagColor}"><i></i>${tag}</span>` : ''}
        </div>
        <div class="body">${body}</div>
        <div class="row hud"><span>${footerLeft}</span><span>${footerRight}</span></div>
    </div>`;

const terrain = (file, height, sink = 0) => `<img class="terrain" src="assets/${file}" style="height:${height}px;bottom:-${sink}px" alt="">`;

const stripTerrain = (slide, total, height) =>
    `<div class="terrain strip" style="height:${height}px;background-image:url(assets/terrain-carrusel.png);background-size:${1080 * total}px ${height}px;background-position:-${1080 * slide}px 0"></div>`;

const sitio = `
    <div class="mock hot">
        <div class="me">Haceme una web para mi taller de bicis en Tucumán.</div>
        <div class="bot">Listo. Mirá cómo quedó tu página:</div>
        <div class="sitio">
            <div class="sitio-head"><span>Taller La Cadena</span><b>Vista previa</b></div>
            <div class="secciones"><span>Servicios</span><span>Horarios</span><span>Ubicación</span></div>
            <div class="pedir">Escribir por WhatsApp</div>
        </div>
    </div>`;

const chat = `
    <div class="mock hot">
        <div class="me">Pinto murales y toco en una banda.</div>
        <div class="bot">Pasame fotos de tus obras y el link de YouTube de tu último show.</div>
        <div class="url"><span>luna.changas.cv</span><b>Vista previa</b></div>
    </div>`;

const tasks = [
    {
        n: '01',
        title: 'Responder lo mismo por WhatsApp',
        text: 'Horarios, precios y disponibilidad. Un agente responde lo frecuente y te pasa lo demás.',
    },
    {
        n: '02',
        title: 'Confirmar cada turno',
        text: 'Cada reserva dispara su aviso por WhatsApp, sin que nadie tenga que escribirlo.',
    },
    {
        n: '03',
        title: 'Cargar los pagos a mano',
        text: 'Cuando entra un pago, el sistema crea el registro y le avisa a tu equipo.',
    },
];

const CAROUSEL = tasks.length + 2;
const carouselHeight = 420;

export const terrains = [
    { file: 'terrain-post.png', width: 1080, height: 720 },
    { file: 'terrain-historia.png', width: 1080, height: 900 },
    { file: 'terrain-og.png', width: 1200, height: 420 },
    { file: 'terrain-carrusel.png', width: 1080 * CAROUSEL, height: carouselHeight },
];

export const posts = [
    {
        file: 'instagram/post-01-marca.png',
        width: 1080,
        height: 1350,
        html: frame({
            tag: 'Sistema en línea',
            art: terrain('terrain-post.png', 720, 90),
            body: `<h1 class="xl">Código que<br>escala.<br><em class="glow">IA que<br>resuelve.</em></h1>`,
        }),
    },
    {
        file: 'instagram/post-02-chat.png',
        width: 1080,
        height: 1350,
        html: frame({
            tag: 'En construcción',
            tagColor: 'hot',
            footerLeft: 'chat.franmaxi.lol',
            body: `<h1 class="lg">Escribí un prompt.<br><em class="pink">Tu web queda lista.</em></h1>
                ${sitio}`,
        }),
    },
    {
        file: 'instagram/post-03-changas.png',
        width: 1080,
        height: 1350,
        html: frame({
            tag: 'En construcción',
            tagColor: 'hot',
            footerLeft: 'changas.cv',
            body: `<h1 class="lg">Tu obra.<br>Tu gente.<br><em class="pink">Tu escena.</em></h1>
                <p class="lead">La red de la escena artística y hippie, con portfolios diseñados por IA a partir de tu obra.</p>
                ${chat}`,
        }),
    },
    {
        file: 'instagram/carrusel-1-portada.png',
        width: 1080,
        height: 1350,
        html: frame({
            tag: `1 / ${CAROUSEL}`,
            art: stripTerrain(0, CAROUSEL, carouselHeight),
            footerRight: 'Deslizá →',
            body: `<h1 class="lg">3 tareas que tu negocio <em>puede dejar de hacer a mano.</em></h1>`,
        }),
    },
    ...tasks.map((task, index) => ({
        file: `instagram/carrusel-${index + 2}-tarea.png`,
        width: 1080,
        height: 1350,
        html: frame({
            tag: `${index + 2} / ${CAROUSEL}`,
            art: stripTerrain(index + 1, CAROUSEL, carouselHeight),
            footerRight: 'Deslizá →',
            body: `<p class="index">${task.n}</p><h1 class="md">${task.title}</h1><p class="lead">${task.text}</p>`,
        }),
    })),
    {
        file: `instagram/carrusel-${CAROUSEL}-cierre.png`,
        width: 1080,
        height: 1350,
        html: frame({
            tag: `${CAROUSEL} / ${CAROUSEL}`,
            art: stripTerrain(CAROUSEL - 1, CAROUSEL, carouselHeight),
            body: `<h1 class="lg">¿Qué tarea te saca <em>más tiempo?</em></h1>
                <p class="lead">Contanos por WhatsApp y vemos cómo automatizarla.</p>
                <span class="cta">Escribinos por mensaje directo</span>`,
        }),
    },
    {
        file: 'instagram/historia-1-consulta.png',
        width: 1080,
        height: 1920,
        html: frame({
            tag: 'Línea abierta',
            kind: 'story',
            art: terrain('terrain-historia.png', 900, 200),
            body: `<h1 class="xl">¿Qué<br>querés<br><em class="glow">construir?</em></h1>
                <p class="lead">Productos, automatizaciones y agentes de IA para negocios reales.</p>`,
        }),
    },
    {
        file: 'instagram/historia-2-plantilla.png',
        width: 1080,
        height: 1920,
        html: frame({
            kind: 'story',
            art: terrain('terrain-historia.png', 900, 200),
            body: '',
        }),
    },
    {
        file: 'logo/avatar-instagram.png',
        width: 1080,
        height: 1080,
        html: `<div class="avatar"><img src="logo/simbolo.svg" alt=""></div>`,
    },
    {
        file: 'logo/simbolo-1024.png',
        width: 1024,
        height: 1024,
        transparent: true,
        svg: 'logo/simbolo.svg',
    },
    {
        file: '../../public/og.png',
        width: 1200,
        height: 630,
        html: `
            ${terrain('terrain-og.png', 420, 120)}
            <div class="frame og">
                <img class="logo" src="logo/logo-sobre-oscuro.svg" alt="">
                <h1 class="og-title">Código que escala.<br><em class="glow">IA que resuelve.</em></h1>
                <div class="row hud"><span>${WEB}</span><span>Tucumán, AR</span></div>
            </div>`,
    },
];
