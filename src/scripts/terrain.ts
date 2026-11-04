// Cordillera de neón del hero: líneas de relieve con oclusión, dibujadas en canvas 2D.
// Se pausa fuera de pantalla y queda como imagen fija si el usuario pidió menos movimiento.

type RGB = [number, number, number];

const NEAR: RGB = [52, 74, 116];
const MID: RGB = [41, 230, 255];
const FAR: RGB = [255, 45, 120];
const VOLT = '200, 255, 46';
const VOID = '5, 6, 10';
const TABLE_SIZE = 256;
const FRAME_MS = 1000 / 30;

function mulberry(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const fade = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, v: number) => fade(clamp01((v - a) / (b - a)));
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Tabla de ruido repetible, con crestas afiladas para que parezca una cordillera.
function buildTable(): Float32Array {
    const random = mulberry(2649);
    const table = new Float32Array(TABLE_SIZE * TABLE_SIZE);
    let amplitude = 1;
    let total = 0;

    for (const period of [6, 12, 24, 48, 96]) {
        const lattice = new Float32Array(period * period).map(() => random());
        const scale = period / TABLE_SIZE;

        for (let y = 0; y < TABLE_SIZE; y++) {
            const gy = y * scale;
            const y0 = Math.floor(gy);
            const fy = fade(gy - y0);

            for (let x = 0; x < TABLE_SIZE; x++) {
                const gx = x * scale;
                const x0 = Math.floor(gx);
                const fx = fade(gx - x0);
                const x1 = (x0 + 1) % period;
                const y1 = (y0 + 1) % period;
                const top = lattice[y0 * period + x0] * (1 - fx) + lattice[y0 * period + x1] * fx;
                const bottom = lattice[y1 * period + x0] * (1 - fx) + lattice[y1 * period + x1] * fx;
                const value = top * (1 - fy) + bottom * fy;
                table[y * TABLE_SIZE + x] += (1 - Math.abs(2 * value - 1)) * amplitude;
            }
        }

        total += amplitude;
        amplitude *= 0.5;
    }

    for (let i = 0; i < table.length; i++) table[i] /= total;
    return table;
}

