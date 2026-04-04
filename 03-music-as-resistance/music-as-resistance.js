/* ===== Music as Resistance — Chapter 03 JS ===== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Particles --- */
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('span');
            p.classList.add('particle');
            const size = Math.random() * 4 + 2;
            p.style.width  = size + 'px';
            p.style.height = size + 'px';
            p.style.left   = Math.random() * 100 + '%';
            p.style.background = Math.random() > 0.5
                ? 'rgba(232,164,74,0.4)'
                : 'rgba(196,111,211,0.4)';
            p.style.animationDuration = (Math.random() * 10 + 8) + 's';
            p.style.animationDelay    = (Math.random() * 8) + 's';
            particleContainer.appendChild(p);
        }
    }

    /* --- Cursor Glow (handled by shared-enhancements.js) --- */

    /* --- Scroll Reveal --- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObs.observe(el));

    /* --- Genre Card Stagger --- */
    const genreCards = document.querySelectorAll('.genre-card');
    const cardObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.parentElement.querySelectorAll('.genre-card');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('visible'), i * 120);
                });
                cardObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    if (genreCards.length > 0) {
        cardObs.observe(genreCards[0]);
    }

    /* --- Hero Parallax (handled by shared-enhancements.js) --- */

    /* --- Nav background on scroll --- */
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.style.background = window.scrollY > 100
                ? 'rgba(14,14,18,0.95)'
                : 'rgba(14,14,18,0.85)';
        });
    }

    /* --- Key-point tilt --- */
    document.querySelectorAll('.key-point').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-3px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* --- Footer reveal --- */
    const footer = document.querySelector('.footer');
    if (footer) {
        const fObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) footer.classList.add('visible');
        }, { threshold: 0.3 });
        fObs.observe(footer);
    }

    /* --- Popup Helpers --- */
    function setupPopup(triggerId, popupId, closeId, audioId) {
        const trigger = document.getElementById(triggerId);
        const popup   = document.getElementById(popupId);
        const close   = document.getElementById(closeId);
        const audio   = audioId ? document.getElementById(audioId) : null;
        if (!trigger || !popup) return;

        trigger.addEventListener('click', () => popup.classList.add('active'));

        function closePopup() {
            popup.classList.remove('active');
            if (audio) audio.pause();
        }

        if (close) close.addEventListener('click', closePopup);
        popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
    }

    setupPopup('marleyImage', 'marleyPopup', 'marleyClose', 'marleyAudio');
    setupPopup('nwaImage2',   'nwa2Popup',   'nwa2Close',   'nwa2Audio');

    /* --- Audio Player Helper --- */
    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function setupPlayer(audioId, playBtnId, playIconId, progressId, trackId, timeId) {
        const audio    = document.getElementById(audioId);
        const playBtn  = document.getElementById(playBtnId);
        const playIcon = document.getElementById(playIconId);
        const progress = document.getElementById(progressId);
        const track    = document.getElementById(trackId);
        const time     = document.getElementById(timeId);
        if (!audio || !playBtn) return;

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playIcon.className = 'bi bi-pause-fill';
            } else {
                audio.pause();
                playIcon.className = 'bi bi-play-fill';
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                progress.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
                time.textContent = formatTime(audio.currentTime);
            }
        });

        audio.addEventListener('ended', () => {
            playIcon.className = 'bi bi-play-fill';
            progress.style.width = '0%';
            time.textContent = '0:00';
        });

        track.addEventListener('click', e => {
            const rect = track.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            if (audio.duration) audio.currentTime = pct * audio.duration;
        });
    }

    setupPlayer('marleyAudio', 'marleyPlayBtn', 'marleyPlayIcon', 'marleyProgress', 'marleyTrack', 'marleyTime');
    setupPlayer('nwa2Audio',   'nwa2PlayBtn',   'nwa2PlayIcon',   'nwa2Progress',   'nwa2Track',   'nwa2Time');

    /* --- Close popups with Escape --- */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.popup-overlay.active').forEach(p => {
                p.classList.remove('active');
            });
            document.querySelectorAll('audio').forEach(a => a.pause());
        }
    });
});
