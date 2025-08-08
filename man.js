// Utility: Debounce function to limit event handler frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize all features on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLanguageToggle();
    initTypingAnimation();
    initSmoothScrolling();
    initFadeInAnimations();
    initActiveNavigation();
    initDropdowns();
    initBackToTop();
    initProjectLinks();
    initMobileMenu();
    initCertificateModals();
});

// Theme Toggle: Switch between light and dark themes
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme, themeIcon);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme, themeIcon);
        localStorage.setItem('theme', newTheme);
    });
}

function applyTheme(theme, icon) {
    document.body.setAttribute('data-theme', theme);
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Language Toggle: Switch between English and Chinese
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    let currentLang = localStorage.getItem('language') || 'en';
    toggleLanguage(currentLang);
    langToggle.textContent = currentLang === 'en' ? 'EN' : '中';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        toggleLanguage(currentLang);
        langToggle.textContent = currentLang === 'en' ? 'EN' : '中';
        localStorage.setItem('language', currentLang);
        initTypingAnimation();
    });
}

function toggleLanguage(lang) {
    const enElements = document.querySelectorAll('.en');
    const zhElements = document.querySelectorAll('.zh');
    
    enElements.forEach(el => el.style.display = lang === 'en' ? 'inline-block' : 'none');
    zhElements.forEach(el => el.style.display = lang === 'zh' ? 'inline-block' : 'none');
    
    document.documentElement.lang = lang;
}

// Typing Animation: Cycle through roles with typing effect
function initTypingAnimation() {
    const lang = localStorage.getItem('language') || 'en';
    const typingText = document.querySelector(`.typing-text.${lang}`);
    if (!typingText) {
        console.warn(`Typing text element not found for language: ${lang}`);
        return;
    }

    const roles = {
        en: ['Data Scientist', 'Web Developer', 'Data Analyst', 'Machine Learning Engineer', 'Data Visualizer'],
        zh: ['数据科学家', '网络开发者', '数据分析师', '机器学习工程师', '数据可视化师']
    };
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[lang][roleIndex];
        console.log(`Typing: ${currentRole}, charIndex: ${charIndex}, isDeleting: ${isDeleting}`); // Debug
        if (!isDeleting) {
            if (charIndex < currentRole.length) {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(type, 100); // Typing speed
            } else {
                isDeleting = true;
                setTimeout(type, 1000); // Pause before deleting
            }
        } else {
            if (charIndex > 0) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(type, 50); // Deleting speed
            } else {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles[lang].length;
                setTimeout(type, 500); // Pause before next role
            }
        }
    }

    typingText.textContent = '';
    type();
}

// Smooth Scrolling: Scroll to anchor links smoothly
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fade-In Animations: Reveal elements on scroll
function initFadeInAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Active Navigation: Highlight current section in nav
function initActiveNavigation() {
    const updateActiveNav = debounce(() => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        let current = 'home';

        sections.forEach(section => {
            if (window.scrollY + 200 >= section.offsetTop && window.scrollY + 200 < section.offsetTop + section.clientHeight) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// Dropdowns: Toggle credential dropdowns
function initDropdowns() {
    document.querySelectorAll('.credential-item.clickable').forEach(item => {
        item.querySelector('.credential-header').addEventListener('click', () => {
            item.classList.toggle('active');
            if (item.id === 'languages' && item.classList.contains('active')) {
                setTimeout(() => {
                    item.querySelectorAll('.progress-fill').forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => bar.style.width = width, 100);
                    });
                }, 200);
            }
        });
    });
}

// Back to Top: Show/hide back-to-top button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });
}

// Certificate Modals: Display certificate details
const certificatesData = {
    'web-dev': {
        title: { en: 'Udemy Web Development Bootcamp', zh: 'Udemy 网站开发课程' },
        issuer: 'Udemy',
        date: '2023',
        description: { en: 'Comprehensive course covering HTML, CSS, JavaScript, and modern frameworks like React.', zh: '涵盖 HTML、CSS、JavaScript 和 React 等现代框架的综合课程。' },
        link: './udemy.pdf'
    },
    'aws-ml': {
        title: { en: 'AWS Machine Learning Foundation', zh: 'AWS 机器学习基础' },
        issuer: 'Amazon Web Services',
        date: '2023',
        description: { en: 'Foundational course on machine learning concepts and AWS tools for AI.', zh: '关于机器学习概念和 AWS AI 工具的基础课程。' },
        link: './aws.pdf'
    },
    'ielts': {
        title: { en: 'IELTS Preparation Course', zh: '雅思备考课程' },
        issuer: 'British Council',
        date: '2022',
        description: { en: 'Intensive preparation for the IELTS exam, focusing on academic English proficiency.', zh: '雅思考试的强化准备课程，专注于学术英语能力。' },
        link: './ielts.pdf'
    }
};

function initCertificateModals() {
    document.querySelectorAll('.certificate-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const certKey = btn.dataset.cert;
            if (certificatesData[certKey]) {
                showCertificateModal(certificatesData[certKey]);
            }
        });
    });
}

