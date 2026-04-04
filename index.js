// ===== Constellation Canvas Network =====
class ConstellationCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 180 };
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        const area = this.canvas.width * this.canvas.height;
        const count = Math.min(Math.floor(area / 14000), 110);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                size: Math.random() * 2 + 0.5,
                isAccent: Math.random() > 0.55,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        this.canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        this.canvas.parentElement.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += 0.02;

            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = this.canvas.height + 10;
            if (p.y > this.canvas.height + 10) p.y = -10;

            // Mouse repulsion
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += (dx / dist) * force * 1.5;
                    p.y += (dy / dist) * force * 1.5;
                }
            }

            // Draw particle with pulse
            const alpha = 0.25 + Math.sin(p.pulse) * 0.15;
            const color = p.isAccent
                ? `rgba(232,164,74,${alpha})`
                : `rgba(196,111,211,${alpha})`;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size + Math.sin(p.pulse) * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // Soft glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            this.ctx.fillStyle = p.isAccent
                ? `rgba(232,164,74,${alpha * 0.06})`
                : `rgba(196,111,211,${alpha * 0.06})`;
            this.ctx.fill();

            // Connect nearby
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    let lineAlpha = (1 - dist / 130) * 0.1;
                    if (this.mouse.x !== null) {
                        const mx = (p.x + p2.x) / 2 - this.mouse.x;
                        const my = (p.y + p2.y) / 2 - this.mouse.y;
                        const mDist = Math.sqrt(mx * mx + my * my);
                        if (mDist < this.mouse.radius) {
                            lineAlpha *= 1 + (1 - mDist / this.mouse.radius) * 3;
                        }
                    }
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(232,164,74,${lineAlpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        // Mouse connection lines
        if (this.mouse.x !== null) {
            const nearest = [];
            for (const p of this.particles) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius * 1.2) nearest.push({ p, dist });
            }
            nearest.sort((a, b) => a.dist - b.dist);
            for (let i = 0; i < Math.min(nearest.length, 5); i++) {
                const { p, dist } = nearest[i];
                const a = (1 - dist / (this.mouse.radius * 1.2)) * 0.2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(p.x, p.y);
                this.ctx.strokeStyle = `rgba(196,111,211,${a})`;
                this.ctx.lineWidth = 0.7;
                this.ctx.stroke();
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ===== Text Scramble Effect =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < newText.length; i++) {
            const start = Math.floor(Math.random() * 30);
            const end = start + Math.floor(Math.random() * 30);
            this.queue.push({ to: newText[i], start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0; i < this.queue.length; i++) {
            let { to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += '<span class="scramble-char">' + char + '</span>';
            } else {
                output += '\u00A0';
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// ===== Initialize Constellation =====
const constellationCanvas = document.getElementById('constellation');
if (constellationCanvas) new ConstellationCanvas(constellationCanvas);

// ===== Floating Particles (enhanced) =====
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['rgba(232,164,74,0.5)', 'rgba(196,111,211,0.4)', 'rgba(228,228,232,0.15)'];

    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 1.5;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        const c = colors[Math.floor(Math.random() * colors.length)];
        p.style.background = c;
        p.style.boxShadow = '0 0 ' + (size * 3) + 'px ' + c;
        p.style.animationDuration = (Math.random() * 14 + 8) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        container.appendChild(p);
    }

    // Ring particles
    for (let i = 0; i < 8; i++) {
        const ring = document.createElement('div');
        ring.classList.add('particle-ring');
        const size = Math.random() * 30 + 15;
        ring.style.width = size + 'px';
        ring.style.height = size + 'px';
        ring.style.left = Math.random() * 100 + '%';
        ring.style.borderColor = Math.random() > 0.5
            ? 'rgba(232,164,74,0.15)' : 'rgba(196,111,211,0.1)';
        ring.style.animationDuration = (Math.random() * 18 + 12) + 's';
        ring.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(ring);
    }
})();

// ===== Floating Geometric Shapes =====
(function createFloatingShapes() {
    const container = document.getElementById('floatingShapes');
    if (!container) return;
    const shapes = ['circle', 'square', 'diamond'];
    const colors = ['rgba(232,164,74,', 'rgba(196,111,211,'];

    for (let i = 0; i < 12; i++) {
        const shape = document.createElement('div');
        const type = shapes[Math.floor(Math.random() * shapes.length)];
        shape.classList.add('floating-shape', 'shape-' + type);
        const size = Math.random() * 20 + 8;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.borderColor = colors[Math.floor(Math.random() * colors.length)] + '0.15)';
        shape.style.animationDuration = (Math.random() * 20 + 15) + 's';
        shape.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(shape);
    }
})();

// ===== Cursor Glow (smooth lerp) =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
    let cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    (function updateGlow() {
        glowX += (cursorX - glowX) * 0.07;
        glowY += (cursorY - glowY) * 0.07;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(updateGlow);
    })();
}

// ===== Enhanced Card Effects =====
document.querySelectorAll('.toc-card').forEach((card) => {
    // Add border glow
    const borderGlow = document.createElement('div');
    borderGlow.classList.add('card-border-glow');
    card.appendChild(borderGlow);

    // Add shimmer
    const shimmer = document.createElement('div');
    shimmer.classList.add('card-shimmer');
    card.appendChild(shimmer);

    // Mouse-follow glow
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });

    // Click ripple
    card.addEventListener('click', (e) => {
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Scroll Reveal Observer =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.section-heading, .footer').forEach((el) => {
    revealObserver.observe(el);
});

// ===== Staggered Card Entrance =====
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.08 });

