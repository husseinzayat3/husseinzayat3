'use strict';

// =====================
// Original behaviors
// =====================

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
// const sidebarBtn = document.querySelector("[data-sidebar-btn]");
// elementToggleFunc(sidebar)  // Auto-open sidebar (kept from your code)
elementToggleFunc(sidebar);

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (!modalContainer || !overlay) return;
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    if (!modalImg || !modalTitle || !modalText) return;
    const ava = this.querySelector("[data-testimonials-avatar]");
    const title = this.querySelector("[data-testimonials-title]");
    const text = this.querySelector("[data-testimonials-text]");
    if (ava) { modalImg.src = ava.src; modalImg.alt = ava.alt; }
    if (title) modalTitle.innerHTML = title.innerHTML;
    if (text) modalText.innerHTML = text.innerHTML;
    testimonialsModalFunc();
  });
}

// custom select (guarded; selectValue may not exist in DOM)
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();

    // avoid ReferenceError if selectValue isn't defined in DOM
    if (typeof selectValue !== 'undefined' && selectValue) {
      selectValue.innerText = this.innerText;
    }

    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form validation (data-* may not exist; guard it)
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (form && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}
function openBlogModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeBlogModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// page navigation — use data-nav-target (stable across languages)
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const target = this.getAttribute('data-nav-target'); // "about" | "resume" | "contact"
    for (let j = 0; j < pages.length; j++) {
      const pageKey = pages[j].dataset.page; // "about" | "resume" | "contact"
      if (pageKey === target) {
        pages[j].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        // Remove active from the nav link that corresponds to this page index if exists
        if (navigationLinks[j]) navigationLinks[j].classList.remove("active");
      }
    }
  });
}

// =====================
// EmailJS Contact Form
// =====================

// Initialize EmailJS
(function () {
  emailjs.init("Qwm-Ap280pqF7mu-x");
})();

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-btn');
    const btnText = submitBtn.querySelector('span');
    const originalText = btnText.textContent;

    // Disable button and show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    // Get form data
    const templateParams = {
      title: "Portfolio Contact", // Static title for the subject
      name: document.getElementById("fullname").value,
      message: document.getElementById("message").value,
      from_email: document.getElementById("email").value, // Matches {{from_email}}
      email: document.getElementById("email").value       // Matches {{email}} for Reply-To
    };

    // Send email using EmailJS
    emailjs.send('service_zgi2yvl', 'template_bckr95f', templateParams)
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text);

        // Show success message
        btnText.textContent = '✓ Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 71%, 45%))';

        // Reset form
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          btnText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);

      }, function (error) {
        console.log('FAILED...', error);

        // Show error message
        btnText.textContent = '✗ Failed to send';
        submitBtn.style.background = 'linear-gradient(135deg, hsl(0, 76%, 50%), hsl(0, 71%, 60%))';

        // Reset button after 3 seconds
        setTimeout(() => {
          btnText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      });
  });
}

// Theme toggle
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = saved || (prefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);