function showCertificateModal(cert) {
    closeCertificateModal();
    const lang = localStorage.getItem('language') || 'en';
    const modalHTML = `
        <div class="certificate-modal-overlay" id="certificateModal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
            <div class="certificate-modal">
                <div class="certificate-modal-header">
                    <h3 id="modalTitle">${cert.title[lang]}</h3>
                    <button class="modal-close" aria-label="${lang === 'en' ? 'Close modal' : '关闭模态框'}"><i class="fas fa-times"></i></button>
                </div>
                <div class="certificate-modal-body">
                    <p><strong>${lang === 'en' ? 'Issuer' : '颁发机构'}:</strong> ${cert.issuer}</p>
                    <p><strong>${lang === 'en' ? 'Date' : '日期'}:</strong> ${cert.date}</p>
                    <p>${cert.description[lang]}</p>
                    ${cert.link ? `<a href="${cert.link}" target="_blank" class="btn btn-cert">${lang === 'en' ? 'View Certificate' : '查看证书'}</a>` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('certificateModal');
    setTimeout(() => modal.classList.add('visible'), 10);
    
    modal.querySelector('.modal-close').addEventListener('click', closeCertificateModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCertificateModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCertificateModal();
    }, { once: true });
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 400);
    }
}

// Project Links: Display project details
const projectsData = {
    'sales-prediction': {
        title: { en: 'Sales Prediction Model (RFM)', zh: '销售预测模型' },
        github: 'https://github.com/layhor/sales-prediction-rfm',
        demo: 'https://example.com/sales-prediction',
        description: { en: 'Customer segmentation using RFM analysis for predictive modeling.', zh: '使用 RFM 分析进行客户细分和预测建模。' },
        features: [
            { en: 'RFM-based customer segmentation', zh: '基于 RFM 的客户细分' },
            { en: 'Predictive modeling for lifetime value', zh: '客户终身价值预测建模' },
            { en: 'Interactive visualizations', zh: '交互式可视化' }
        ],
        technologies: ['Python', 'Scikit-learn', 'Pandas']
    },
    'money-laundering': {
        title: { en: 'Money Laundering Detection', zh: '洗钱检测' },
        github: 'https://github.com/layhor/money-laundering-detection',
        demo: 'https://example.com/money-laundering',
        description: { en: 'Machine learning system for detecting suspicious financial transactions.', zh: '检测可疑金融交易的机器学习系统。' },
        features: [
            { en: 'Anomaly detection algorithms', zh: '异常检测算法' },
            { en: 'Real-time transaction monitoring', zh: '实时交易监控' },
            { en: 'Risk scoring system', zh: '风险评分系统' }
        ],
        technologies: ['Python', 'Scikit-learn', 'Pandas']
    },
    'powerbi-dashboard': {
        title: { en: 'Power BI Sales Dashboard', zh: 'Power BI 销售仪表板' },
        github: null,
        demo: 'https://example.com/powerbi-dashboard',
        description: { en: 'Interactive dashboard for sales analytics with dynamic KPIs.', zh: '交互式销售分析仪表板，包含动态 KPI。' },
        features: [
            { en: 'Dynamic filtering and drill-down', zh: '动态筛选和深入分析' },
            { en: 'KPI tracking and monitoring', zh: 'KPI 跟踪和监控' },
            { en: 'Data modeling with DAX', zh: '使用 DAX 进行数据建模' }
        ],
        technologies: ['Power BI']
    }
};

function initProjectLinks() {
    document.querySelectorAll('.project-card').forEach(card => {
        const projectKey = card.dataset.project;
        const link = card.querySelector('.project-link');
        if (!projectsData[projectKey]) {
            console.warn(`Project data not found for key: ${projectKey}`);
            return;
        }
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showProjectModal(projectsData[projectKey]);
        });
    });
}

function showProjectModal(project) {
    closeProjectModal();
    const lang = localStorage.getItem('language') || 'en';
    const modalHTML = `
        <div class="project-modal-overlay" id="projectModal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
            <div class="project-modal">
                <div class="project-modal-header">
                    <h3 id="modalTitle">${project.title[lang]}</h3>
                    <button class="modal-close" aria-label="${lang === 'en' ? 'Close modal' : '关闭模态框'}"><i class="fas fa-times"></i></button>
                </div>
                <div class="project-modal-body">
                    <p>${project.description[lang]}</p>
                    <div class="project-technologies">
                        <h4>${lang === 'en' ? 'Technologies' : '技术'}</h4>
                        <div class="tech-tags">${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>
                    </div>
                    <div class="project-features">
                        <h4>${lang === 'en' ? 'Features' : '功能'}</h4>
                        <ul>${project.features.map(feature => `<li>${feature[lang]}</li>`).join('')}</ul>
                    </div>
                    <div class="project-links">
                        ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-github"><i class="fab fa-github"></i> ${lang === 'en' ? 'View Code' : '查看代码'}</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-demo"><i class="fas fa-external-link-alt"></i> ${lang === 'en' ? 'Live Demo' : '在线演示'}</a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('projectModal');
    setTimeout(() => modal.classList.add('visible'), 10);
    
    modal.querySelector('.modal-close').addEventListener('click', closeProjectModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProjectModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectModal();
    }, { once: true });
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 400);
    }
}

// Mobile Menu: Toggle navigation on mobile
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        });
    });
}