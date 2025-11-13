javascript
function setTheme(t){ 
  root.setAttribute('data-theme', t); 
  localStorage.setItem('theme', t); 
  if (icon) icon.setAttribute('name', t==='dark'?'sunny-outline':'moon-outline'); 
}
setTheme(root.getAttribute('data-theme') || 'light');
if (btn) btn.addEventListener('click', ()=> setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));

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
      nav: { about: "About", resume: "Resume", contact: "Contact" },
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
      contact: {
        title: "Contact", formTitle: "Contact Form",
        fullname: "Full name", email: "Email address", message: "Your Message", send: "Send Message"
      }
    },
    it: {
      docTitle: "Hussein Zayat — Consulente Backend & Technical Lead",
      nav: { about: "Chi sono", resume: "Curriculum", contact: "Contatti" },
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
      contact: {
        title: "Contatti", formTitle: "Form di contatto",
        fullname: "Nome e cognome", email: "Indirizzo email", message: "Il tuo messaggio", send: "Invia messaggio"
      }
    }
  };

  let dict = embeddedTranslations; // default to embedded

  function detectLang() {
    const stored = localStorage.getItem('lang');
    if (stored && SUPPORTED.includes(stored)) return stored;
    const navLang = (navigator.language || '').slice(0,2).toLowerCase();
    return SUPPORTED.includes(navLang) ? navLang : DEFAULT_LANG;
  }

  function setMapLanguage(lang) {
    if (!mapIframe) return;
    try {
      const url = new URL(mapIframe.src);
      url.searchParams.set('hl', lang === 'it' ? 'it' : 'en');
      url.searchParams.set('region', lang === 'it' ? 'IT' : 'US');
      mapIframe.src = url.toString();
    } catch {}
  }

  function getFromDict(lang, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], dict[lang]) ?? null;
  }

  function translate(lang) {
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