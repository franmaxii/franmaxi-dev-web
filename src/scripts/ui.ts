// Interacciones comunes de la web: reloj, menú móvil, aparición al hacer scroll y efecto de texto.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startClock() {
    const clock = document.querySelector('[data-clock]');
    if (!clock) return;
    const format = new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Tucuman',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    const tick = () => { clock.textContent = format.format(new Date()); };
    tick();
    setInterval(tick, 1000);
}

function startMenu() {
    const button = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('hamburger-icon');
    if (!button || !menu || !icon) return;

    const setOpen = (open: boolean) => {
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        menu.classList.toggle('hidden', !open);
        icon.setAttribute('d', open ? 'M6 18 18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16');
    };

    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
    });
}

function scramble(element: Element) {
    const finalText = element.textContent ?? '';
    const glyphs = '/\\<>_-=+#*01';
    const started = performance.now();
    const duration = 450;

    const frame = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const solved = Math.floor(finalText.length * progress);
        element.textContent = finalText
            .split('')
            .map((char, index) => (index < solved || char === ' ' ? char : glyphs[Math.floor(Math.random() * glyphs.length)]))
            .join('');
        if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

function startReveal() {
    const items = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('in'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('in');
            entry.target.querySelectorAll('[data-scramble]').forEach(scramble);
            observer.unobserve(entry.target);
        }
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => observer.observe(item));
}

function startBrief() {
    const form = document.querySelector<HTMLFormElement>('[data-brief]');
    if (!form) return;
    const input = form.querySelector<HTMLInputElement>('input[name="text"]');
    if (!input) return;

    form.querySelectorAll<HTMLButtonElement>('[data-chip]').forEach((chip) => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.chip ?? '';
            input.focus();
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const need = input.value.trim();
        if (!need) {
            input.focus();
            return;
        }
        const message = `Hola FranMaxi, quiero construir esto: ${need}`;
        window.open(`${form.action}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
}

startClock();
startMenu();
startReveal();
startBrief();
