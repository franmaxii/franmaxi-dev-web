// Exporta las piezas de marca a PNG con Firefox en modo headless.
// Uso: npm run brand            (exporta todo)
//      npm run brand -- carrusel (solo las piezas cuyo nombre incluye ese texto)
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { posts, terrains } from './posts.mjs';

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const exportDir = join(here, 'export');
const assetDir = join(here, 'assets');
const filter = process.argv[2];

const FONTS = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@700;800&family=Geist:wght@400;500&family=JetBrains+Mono:wght@500;700&display=block';

const profile = await mkdtemp(join(tmpdir(), 'franmaxi-brand-'));

async function shot(url, output, width, height) {
    await mkdir(dirname(output), { recursive: true });
    await run('firefox', ['--headless', '--no-remote', '--profile', profile, `--window-size=${width},${height}`, '--screenshot', output, url], { timeout: 120_000 });
}

function page(width, height, body, base) {
    return `<!doctype html><html lang="es"><head><meta charset="utf-8"><base href="${base}">
        <link rel="stylesheet" href="${FONTS}"><link rel="stylesheet" href="post.css">
        <style>html,body{width:${width}px;height:${height}px}</style></head><body>${body}</body></html>`;
}

// El relieve se genera con el mismo código del hero de la web.
async function renderTerrains() {
    const missing = terrains.filter((item) => !existsSync(join(assetDir, item.file)));
    if (!missing.length) return;

    const bundle = join(profile, 'terrain.js');
    await run(join(root, 'node_modules/.bin/esbuild'), [join(root, 'src/scripts/terrain.ts'), '--bundle', '--format=iife', `--outfile=${bundle}`]);

    for (const item of missing) {
        const html = join(profile, `${item.file}.html`);
        await writeFile(html, `<!doctype html><html><body style="margin:0;background:#05060a;overflow:hidden">
            <canvas data-terrain data-scale="1080" style="display:block;width:${item.width}px;height:${item.height}px"></canvas>
            <script src="terrain.js"></script></body></html>`);
        await shot(`file://${html}`, join(assetDir, item.file), item.width, item.height);
        console.log('relieve', item.file);
    }
}

await mkdir(assetDir, { recursive: true });
await renderTerrains();

const base = `file://${here}/`;
const htmlDir = join(here, '.tmp');
await mkdir(htmlDir, { recursive: true });

for (const post of posts) {
    if (filter && !post.file.includes(filter)) continue;
    const output = join(exportDir, post.file);

    if (post.svg) {
        await mkdir(dirname(output), { recursive: true });
        await run('rsvg-convert', ['-w', String(post.width), '-h', String(post.height), join(here, post.svg), '-o', output]);
    } else {
        const html = join(htmlDir, `${post.file.replace(/[^a-z0-9]/gi, '-')}.html`);
        await writeFile(html, page(post.width, post.height, post.html, base));
        await shot(`file://${html}`, output, post.width, post.height);
    }
    console.log('listo', post.file);
}

await rm(htmlDir, { recursive: true, force: true });
await rm(profile, { recursive: true, force: true });
