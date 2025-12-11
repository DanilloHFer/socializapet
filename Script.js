// Create Particle System (Desabilitado para melhor legibilidade)
function createParticles() {
    // Sistema de partículas desabilitado para evitar sobreposição
    return;
}

// Scroll Progress Bar (Desabilitado)
function updateScrollProgress() {
    // Barra de progresso desabilitada para evitar conflitos
    return;
}

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Add bounce effect
        if (navMenu.classList.contains('active')) {
            navMenu.style.animation = 'slideInBounce 0.6s ease-out';
        }
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Add bounce animation styling
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInBounce {
        0% { 
            left: -100%; 
            transform: scale(0.8);
        }
        60% { 
            left: 5%; 
            transform: scale(1.05);
        }
        100% { 
            left: 0; 
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Banner Carousel Functionality (Base Logic)
let currentSlide = 0;
// We'll select these dynamically in the functions that populate them or here if static
// But since they are dynamic, we might need to re-select or use event delegation.
// For now, these selectors might return empty lists if content isn't loaded yet.
// We will move the carousel logic inside the initialization or update functions.

function initializeBannerCarousel() {
    const slides = document.querySelectorAll('.hero-banner-slide');
    const dots = document.querySelectorAll('.hero-banner-dot');

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        if (slides[index] && dots[index]) {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-play
    // Clear any existing interval to prevent duplicates
    if (window.carouselInterval) clearInterval(window.carouselInterval);

    if (slides.length > 1) {
        window.carouselInterval = setInterval(nextSlide, 5000);

        const bannerContainer = document.querySelector('.hero-banner-container');
        if (bannerContainer) {
            bannerContainer.addEventListener('mouseenter', () => clearInterval(window.carouselInterval));
            bannerContainer.addEventListener('mouseleave', () => window.carouselInterval = setInterval(nextSlide, 5000));
        }
    }

    // Global helper for dot clicks from generated HTML
    window.goToSlide = function (index) {
        showSlide(index);
    }
}

// Enhanced Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Add pulse effect
            target.style.animation = 'sectionPulse 1s ease-out';
            setTimeout(() => {
                target.style.animation = '';
            }, 1000);
        }
    });
});

// Add section pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes sectionPulse {
        0% { transform: scale(1); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        50% { transform: scale(1.02); box-shadow: 0 30px 80px rgba(242, 141, 178, 0.3); }
        100% { transform: scale(1); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
    }
`;
document.head.appendChild(pulseStyle);

// Enhanced Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        // Validation is handled in sendContactToWhatsApp, but we intercept here for UI
        // Actually, the onsubmit="sendContactToWhatsApp(event)" in HTML might conflict if we execute this too.
        // We will let the specific handler take care of it or this one. 
        // The HTML has `onsubmit="sendContactToWhatsApp(event)"`. 
        // We generally shouldn't have both. I'll rely on the specific function `sendContactToWhatsApp`.
        // So I won't add preventDefault here unless we remove the inline handler.
        // I will skipping adding this generic listener to avoid double submission logic.
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #43e97b, #38f9d7)' :
            type === 'error' ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' :
                'linear-gradient(45deg, #F28DB2, #0597F2)'};
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.4s ease;
        backdrop-filter: blur(10px);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 400);
    }, 5000);
}

// Animation on scroll with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';

            if (entry.target.classList.contains('blog-card')) {
                entry.target.style.animation = 'cardSlideUp 0.6s ease-out';
            } else if (entry.target.classList.contains('product-card')) {
                entry.target.style.animation = 'cardBounceIn 0.8s ease-out';
            } else if (entry.target.classList.contains('gallery-item')) {
                entry.target.style.animation = 'galleryZoom 0.7s ease-out';
            }
        }
    });
}, observerOptions);

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes cardSlideUp {
        from { opacity: 0; transform: translateY(50px) rotateX(20deg); }
        to { opacity: 1; transform: translateY(0) rotateX(0deg); }
    }
    @keyframes cardBounceIn {
        0% { opacity: 0; transform: scale(0.3) translateY(50px); }
        50% { opacity: 1; transform: scale(1.1) translateY(-10px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes galleryZoom {
        from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
        to { opacity: 1; transform: scale(1) rotate(0deg); }
    }
`;
document.head.appendChild(animationStyles);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.blog-card, .product-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.9)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Header background change on scroll
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Ripple Effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

// Gallery Interactions
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.zIndex = '10';
        this.style.transform = 'scale(1.1) rotate(3deg)';
    });
    item.addEventListener('mouseleave', function () {
        this.style.zIndex = '1';
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Product Card Interactions
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        const image = this.querySelector('img');
        if (image) image.style.transform = 'scale(1.2) rotate(2deg)';
        this.style.boxShadow = '0 40px 80px rgba(242, 141, 178, 0.4)';
    });
    card.addEventListener('mouseleave', function () {
        const image = this.querySelector('img');
        if (image) image.style.transform = 'scale(1) rotate(0deg)';
        this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
    });
});