document.querySelectorAll('.toc-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = (i * 0.12) + 's';
    cardObserver.observe(card);
});

// ===== Parallax on Hero (smooth lerp) =====
const heroContent = document.querySelector('.hero-content');
const hero = document.querySelector('.hero');
if (hero && heroContent) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left - rect.width / 2) / rect.width;
        targetY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    });
    hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

    (function updateParallax() {
        currentX += (targetX - currentX) * 0.04;
        currentY += (targetY - currentY) * 0.04;
        heroContent.style.transform = 'translate(' + (currentX * -18) + 'px,' + (currentY * -18) + 'px)';

        // Move aurora bands
        document.querySelectorAll('.aurora-band').forEach((band, i) => {
            const f = (i + 1) * 10;
            band.style.transform = 'translateX(' + (currentX * f) + 'px) translateY(' + (currentY * f) + 'px)';
        });

        requestAnimationFrame(updateParallax);
    })();
}

// ===== Tilt effect on cards (enhanced 3D) =====
document.querySelectorAll('.toc-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-10px) scale(1.03) perspective(800px) rotateX(' + (y * -8) + 'deg) rotateY(' + (x * 8) + 'deg)';
        const inner = card.querySelector('.toc-card-inner');
        if (inner) inner.style.transform = 'translateX(' + (x * 8) + 'px) translateY(' + (y * 8) + 'px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
        const inner = card.querySelector('.toc-card-inner');
        if (inner) {
            inner.style.transform = '';
            inner.style.transition = 'transform 0.5s ease';
        }
        setTimeout(() => {
            card.style.transition = '';
            const inner = card.querySelector('.toc-card-inner');
            if (inner) inner.style.transition = '';
        }, 500);
    });
});

// ===== Scroll Progress Bar =====
const scrollProgressBar = document.getElementById('scrollProgress');
if (scrollProgressBar) {
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }, { passive: true });
}

// ===== Scroll-driven parallax for hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (hero) {
        const overlay = hero.querySelector('.hero-overlay');
        if (overlay) overlay.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        if (heroContent) heroContent.style.opacity = Math.max(0, 1 - scrolled / 500);
    }
}, { passive: true });

// ===== Rotating border angle (JS for cross-browser) =====
(function animateAngle() {
    const angle = (Date.now() / 1000 * 90) % 360;
    document.documentElement.style.setProperty('--border-angle', angle + 'deg');
    requestAnimationFrame(animateAngle);
})();

// ===== Hero Subtitle Scramble =====
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    const scramble = new TextScramble(heroSubtitle);
    setTimeout(() => scramble.setText(originalText), 1300);
}

// ===== Magnetic CTA Button =====
const ctaButton = document.querySelector('.hero-cta');
if (ctaButton && hero) {
    hero.addEventListener('mousemove', (e) => {
        const rect = ctaButton.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
            const force = (160 - dist) / 160;
            ctaButton.style.transform = 'translate(' + (dx * force * 0.3) + 'px,' + (dy * force * 0.3) + 'px) scale(' + (1 + force * 0.07) + ')';
        } else {
            ctaButton.style.transform = '';
        }
    });
    hero.addEventListener('mouseleave', () => { ctaButton.style.transform = ''; });
}

// ===== Counter Animation for Card Numbers =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.textContent);
        if (isNaN(target) || el.dataset.counted) return;
        el.dataset.counted = 'true';
        const startTime = performance.now();
        const duration = 900;
        (function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(eased * target)).padStart(2, '0');
            if (progress < 1) requestAnimationFrame(tick);
        })(startTime);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.toc-number').forEach(n => counterObserver.observe(n));
