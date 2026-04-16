/* =========================================================
   SHARED VISUAL ENHANCEMENTS JS
   Applied to all sub-pages (01–04+)
   ========================================================= */

// ===== Constellation Canvas Network =====
class ConstellationCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
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
        const count = Math.min(Math.floor(area / 16000), 80);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                isAccent: Math.random() > 0.55,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => { this.resize(); this.createParticles(); });
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

            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += (dx / dist) * force * 1.2;
                    p.y += (dy / dist) * force * 1.2;
                }
            }

            const alpha = 0.25 + Math.sin(p.pulse) * 0.15;
            const color = p.isAccent ? 'rgba(232,164,74,' + alpha + ')' : 'rgba(196,111,211,' + alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size + Math.sin(p.pulse) * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            this.ctx.fillStyle = p.isAccent ? 'rgba(232,164,74,' + (alpha * 0.06) + ')' : 'rgba(196,111,211,' + (alpha * 0.06) + ')';
            this.ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    let lineAlpha = (1 - dist / 120) * 0.1;
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
                    this.ctx.strokeStyle = 'rgba(232,164,74,' + lineAlpha + ')';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

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
                this.ctx.strokeStyle = 'rgba(196,111,211,' + a + ')';
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
            if (this.frame >= end) { complete++; output += to; }
            else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += '<span class="scramble-char">' + char + '</span>';
            } else { output += '\u00A0'; }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) this.resolve();
        else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
    }
}