function start(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;
    const ctx = context;

    const table = buildTable();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sample = (x: number, y: number) => {
        const fx = ((x % 1) + 1) % 1 * TABLE_SIZE;
        const fy = ((y % 1) + 1) % 1 * TABLE_SIZE;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = fx - x0;
        const ty = fy - y0;
        const x1 = (x0 + 1) % TABLE_SIZE;
        const y1 = (y0 + 1) % TABLE_SIZE;
        const a = table[y0 * TABLE_SIZE + x0];
        const b = table[y0 * TABLE_SIZE + x1];
        const c = table[y1 * TABLE_SIZE + x0];
        const d = table[y1 * TABLE_SIZE + x1];
        return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
    };

    // Las piezas de marca fijan esta escala para que el relieve no se estire en imágenes anchas.
    const fixedScale = Number(canvas.dataset.scale) || 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rows = 44;
    let cols = 110;
    let running = false;
    let visible = true;
    let last = 0;
    let slowFrames = 0;
    let pointer = 0;
    let parallax = 0;

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        rows = width < 720 ? 30 : 44;
        cols = width < 720 ? 64 : Math.min(600, Math.round(width / 11));
        draw(last);
    };

    function draw(time: number) {
        if (!width || !height) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const horizon = height * 0.34;
        const glow = ctx.createLinearGradient(0, 0, 0, horizon + height * 0.1);
        glow.addColorStop(0, 'rgba(255, 45, 120, 0)');
        glow.addColorStop(1, 'rgba(255, 45, 120, 0.2)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, horizon + height * 0.1);

        const near = 1;
        const far = 15;
        const step = (far - near) / rows;
        const scroll = time * 0.00022;
        const offset = scroll % step;
        const sweep = far - ((time * 0.0016) % (far - near + 8));
        const margin = width / cols;
        const center = width / 2 + parallax * 30;
        const worldWidth = fixedScale || Math.max(width, 900);
        ctx.lineJoin = 'bevel';

        for (let i = rows; i >= 0; i--) {
            const depth = near + i * step - offset;
            if (depth < 0.55) continue;

            const perspective = 1 / depth;
            const base = horizon + (height * 1.18 - horizon) * perspective;
            const worldZ = depth + scroll;
            const progress = clamp01((depth - near) / (far - near));
            const appear = clamp01((far - depth) / 2.2);
            // Llanura adelante y cordillera atrás, como el paisaje de Tucumán.
            const rise = 0.09 + smoothstep(2.5, 10, depth) * 0.91;
            const lift = perspective * height * (1.2 + depth * 0.38) * rise;

            // La misma línea se usa para tapar lo que queda detrás y para el trazo de neón.
            const ridge = new Path2D();
            for (let c = -1; c <= cols + 1; c++) {
                const x = (c / cols) * width;
                const worldX = ((x - center) / (worldWidth * 0.5)) * depth;
                const noise = sample(worldX * 0.075 + 0.31, worldZ * 0.075);
                const y = base - Math.pow(noise, 1.9) * lift;
                if (c === -1) ridge.moveTo(x, y);
                else ridge.lineTo(x, y);
            }

            const silhouette = new Path2D(ridge);
            silhouette.lineTo(width + margin, height + 2);
            silhouette.lineTo(-margin, height + 2);
            silhouette.closePath();
            ctx.fillStyle = `rgba(${VOID}, ${appear})`;
            ctx.fill(silhouette);

            // Una sola línea verde recorre el relieve, como un barrido de radar.
            if (Math.abs(depth - sweep) < step * 0.5) {
                ctx.strokeStyle = `rgba(${VOLT}, ${appear})`;
                ctx.lineWidth = 1.6;
            } else {
                const color = progress < 0.3 ? mix(NEAR, MID, progress / 0.3) : mix(MID, FAR, clamp01((progress - 0.3) / 0.45));
                ctx.strokeStyle = `rgba(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0}, ${appear * (0.65 + progress * 0.35)})`;
                ctx.lineWidth = 0.7 + (1 - progress) * 0.6;
            }
            ctx.stroke(ridge);
        }

        // La parte baja se funde con el fondo de la sección siguiente.
        const fadeOut = ctx.createLinearGradient(0, height * 0.8, 0, height);
        fadeOut.addColorStop(0, `rgba(${VOID}, 0)`);
        fadeOut.addColorStop(1, `rgba(${VOID}, 1)`);
        ctx.fillStyle = fadeOut;
        ctx.fillRect(0, height * 0.8, width, height * 0.2);
    }

    const loop = (time: number) => {
        if (!running) return;
        requestAnimationFrame(loop);
        const elapsed = time - last;
        if (elapsed < FRAME_MS) return;

        // Si el equipo no llega, baja el detalle en lugar de trabarse.
        if (elapsed > 55 && last) {
            slowFrames++;
            if (slowFrames > 12 && rows > 20) {
                rows = Math.round(rows * 0.8);
                cols = Math.round(cols * 0.8);
                slowFrames = 0;
            }
        } else {
            slowFrames = Math.max(0, slowFrames - 1);
        }

        last = time;
        parallax += (pointer - parallax) * 0.05;
        draw(time);
    };

    const play = () => {
        if (running || reduced || !visible || document.hidden) return;
        running = true;
        requestAnimationFrame(loop);
    };
    const pause = () => { running = false; };

    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
    if (!reduced) {
        window.addEventListener('pointermove', (event) => {
            pointer = (event.clientX / window.innerWidth - 0.5) * 2;
        }, { passive: true });
    }

    resize();
    play();
}

const canvas = document.querySelector<HTMLCanvasElement>('[data-terrain]');
if (canvas) start(canvas);