const root = document.documentElement;
const btn = document.getElementById('theme-toggle');
const icon = document.getElementById('theme-icon');
function setTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  if (icon) icon.setAttribute('name', t === 'dark' ? 'sunny-outline' : 'moon-outline');
}
setTheme(root.getAttribute('data-theme') || 'light');
if (btn) btn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// =====================
// i18n module (no-CORS local fallback)
// =====================
(function () {
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'it'];
  const html = document.documentElement;
  const titleEl = document.querySelector('title[data-i18n="docTitle"]');
  const langBtn = document.getElementById('lang-toggle');
  const langBtnText = document.getElementById('lang-toggle-text');
  const mapIframe = document.getElementById('map-iframe');

  // --- Embedded fallback translations (keep synced with your JSON) ---
  const embeddedTranslations = {
    en: {
      docTitle: "Hussein Zayat — Backend Consultant & Technical Lead",
      nav: { about: "About", resume: "Resume", projects: "Projects", blog: "Blog", contact: "Contact" },
      sidebar: {
        role: "Backend Consultant <br> & Technical Lead (.NET • Azure)",
        email: "Email", phone: "Phone", location: "Location", locationValue: "Turin, Italy"
      },
      about: {
        title: "About me",
        p1: "Senior backend consultant and technical leader specialized in <strong>.NET 7/8/9</strong>, <strong>Azure</strong>, and <strong>microservices</strong>. I help teams build scalable APIs, modernize legacy systems, and ship with confidence using automated CI/CD pipelines.",
        p2: "Recent work includes consulting for <strong>CNH Industrial &amp; Iveco</strong> (Azure, microservices, SQL/Cosmos DB) and <strong>HEABC</strong> in Canada (backend modernization and <strong>DocuSign</strong> integration). I’m available for long-term freelance collaborations (remote-first)."
      },
      services: {
        title: "What i'm doing",
        cloud: { title: "Cloud Solutions", text: "Helping businesses move to the cloud with confidence—designing secure, scalable, and future-ready cloud solutions." },
        web: { title: "Web development", text: "Modern and scalable web applications built with high-quality code and design at a professional level." },
        mobile: { title: "Mobile apps", text: "Native and cross-platform mobile solutions that bring your ideas to life on any device." },
        lead: { title: "Technical Leadership (Tech Lead / Team Lead)", text: "Mentoring & code reviews, architectural guidance, sprint planning, delivery governance, and stakeholder alignment to keep teams fast and focused." }
      },
      clients: { title: "Clients & Partners" },
      resume: { title: "Resume", education: "Education", experience: "Experience", since2024: "Since 2024" },
      skills: {
        title: "My skills",
        dotnet: ".NET (6–9), C#, ASP.NET Core",
        azure: "Azure (Service Bus, Blob, Data Lake, Cosmos DB)",
        arch: "Microservices, REST APIs, Clean Architecture",
        db: "Databases (MS SQL, NoSQL)",
        cicd: "CI/CD (Azure DevOps, Pipelines, Docker)",
        langs: "Languages & Frameworks: Python, Kotlin, Java, JavaScript, EF, ABP, Flutter, OData"
      },
      projects: {
        title: "Projects",
        status: { live: "Live", wip: "Work in Progress", beta: "Beta", comingSoon: "Coming Soon" },
        repovate: {
          title: "Repovate.com (Repository AI Analysis & Automated Bug Fix)",
          description: "Repository AI Analysis & Automated Bug Fix is an AI-powered tool that analyzes your codebase to detect bugs, security issues, and performance problems — and automatically generates fixes. It integrates with your Git workflow to keep code clean, secure, and production-ready with minimal effort."
        },
        jetgenius: {
          title: "JetGenius (AI-powered travel assistant)",
          description: "JetGenius is an AI-powered travel assistant that helps you find the smartest and cheapest ways to fly. It goes beyond traditional flight search by uncovering hidden routes, flexible dates, split tickets, and alternative airports to save you money. JetGenius turns complex travel planning into clear, actionable recommendations — so you book better flights, faster and cheaper."
        }
      },
      blog: { title: "Blog" },
      contact: {
        title: "Contact", formTitle: "Contact Form",
        fullname: "Full name", email: "Email address", message: "Your Message", send: "Send Message",
        introTitle: "Let's Build Something Great Together",
        introText: "Whether you have a project idea, need technical leadership, or just want to discuss the latest in AI and software engineering, I’m always open to new opportunities.",
        whyTitle: "Why Reach Out?",
        reason1: { title: "Scalable Architecture", text: "Expertise in designing robust systems using .NET, Azure, and Microservices." },
        reason2: { title: "Technical Leadership", text: "Guiding teams, improving dev culture, and delivering high-impact products." },
        reason3: { title: "Product-Minded Development", text: "I don't just write code; I focus on solving real business problems efficiently." }
      }
    },
    it: {
      docTitle: "Hussein Zayat — Consulente Backend & Technical Lead",
      nav: { about: "Chi sono", resume: "Curriculum", projects: "Progetti", blog: "Blog", contact: "Contatti" },
      sidebar: {
        role: "Consulente Backend <br> & Technical Lead (.NET • Azure)",
        email: "Email", phone: "Telefono", location: "Località", locationValue: "Torino, Italia"
      },
      about: {
        title: "Chi sono",
        p1: "Consulente backend senior e technical leader specializzato in <strong>.NET 7/8/9</strong>, <strong>Azure</strong> e <strong>microservizi</strong>. Aiuto i team a creare API scalabili, modernizzare sistemi legacy e rilasciare con sicurezza tramite pipeline CI/CD automatizzate.",
        p2: "Tra i progetti recenti: consulenza per <strong>CNH Industrial &amp; Iveco</strong> (Azure, microservizi, SQL/Cosmos DB) e <strong>HEABC</strong> in Canada (modernizzazione backend e integrazione <strong>DocuSign</strong>). Disponibile per collaborazioni freelance di lungo periodo (remote-first)."
      },
      services: {
        title: "Cosa faccio",
        cloud: { title: "Soluzioni Cloud", text: "Supporto alla migrazione in cloud con soluzioni sicure, scalabili e pronte per il futuro." },
        web: { title: "Sviluppo Web", text: "Applicazioni web moderne e scalabili, con codice e design di livello professionale." },
        mobile: { title: "App Mobile", text: "Soluzioni native e cross-platform per dare vita alle idee su ogni dispositivo." },
        lead: { title: "Technical Leadership (Tech Lead / Team Lead)", text: "Mentoring e code review, guida architetturale, pianificazione sprint, governance del delivery e allineamento stakeholder." }
      },
      clients: { title: "Clienti e Partner" },
      resume: { title: "Curriculum", education: "Formazione", experience: "Esperienza", since2024: "Dal 2024" },
      skills: {
        title: "Competenze",
        dotnet: ".NET (6–9), C#, ASP.NET Core",
        azure: "Azure (Service Bus, Blob, Data Lake, Cosmos DB)",
        arch: "Microservizi, REST API, Clean Architecture",
        db: "Database (MS SQL, NoSQL)",
        cicd: "CI/CD (Azure DevOps, Pipelines, Docker)",
        langs: "Linguaggi & Framework: Python, Kotlin, Java, JavaScript, EF, ABP, Flutter, OData"
      },
      projects: {
        title: "Progetti",
        status: { live: "Live", wip: "In Sviluppo", beta: "Beta", comingSoon: "Prossimamente" },
        repovate: {
          title: "Repovate.com (Analisi AI del repository e correzione automatica dei bug)",
          description: "Repository AI Analysis & Automated Bug Fix è uno strumento basato su intelligenza artificiale che analizza il tuo codebase per individuare bug, problemi di sicurezza e criticità di performance — e genera automaticamente le relative correzioni. Si integra con il tuo flusso di lavoro Git per mantenere il codice pulito, sicuro e pronto per la produzione con il minimo sforzo."
        },
        jetgenius: {
          title: "JetGenius (AI-powered travel assistant)",
          description: "JetGenius è un assistente di viaggio basato su intelligenza artificiale che ti aiuta a trovare i modi più intelligenti ed economici per volare. Va oltre la ricerca tradizionale dei voli, scoprendo rotte nascoste, date flessibili, biglietti spezzati e aeroporti alternativi per farti risparmiare. JetGenius trasforma una pianificazione di viaggio complessa in raccomandazioni chiare e concrete — così puoi prenotare voli migliori, più velocemente e spendendo meno."
        }
      },
      blog: { title: "Blog" },
      contact: {
        title: "Contatti", formTitle: "Form di contatto",
        fullname: "Nome e cognome", email: "Indirizzo email", message: "Il tuo messaggio", send: "Invia messaggio",
        introTitle: "Costruiamo Qualcosa di Grande Insieme",
        introText: "Che tu abbia un'idea progettuale, necessiti di leadership tecnica o voglia semplicemente discutere le ultime novità in AI e ingegneria del software, sono sempre aperto a nuove opportunità.",
        whyTitle: "Perché Contattarmi?",
        reason1: { title: "Architetture Scalabili", text: "Esperienza nella progettazione di sistemi robusti utilizzando .NET, Azure e Microservizi." },
        reason2: { title: "Leadership Tecnica", text: "Guida dei team, miglioramento della cultura dev e rilascio di prodotti ad alto impatto." },
        reason3: { title: "Sviluppo Orientato al Prodotto", text: "Non scrivo solo codice; mi concentro sulla risoluzione efficiente di problemi di business reali." }
      }
    }
  };

  let dict = embeddedTranslations; // default to embedded

  function detectLang() {
    const stored = localStorage.getItem('lang');
    if (stored && SUPPORTED.includes(stored)) return stored;
    const navLang = (navigator.language || '').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(navLang) ? navLang : DEFAULT_LANG;
  }

  function setMapLanguage(lang) {
    if (!mapIframe) return;
    try {
      const url = new URL(mapIframe.src);
      url.searchParams.set('hl', lang === 'it' ? 'it' : 'en');
      url.searchParams.set('region', lang === 'it' ? 'IT' : 'US');
      mapIframe.src = url.toString();
    } catch { }
  }

  function getFromDict(lang, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], dict?.[lang]) ?? null;
  }

  function translate(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    const titleTxt = getFromDict(lang, 'docTitle');
    if (titleTxt && titleEl) titleEl.textContent = titleTxt;
    html.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = getFromDict(lang, key);
      if (txt != null) el.innerHTML = txt;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const txt = getFromDict(lang, key);
      if (txt != null) el.setAttribute('placeholder', txt);
    });

    if (langBtnText) langBtnText.textContent = lang === 'it' ? 'EN' : 'IT';
    setMapLanguage(lang);
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    localStorage.setItem('lang', lang);
    translate(lang);
  }

  async function maybeLoadExternal() {
    // Only try external JSON if running on http/https
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      try {
        const res = await fetch('./assets/i18n/translations.json', { cache: 'no-store' });
        if (res.ok) {
          dict = await res.json();
        }
      } catch (e) {
        // keep embedded fallback
        console.warn('Using embedded translations (fetch failed).', e);
      }
    }
  }

  (async function init() {
    await maybeLoadExternal();
    const current = detectLang();
    setLang(current);
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const next = (localStorage.getItem('lang') === 'it') ? 'en' : 'it';
        setLang(next);
      });
    }
  })();
})();