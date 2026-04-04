// ===== Floating Particles =====
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['rgba(232,164,74,0.5)', 'rgba(196,111,211,0.4)', 'rgba(228,228,232,0.2)'];

    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (Math.random() * 12 + 8) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(p);
    }
})();

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .footer').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
    revealObserver.observe(el);
});

// ===== Parallax on hero scroll =====
const pageHero = document.querySelector('.page-hero');
const heroContent = document.querySelector('.page-hero-content');
if (pageHero && heroContent) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroContent.style.opacity = 1 - scrolled / 500;
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
}

// ===== Nav background on scroll =====
const nav = document.querySelector('.nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(14, 14, 18, 0.95)';
        } else {
            nav.style.background = 'rgba(14, 14, 18, 0.85)';
        }
    }, { passive: true });
}

// ===== Key point hover tilt =====
document.querySelectorAll('.key-point').forEach((point) => {
    point.addEventListener('mousemove', (e) => {
        const rect = point.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        point.style.transform = `translateY(-3px) perspective(500px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });

    point.addEventListener('mouseleave', () => {
        point.style.transform = '';
    });
});

// ===== Banksy Popup =====
const banksyImage = document.getElementById('banksyImage');
const banksyPopup = document.getElementById('banksyPopup');
const banksyClose = document.getElementById('banksyClose');

if (banksyImage && banksyPopup) {
    banksyImage.addEventListener('click', () => {
        banksyPopup.classList.add('active');
    });

    banksyClose.addEventListener('click', () => {
        banksyPopup.classList.remove('active');
    });

    banksyPopup.addEventListener('click', (e) => {
        if (e.target === banksyPopup) {
            banksyPopup.classList.remove('active');
        }
    });
}

// ===== NWA Popup + Media Player =====
const nwaImage = document.getElementById('nwaImage');
const nwaPopup = document.getElementById('nwaPopup');
const nwaClose = document.getElementById('nwaClose');
const nwaAudio = document.getElementById('nwaAudio');
const nwaPlayBtn = document.getElementById('nwaPlayBtn');
const nwaPlayIcon = document.getElementById('nwaPlayIcon');
const nwaProgress = document.getElementById('nwaProgress');
const nwaTime = document.getElementById('nwaTime');

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

if (nwaImage && nwaPopup && nwaAudio) {
    nwaImage.addEventListener('click', () => {
        nwaPopup.classList.add('active');
    });

    nwaClose.addEventListener('click', () => {
        nwaPopup.classList.remove('active');
        nwaAudio.pause();
    });

    nwaPopup.addEventListener('click', (e) => {
        if (e.target === nwaPopup) {
            nwaPopup.classList.remove('active');
            nwaAudio.pause();
        }
    });

    nwaPlayBtn.addEventListener('click', () => {
        if (nwaAudio.paused) {
            nwaAudio.play();
            nwaPlayIcon.className = 'bi bi-pause-fill';
        } else {
            nwaAudio.pause();
            nwaPlayIcon.className = 'bi bi-play-fill';
        }
    });

    nwaAudio.addEventListener('timeupdate', () => {
        if (nwaAudio.duration) {
            const pct = (nwaAudio.currentTime / nwaAudio.duration) * 100;
            nwaProgress.style.width = pct + '%';
            nwaTime.textContent = formatTime(nwaAudio.currentTime);
        }
    });

    nwaAudio.addEventListener('ended', () => {
        nwaPlayIcon.className = 'bi bi-play-fill';
        nwaProgress.style.width = '0%';
        nwaTime.textContent = '0:00';
    });

    document.querySelector('.player-track').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        if (nwaAudio.duration) {
            nwaAudio.currentTime = pct * nwaAudio.duration;
        }
    });
}

// ===== RDR2 Popup =====
const rdr2Image = document.getElementById('rdr2Image');
const rdr2Popup = document.getElementById('rdr2Popup');
const rdr2Close = document.getElementById('rdr2Close');

if (rdr2Image && rdr2Popup) {
    rdr2Image.addEventListener('click', () => {
        rdr2Popup.classList.add('active');
    });

    rdr2Close.addEventListener('click', () => {
        rdr2Popup.classList.remove('active');
    });

    rdr2Popup.addEventListener('click', (e) => {
        if (e.target === rdr2Popup) {
            rdr2Popup.classList.remove('active');
        }
    });
}