// Admin Favicon
function applySiteFavicon() {
    const settings = JSON.parse(localStorage.getItem('socializaPetSettings') || '{}');
    if (settings.faviconUrl) {
        document.querySelectorAll('link[data-admin-favicon="true"]').forEach(link => link.remove());

        const sizes = ['16x16', '32x32', '48x48', '64x64'];
        sizes.forEach(size => {
            const favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/png';
            favicon.sizes = size;
            favicon.href = settings.faviconUrl;
            favicon.setAttribute('data-admin-favicon', 'true');
            document.head.appendChild(favicon);
        });
    }
}

// Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
document.addEventListener('keydown', function (e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) konamiCode.shift();
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'rainbowBackground 2s infinite';
        showNotification('🌈 Modo Arco-Íris Ativado! Seu pet ficaria orgulhoso! 🐾✨', 'success');
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `@keyframes rainbowBackground { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }`;
        document.head.appendChild(rainbowStyle);
        setTimeout(() => document.body.style.animation = '', 10000);
    }
});

// WhatsApp Contact
window.sendContactToWhatsApp = function (event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');
    if (submitText) submitText.style.display = 'none';
    if (loadingText) loadingText.style.display = 'inline';

    let whatsappMessage = "📝 *NOVO CONTATO - SOCIALIZAPET*\\n\\n" +
        `👤 *Nome:* ${name}\\n` +
        `📱 *Telefone:* ${phone}\\n` +
        `📧 *E-mail:* ${email}\\n\\n` +
        `💬 *Mensagem:*\\n${message}\\n\\n` +
        `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}\\n` +
        `🌐 *Origem:* Site SocializaPet`;

    const whatsappNumber = "5511999999999";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        document.getElementById('contactForm').reset();
        if (submitText) submitText.style.display = 'inline';
        if (loadingText) loadingText.style.display = 'none';
        showContactSuccess();
    }, 1500);
}

function showContactSuccess() {
    showNotification('Mensagem enviada com sucesso!', 'success');
}

// === Dynamic Content Loading ===

function loadDynamicContent() {
    loadBanners();
    loadBlogPosts();
    loadHomeGallery();
    loadSiteContent();
    loadSiteSettings();
}

