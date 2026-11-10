
/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {

    navLinks.classList.toggle('active');

    const icon = menuToggle.querySelector('i');

    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');

});

document.querySelectorAll('.nav-links a').forEach(link => {

    link.addEventListener('click', () => {

        navLinks.classList.remove('active');

        const icon = menuToggle.querySelector('i');

        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');

    });

});


/* =========================================
   2. SCROLL REVEAL ANIMATIONS
========================================= */

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add('visible');

            revealObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.12
});

document.querySelectorAll('.reveal').forEach(element => {

    revealObserver.observe(element);

});


/* =========================================
   3. PARTICLE BACKGROUND ANIMATION
========================================= */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationFrame;

const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();

}

function createParticles() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const particleCount = Math.min(
        90,
        Math.floor(width * height / 10000)
    );

    particles = [];

    for (let i = 0; i < particleCount; i++) {

        particles.push({

            x: Math.random() * width,
            y: Math.random() * height,

            size: Math.random() * 1.8 + 0.5,

            speedX: (Math.random() - 0.5) * 0.35,
            speedY: (Math.random() - 0.5) * 0.35,

            opacity: Math.random() * 0.5 + 0.15,

            color: Math.random() > 0.5
                ? '181, 80, 230'
                : '39, 136, 245'

        });

    }

}

function drawParticles() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {

        if (!reducedMotion) {

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > width) {
                particle.speedX *= -1;
            }

            if (particle.y < 0 || particle.y > height) {
                particle.speedY *= -1;
            }

        }

        // Draw particle

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(${particle.color}, ${particle.opacity})`;

        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${particle.color}, 0.5)`;

        ctx.fill();

        ctx.shadowBlur = 0;

        // Connect nearby particles

        for (let j = index + 1; j < particles.length; j++) {

            const other = particles[j];

            const dx = particle.x - other.x;
            const dy = particle.y - other.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {

                ctx.beginPath();

                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);

                ctx.strokeStyle =
                    `rgba(140, 90, 200, ${0.12 * (1 - distance / 110)})`;

                ctx.lineWidth = 0.5;
                ctx.stroke();

            }

        }

    });

    if (!reducedMotion) {

        animationFrame = requestAnimationFrame(drawParticles);

    }

}

resizeCanvas();
drawParticles();

window.addEventListener('resize', () => {

    cancelAnimationFrame(animationFrame);

    resizeCanvas();
    drawParticles();

});


/* =========================================
   4. INTERACTIVE SECTION NAVIGATION
========================================= */

const sections = document.querySelectorAll(
    '#home, #about, #experience, #achievements, #education, #skills, #contact'
);

const sectionNavItems = document.querySelectorAll(
    '.section-nav-item'
);

function setActiveSection(sectionId) {

    sectionNavItems.forEach(item => {

        item.classList.toggle(
            'active',
            item.dataset.section === sectionId
        );

    });

}

const sectionObserver = new IntersectionObserver(entries => {

    const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleSections.length > 0) {

        setActiveSection(visibleSections[0].target.id);

    }

}, {
    rootMargin: '-15% 0px -55% 0px',
    threshold: [0, 0.1, 0.25, 0.5]
});

sections.forEach(section => {

    sectionObserver.observe(section);

});

// Click navigation

sectionNavItems.forEach(item => {

    item.addEventListener('click', () => {

        const target = document.getElementById(
            item.dataset.section
        );

        if (target) {

            target.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth'
            });

            setActiveSection(item.dataset.section);

        }

    });

});


/* =========================================
   5. AUTOMATIC FOOTER YEAR
========================================= */

document.getElementById('year').textContent =
    new Date().getFullYear();
