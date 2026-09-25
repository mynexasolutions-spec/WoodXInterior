/* NAV */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

/* HAMBURGER & MOBILE DROPDOWN */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileServicesToggle = document.getElementById('mobileServicesToggle');
const mobileServicesMenu = document.getElementById('mobileServicesMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => { 
        hamburger.classList.toggle('open'); 
        mobileMenu.classList.toggle('open'); 
    });
}

if (mobileServicesToggle && mobileServicesMenu) {
    mobileServicesToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileServicesToggle.classList.toggle('open');
        mobileServicesMenu.classList.toggle('open');
    });
}

function closeMobile() { 
    if (hamburger) hamburger.classList.remove('open'); 
    if (mobileMenu) mobileMenu.classList.remove('open'); 
    if (mobileServicesToggle) mobileServicesToggle.classList.remove('open');
    if (mobileServicesMenu) mobileServicesMenu.classList.remove('open');
}

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const t = document.querySelector(href);
        if (t) window.scrollTo({ top: t.offsetTop - 72, behavior: 'smooth' });
        closeMobile();
    });
});

/* PARALLAX */
const parallaxBg = document.getElementById('parallaxBg');
const ctaBg = document.getElementById('ctaBg');
window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (parallaxBg) { 
        const r = parallaxBg.parentElement.getBoundingClientRect(); 
        parallaxBg.style.transform = `translateY(${-r.top * 0.22}px)`; 
    }
    if (ctaBg) { 
        const r2 = ctaBg.parentElement.getBoundingClientRect(); 
        ctaBg.style.transform = `translateY(${-r2.top * 0.22}px)`; 
    }
}, { passive: true });

/* SCROLL REVEAL */
const io = new IntersectionObserver(entries => {
    entries.forEach(e => { 
        if (e.isIntersecting) { 
            e.target.classList.add('visible'); 
            io.unobserve(e.target); 
        } 
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => io.observe(el));

/* FAQ */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

/* CAROUSEL */
const track = document.getElementById('carouselTrack');
if (track) {
    const cards = track.querySelectorAll('.testi-card');
    const dotsEl = document.getElementById('carouselDots');
    let ci = 0, dragStart = 0, dragging = false;

    function vis() { return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3; }
    function buildDots() {
        dotsEl.innerHTML = '';
        const pages = Math.ceil(cards.length / vis());
        for (let i = 0; i < pages; i++) {
            const d = document.createElement('button');
            d.className = 'dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => { ci = i * vis(); update(); });
            dotsEl.appendChild(d);
        }
    }
    function update() {
        const v = vis(), gap = 24;
        const w = (track.parentElement.offsetWidth - gap * (v - 1)) / v;
        track.style.transform = `translateX(-${ci * (w + gap)}px)`;
        dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === Math.floor(ci / v)));
    }
    document.getElementById('prevBtn').addEventListener('click', () => { ci = Math.max(0, ci - vis()); update(); });
    document.getElementById('nextBtn').addEventListener('click', () => { ci = Math.min(cards.length - vis(), ci + vis()); update(); });
    track.addEventListener('mousedown', e => { dragging = true; dragStart = e.clientX; track.classList.add('dragging'); });
    window.addEventListener('mouseup', () => { dragging = false; track.classList.remove('dragging'); });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        const diff = dragStart - e.clientX;
        if (Math.abs(diff) > 60) { dragging = false; track.classList.remove('dragging'); if (diff > 0) ci = Math.min(cards.length - vis(), ci + vis()); else ci = Math.max(0, ci - vis()); update(); }
    });
    track.addEventListener('touchstart', e => { dragStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = dragStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { if (diff > 0) ci = Math.min(cards.length - vis(), ci + vis()); else ci = Math.max(0, ci - vis()); update(); }
    }, { passive: true });
    buildDots(); update();
    window.addEventListener('resize', () => { ci = 0; buildDots(); update(); });
}

/* FORM */
function submitForm() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value : '';
    const phone = phoneInput ? phoneInput.value : '';
    const address = addressInput ? addressInput.value : '';
    const message = messageInput ? messageInput.value : '';

    if(!name || !phone || !address) {
        alert('Please fill in the required fields (Name, Phone, and Address).');
        return;
    }

    const whatsappNumber = "919759047747"; // Updated WhatsApp number
    let text = `*New Inquiry from WoodX Interior Website*%0A%0A`;
    text += `*Name:* ${name}%0A`;
    text += `*Phone:* ${phone}%0A`;
    text += `*Address:* ${address}%0A`;
    if(message) {
        text += `*Project Details:* ${message}%0A`;
    }

    const url = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, '_blank').focus();
}
function enquireService(serviceName) {
    const whatsappNumber = "919759047747";
    const text = `Hi! I'm interested in your *${serviceName}* service. Could you please provide more details?`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank').focus();
}