// ===== Init: run after DOM ready =====
(function initSharedEnhancements() {
    // Wait for DOMContentLoaded if not already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // --- Constellation Canvas ---
        const constellationCanvas = document.getElementById('constellation');
        if (constellationCanvas) new ConstellationCanvas(constellationCanvas);

        // --- Enhanced Particles (add rings + glow to existing) ---
        const particleContainer = document.getElementById('particles');
        if (particleContainer) {
            // Add glow to existing particles
            particleContainer.querySelectorAll('.particle').forEach(p => {
                const bg = p.style.background || 'rgba(232,164,74,0.4)';
                const size = parseFloat(p.style.width) || 3;
                p.style.boxShadow = '0 0 ' + (size * 3) + 'px ' + bg;
            });

            // Add ring particles
            for (let i = 0; i < 6; i++) {
                const ring = document.createElement('div');
                ring.classList.add('particle-ring');
                const size = Math.random() * 25 + 12;
                ring.style.width = size + 'px';
                ring.style.height = size + 'px';
                ring.style.left = Math.random() * 100 + '%';
                ring.style.borderColor = Math.random() > 0.5
                    ? 'rgba(232,164,74,0.15)' : 'rgba(196,111,211,0.1)';
                ring.style.animationDuration = (Math.random() * 18 + 12) + 's';
                ring.style.animationDelay = (Math.random() * 10) + 's';
                particleContainer.appendChild(ring);
            }
        }

        // --- Floating Geometric Shapes ---
        const shapesContainer = document.getElementById('floatingShapes');
        if (shapesContainer) {
            const shapes = ['circle', 'square', 'diamond'];
            const colors = ['rgba(232,164,74,', 'rgba(196,111,211,'];
            for (let i = 0; i < 10; i++) {
                const shape = document.createElement('div');
                const type = shapes[Math.floor(Math.random() * shapes.length)];
                shape.classList.add('floating-shape', 'shape-' + type);
                const size = Math.random() * 18 + 8;
                shape.style.width = size + 'px';
                shape.style.height = size + 'px';
                shape.style.left = Math.random() * 100 + '%';
                shape.style.borderColor = colors[Math.floor(Math.random() * colors.length)] + '0.15)';
                shape.style.animationDuration = (Math.random() * 20 + 15) + 's';
                shape.style.animationDelay = (Math.random() * 15) + 's';
                shapesContainer.appendChild(shape);
            }
        }

        // --- Enhanced Cursor Glow (smooth lerp) ---
        const cursorGlow = document.getElementById('cursorGlow');
        if (cursorGlow) {
            let cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;
            document.addEventListener('mousemove', (e) => { cursorX = e.clientX; cursorY = e.clientY; });
            (function updateGlow() {
                glowX += (cursorX - glowX) * 0.07;
                glowY += (cursorY - glowY) * 0.07;
                cursorGlow.style.left = glowX + 'px';
                cursorGlow.style.top = glowY + 'px';
                requestAnimationFrame(updateGlow);
            })();
        }

        // --- Scroll Progress Bar ---
        const scrollProgressBar = document.getElementById('scrollProgress');
        if (scrollProgressBar) {
            window.addEventListener('scroll', () => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                scrollProgressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
            }, { passive: true });
        }

        // --- Enhanced Hero Parallax (lerp) ---
        const pageHero = document.querySelector('.page-hero');
        const heroContent = document.querySelector('.page-hero-content');
        if (pageHero && heroContent) {
            let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
            pageHero.addEventListener('mousemove', (e) => {
                const rect = pageHero.getBoundingClientRect();
                targetX = (e.clientX - rect.left - rect.width / 2) / rect.width;
                targetY = (e.clientY - rect.top - rect.height / 2) / rect.height;
            });
            pageHero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

            (function updateParallax() {
                currentX += (targetX - currentX) * 0.04;
                currentY += (targetY - currentY) * 0.04;
                heroContent.style.transform = 'translate(' + (currentX * -15) + 'px,' + (currentY * -15) + 'px)';
                // Move aurora bands
                document.querySelectorAll('.aurora-band').forEach((band, i) => {
                    const f = (i + 1) * 8;
                    band.style.transform = 'translateX(' + (currentX * f) + 'px) translateY(' + (currentY * f) + 'px)';
                });
                requestAnimationFrame(updateParallax);
            })();

            // Scroll-based hero fade & parallax
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                heroContent.style.opacity = Math.max(0, 1 - scrolled / 500);
            }, { passive: true });
        }

        // --- Enhanced Key Point / Card Tilt ---
        document.querySelectorAll('.key-point, .genre-card, .gallery-card, .page-nav-link').forEach((card) => {
            // Make position relative for shimmer/ripple
            card.style.position = 'relative';
            card.style.overflow = 'hidden';

            // Add shimmer element
            const shimmer = document.createElement('div');
            shimmer.classList.add('card-shimmer');
            card.appendChild(shimmer);

            // Enhanced tilt
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'translateY(-4px) perspective(600px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.3s ease, box-shadow 0.3s ease';
                setTimeout(() => { card.style.transition = ''; }, 500);
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

        // --- Timeline Items Enhanced ---
        document.querySelectorAll('.timeline-content').forEach((content) => {
            content.style.position = 'relative';
            content.style.overflow = 'hidden';
            const shimmer = document.createElement('div');
            shimmer.classList.add('card-shimmer');
            content.appendChild(shimmer);
        });

        // --- Text Scramble on Page Subtitle ---
        const pageSubtitle = document.querySelector('.page-subtitle');
        if (pageSubtitle) {
            const originalText = pageSubtitle.textContent;
            const scramble = new TextScramble(pageSubtitle);
            setTimeout(() => scramble.setText(originalText), 1200);
        }

        // --- Rotating CSS Variable (for potential conic-gradient borders) ---
        (function animateAngle() {
            const angle = (Date.now() / 1000 * 90) % 360;
            document.documentElement.style.setProperty('--border-angle', angle + 'deg');
            requestAnimationFrame(animateAngle);
        })();

        // --- Image Clickable Hover Tilt ---
        document.querySelectorAll('.image-clickable').forEach(img => {
            img.addEventListener('mousemove', (e) => {
                const rect = img.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                img.style.transform = 'scale(1.03) perspective(600px) rotateX(' + (y * -4) + 'deg) rotateY(' + (x * 4) + 'deg)';
            });
            img.addEventListener('mouseleave', () => {
                img.style.transform = '';
                img.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease';
                setTimeout(() => { img.style.transition = ''; }, 400);
            });
        });

        // --- Floating Music Player Button with Iframe Modal ---
        // Create the button
        const musicBtn = document.createElement('button');
        musicBtn.id = 'floating-music-btn';
        musicBtn.className = 'floating-music-btn';
        musicBtn.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
        musicBtn.title = 'Open Music Player';
        
        // Create the modal overlay
        const musicModal = document.createElement('div');
        musicModal.id = 'music-modal';
        musicModal.className = 'music-modal';
        musicModal.innerHTML = `
            <div class="music-modal-content">
                <button class="music-modal-close" aria-label="Close">&times;</button>
                <iframe src="https://miner3001.github.io/minerify/index.html" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                </iframe>
            </div>
        `;

        // Append to body
        document.body.appendChild(musicBtn);
        document.body.appendChild(musicModal);

        // Event listeners
        musicBtn.addEventListener('click', () => {
            musicModal.classList.add('active');
        });

        const closeBtn = musicModal.querySelector('.music-modal-close');
        closeBtn.addEventListener('click', () => {
            musicModal.classList.remove('active');
        });

        // Close on overlay click
        musicModal.addEventListener('click', (e) => {
            if (e.target === musicModal) {
                musicModal.classList.remove('active');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && musicModal.classList.contains('active')) {
                musicModal.classList.remove('active');
            }
        });
    }
})();