// 1. Load Banners (Simplified)
function loadBanners() {
    let banners = JSON.parse(localStorage.getItem('bannersSimples') || '[]');

    if (banners.length === 0) {
        // Fallback or legacy check
        const allBanners = JSON.parse(localStorage.getItem('siteBanners') || localStorage.getItem('socializaPetBanners') || '[]');
        banners = allBanners.filter(b => b.page === 'home' || !b.page);
    }

    // Default banners if still empty
    if (banners.length === 0) {
        banners = [
            { image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop', title: 'Bem-vindo ao SocializaPet', text: 'Conecte-se com outros donos de pets' },
            { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop', title: 'Encontre Veterinários', text: 'Profissionais qualificados perto de você' },
            { image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop', title: 'Produtos para Pets', text: 'Tudo que seu pet precisa em um só lugar' }
        ];
    }

    const container = document.getElementById('heroBannerSlider');
    const indicators = document.getElementById('heroBannerIndicators');

    if (container && indicators) {
        container.innerHTML = banners.map((banner, index) => `
            <div class="hero-banner-slide ${index === 0 ? 'active' : ''}">
                <img src="${banner.image}" alt="${banner.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.src='https://via.placeholder.com/800x400/667eea/white?text=${encodeURIComponent(banner.title)}'">
                <div class="hero-banner-overlay">
                    <div class="hero-banner-text">${banner.title}</div>
                    <div class="hero-banner-subtitle">${banner.text || banner.description || ''}</div>
                </div>
            </div>
        `).join('');

        indicators.innerHTML = banners.map((_, index) => `
            <div class="hero-banner-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
        `).join('');

        // Initialize logic again for new elements
        initializeBannerCarousel();
    }
}

// 2. Load Blog Posts
function loadBlogPosts() {
    const posts = JSON.parse(localStorage.getItem('socializaPetPosts')) || [];
    const container = document.getElementById('homeBlogGrid');

    if (container) {
        if (posts.length > 0) {
            container.innerHTML = posts.slice(0, 2).map(post => `
                <div class="blog-card">
                    <img src="${post.image}" alt="${post.title}" onerror="this.src='https://picsum.photos/400/220?random=' + Math.floor(Math.random() * 100)">
                    <div class="blog-card-content">
                        <h3>${post.title}</h3>
                        <p>${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                        <a href="blog.html" class="read-more">Leia Mais 📖</a>
                    </div>
                </div>
            `).join('');
        } else {
            // Default
            // Note: using 'read-more' class instead of 'btn-gradient' to match CSS
            container.innerHTML = `
                <div class="blog-card">
                    <img src="https://picsum.photos/400/220?random=1" alt="Dicas">
                    <div class="blog-card-content">
                        <h3>🍽️ Dicas Essenciais para seu Pet</h3>
                        <p>Em breve, muito conteúdo interessante sobre cuidados com pets!</p>
                        <a href="blog.html" class="read-more">Leia Mais 📖</a>
                    </div>
                </div>
            `;
        }
    }
}

// 3. Load Gallery (Renamed to prevent conflict)
function loadHomeGallery() {
    const gallery = JSON.parse(localStorage.getItem('socializaPetGallery')) || [];
    const container = document.getElementById('homeGalleryGrid');

    if (container) {
        if (gallery.length > 0) {
            const imagesToShow = gallery.slice(0, 4);
            container.innerHTML = imagesToShow.map(item => `
                <div class="gallery-item">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='https://picsum.photos/300/280?random=' + Math.floor(Math.random() * 100)">
                </div>
            `).join('');
        } else {
            container.innerHTML = Array.from({ length: 4 }, (_, i) => `
                <div class="gallery-item">
                    <img src="https://picsum.photos/300/280?random=${10 + i}" alt="Pet ${i + 1}">
                </div>
            `).join('');
        }
    }
}
// 3.5 Helper: Convert Google Drive Link
function convertGoogleDriveLink(url) {
    if (!url) return url;
    if (url.includes('drive.google.com')) {
        let fileId = '';
        if (url.includes('/file/d/')) {
            fileId = url.split('/file/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
            fileId = url.split('id=')[1].split('&')[0];
        }
        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
        }
    }
    return url;
}

// 4. Load Site Content (Texts)
function loadSiteContent() {
    const content = JSON.parse(localStorage.getItem('socializaPetContent')) || {};

    // Hero Section
    if (content.title) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = content.title;
    }
    if (content.subtitle) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = content.subtitle;
    }

    // About Section
    if (content.about) {
        const aboutContainer = document.getElementById('aboutTextContainer');
        if (aboutContainer) {
            // Converts line breaks to paragraphs
            aboutContainer.innerHTML = content.about.split('\n').map(p => `<p>${p}</p>`).join('');
        }
    }
}

// 5. Load Site Settings
function loadSiteSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || localStorage.getItem('socializaPetSettings')) || {};

    // Colors
    if (settings.primaryColor || settings.secondaryColor) {
        const root = document.documentElement;
        if (settings.primaryColor) root.style.setProperty('--primary-pink', settings.primaryColor);
        if (settings.secondaryColor) root.style.setProperty('--primary-blue', settings.secondaryColor);
    }

    // Stats
    const statsElements = document.querySelectorAll('.hero-stat-number');
    if (statsElements.length >= 3) {
        if (settings.happyFamilies) statsElements[0].textContent = settings.happyFamilies + 'K+';
        if (settings.partners) statsElements[1].textContent = settings.partners + '+';
        if (settings.adoptedPets) statsElements[2].textContent = settings.adoptedPets + '+';
    }

    // Favicon & Header Logo
    if (settings.faviconUrl) {
        const processedUrl = convertGoogleDriveLink(settings.faviconUrl);

        // Update Favicon
        const links = document.querySelectorAll("link[rel*='icon']");
        links.forEach(link => link.href = processedUrl);

        // Update Header Logo in Index
        const siteLogo = document.getElementById('siteLogo');
        if (siteLogo) {
            // Check if image already exists
            let img = siteLogo.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                img.style.height = '1.2em';
                img.style.verticalAlign = 'middle';
                img.style.marginRight = '8px';
                siteLogo.insertBefore(img, siteLogo.firstChild);
            }
            img.src = processedUrl;
            img.alt = 'Logo';
        }
    }
}

// Strapi Fetch - with Error Suppression
async function fetchStrapiHomePage() {
    try {
        // Safe check for localhost
        // If we are on a different domain, localhost fetch will fail or be blocked by mixed-content/CORS.
        // We will try it but suppress the loud error in console for normal users.
        const response = await fetch('http://localhost:1337/api/home-page').catch(() => null);

        if (!response || !response.ok) {
            // Silent fail or debug log only
            // console.log('Backend local (Strapi) n<C3><A3>o detectado ou inacessivel.');
            return null;
        }

        const data = await response.json();
        if (data.data && data.data.attributes) {
            console.log('Dados do Strapi carregados v1');
            // Here you would apply the strapi data to the DOM
        }
    } catch (error) {
        // Silent catch
    }
}

// Init
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    updateScrollProgress();
    applySiteFavicon();

    loadDynamicContent();
    fetchStrapiHomePage();

    // Fade in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => document.body.style.opacity = '1', 100);
});

console.log('%cSocializa Pet - Refatorado e Otimizado! 🚀', 'background: linear-gradient(45deg, #F28DB2, #0597F2); color: white; padding: 10px; border-radius: 10px;');
