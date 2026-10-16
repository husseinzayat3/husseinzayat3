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
    // A post opened from another page (such as Projects) needs the blog page shown first
    const page = modal.closest('[data-page]');
    if (page && !page.classList.contains('active')) {
      document.querySelector(`[data-nav-target="${page.dataset.page}"]`)?.click();
    }
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

// Function to activate a specific page and nav link
function setActivePage(target) {
  // Default to 'about' if target is invalid or empty
  if (!target) target = 'about';

  // Verify target validity
  let isValidTarget = false;
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].dataset.page === target) {
      isValidTarget = true;
      break;
    }
  }
  if (!isValidTarget) target = 'about';

  // 1. Switch Active Page
  for (let j = 0; j < pages.length; j++) {
    if (pages[j].dataset.page === target) {
      pages[j].classList.add("active");
      window.scrollTo(0, 0);
    } else {
      pages[j].classList.remove("active");
    }
  }

  // 2. Switch Active Nav Link
  for (let k = 0; k < navigationLinks.length; k++) {
    if (navigationLinks[k].dataset.navTarget === target) {
      navigationLinks[k].classList.add("active");
    } else {
      navigationLinks[k].classList.remove("active");
    }
  }
}

// Event listener for nav links
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const target = this.dataset.navTarget; // "about" | "resume" | "contact" | "privacy-policy"

    // Changing hash triggers hashchange event, which calls setActivePage
    window.location.hash = target;
  });
}

// Handle browser navigation (back/forward) and manual hash changes
window.addEventListener('hashchange', () => {
  const target = window.location.hash.replace('#', '');
  setActivePage(target);
});

// Handle initial load
window.addEventListener('DOMContentLoaded', () => {
  const target = window.location.hash.replace('#', '');
  setActivePage(target);

  // Store Link Logic for HappyDots
  const happyDotsStoreLink = document.getElementById('happydots-store-link');
  if (happyDotsStoreLink) {
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh|mac os x/.test(userAgent);

    // Default (Android/Windows/Others) -> Play Store
    let storeUrl = "https://play.google.com/store/apps/details?id=com.moodtracker.daily.mood_tracker";
    let iconName = "logo-google-playstore"; // Ionicons v5+
    let i18nKey = "projects.happydots.googlePlay";
    let defaultText = "Get it on Google Play";

    if (isApple) {
      // Apple -> App Store
      storeUrl = "https://apps.apple.com/app/happydots-daily-mood-journal/id6757766055";
      iconName = "logo-apple";
      i18nKey = "projects.happydots.appleStore";
      defaultText = "Download on the App Store";
    }

    happyDotsStoreLink.href = storeUrl;

    // Update Icon
    const icon = happyDotsStoreLink.querySelector('ion-icon');
    if (icon) icon.setAttribute('name', iconName);

    // Update Text & Translation Key
    const span = happyDotsStoreLink.querySelector('span');
    if (span) {
      span.textContent = defaultText;
      span.setAttribute('data-i18n', i18nKey);
    }
  }

  // Store Link Logic for SpeedTap Arena
  const speedTapStoreLink = document.getElementById('speedtap-store-link');
  if (speedTapStoreLink) {
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh|mac os x/.test(userAgent);

    // Default (Android/Windows/Others) -> Play Store
    let storeUrl = "https://play.google.com/store/apps/details?id=com.hz.fasttap";
    let iconName = "logo-google-playstore";
    let i18nKey = "projects.speedtap.googlePlay";
    let defaultText = "Get it on Google Play";

    if (isApple) {
      // Apple -> App Store
      storeUrl = "https://apps.apple.com/us/app/speedtap-arena/id6760648659";
      iconName = "logo-apple";
      i18nKey = "projects.speedtap.appleStore";
      defaultText = "Download on the App Store";
    }

    speedTapStoreLink.href = storeUrl;

    // Update Icon
    const icon = speedTapStoreLink.querySelector('ion-icon');
    if (icon) icon.setAttribute('name', iconName);

    // Update Text & Translation Key
    const span = speedTapStoreLink.querySelector('span');
    if (span) {
      span.textContent = defaultText;
      span.setAttribute('data-i18n', i18nKey);
    }
  }
});

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
    "en": {
      "docTitle": "Hussein Zayat — Backend & AI Engineering Consultant",
      "nav": {
        "about": "About",
        "resume": "Resume",
        "projects": "Projects",
        "blog": "Blog",
        "contact": "Contact"
      },
      "sidebar": {
        "role": "Backend & AI Consultant <br> & Technical Lead (.NET • Azure)",
        "email": "Email",
        "phone": "Phone",
        "location": "Location",
        "locationValue": "Turin, Italy"
      },
      "about": {
        "title": "About me",
        "p1": "Senior backend and AI engineering consultant and technical lead. I design and build reliable backends on <strong>.NET</strong> and <strong>Azure</strong>, the <strong>AI features and agents</strong> that run on them, and I lead the teams that ship them.",
        "p2": "Recent work includes consulting for <strong>CNH Industrial &amp; Iveco</strong> (Azure, microservices, SQL/Cosmos DB) and <strong>HEABC</strong> in Canada (backend modernization and <strong>DocuSign</strong> integration). I also build AI products end to end, like <strong>Deskforce</strong>, an open-source office of AI agents with signed releases and automated tests.",
        "p3": "<strong>Available part-time</strong> for projects, assessments and advisory work alongside my current engagement. Remote, with travel for kick-offs and workshops."
      },
      "services": {
        "title": "How I can help",
        "cloud": {
          "title": "Backend & Cloud Engineering",
          "text": "Scalable .NET APIs and microservices on Azure, legacy modernization, migrations and CI/CD, as part of your team."
        },
        "web": {},
        "mobile": {},
        "lead": {
          "title": "Technical Leadership & Consultancy",
          "text": "Architecture and code reviews, part-time tech lead, mentoring, and bringing AI tools into development teams safely."
        },
        "assessment": {
          "title": "AI Assessment & Workshop",
          "text": "Find where AI pays off in your work: a workshop with your team, ranked use cases, a working prototype and a roadmap, in 3–5 days."
        },
        "ai": {
          "title": "AI Features & Agents",
          "text": "Production-ready AI in your product or processes: LLM features, assistants over your documents and agent workflows, with evaluation, security and costs under control."
        },
        "deskforce": {
          "title": "Deskforce for Your Team",
          "text": "My open-source office of AI agents, built around your roles, tools and models: setup, integrations or a hosted team edition."
        },
        "cta": {
          "text": "Not sure which fits? A free 15-minute call is the quickest way to find out.",
          "button": "Book a free call"
        }
      },
      "clients": {
        "title": "Clients & Partners"
      },
      "resume": {
        "title": "Resume",
        "education": "Education",
        "experience": "Experience",
        "since2024": "Since 2024"
      },
      "skills": {
        "title": "My skills",
        "dotnet": ".NET (6–9), C#, ASP.NET Core",
        "azure": "Azure (Service Bus, Blob, Data Lake, Cosmos DB)",
        "arch": "Microservices, REST APIs, Clean Architecture",
        "db": "Databases (MS SQL, NoSQL)",
        "cicd": "CI/CD (Azure DevOps, Pipelines, Docker)",
        "langs": "Languages & Frameworks: Python, Kotlin, Java, JavaScript, EF, ABP, Flutter, OData"
      },
      "projects": {
        "title": "Projects",
        "status": {
          "live": "Live",
          "wip": "Work in Progress",
          "beta": "Beta",
          "comingSoon": "Coming Soon",
          "online": "Online"
        },
        "deskforce": {
          "title": "Deskforce (Virtual Office of AI Agents)",
          "description": "Deskforce is a virtual office of AI agents. Hire a team, give the CEO agent a goal, and watch it plan, delegate, and build the work, with every employee shown live on a floorplan. Choose a different model for each employee (OpenAI, Claude, Gemini, Grok, or local models via Ollama). Approve plans and cost estimates before anything is built, undo any task with one click thanks to per-task git commits, set budgets and spending caps, and manage everything from Slack. Open source under the MIT License. Signed releases for macOS, Windows and Linux, a Docker image, automated tests and a documentation site.",
          "download": "Download",
          "docs": "Docs",
          "code": "Source code",
          "caseStudy": "Case study"
        },
        "repovate": {
          "title": "Repovate.com (Repository AI Analysis & Automated Bug Fix)",
          "description": "Repository AI Analysis & Automated Bug Fix is an AI-powered tool that analyzes your codebase to detect bugs, security issues, and performance problems — and automatically generates fixes. It integrates with your Git workflow to keep code clean, secure, and production-ready with minimal effort."
        },
        "jetgenius": {
          "title": "JetGenius (AI-powered travel assistant)",
          "description": "JetGenius is an AI-powered travel assistant that helps you find the smartest and cheapest ways to fly. It goes beyond traditional flight search by uncovering hidden routes, flexible dates, split tickets, and alternative airports to save you money. JetGenius turns complex travel planning into clear, actionable recommendations — so you book better flights, faster and cheaper."
        },
        "happydots": {
          "title": "HappyDots: Daily Mood Journal",
          "description": "HappyDots is a mobile application for iOS and Android designed to track your daily mood. It analyzes your patterns to identify what improves or worsens your well-being, providing personalized suggestions to help you feel your best.",
          "appleStore": "Download on the App Store",
          "googlePlay": "Get it on Google Play"
        },
        "speedtap": {
          "title": "SpeedTap Arena",
          "description": "SpeedTap Arena is a competitive mobile game built with Flutter and Firebase Functions. Challenge your friends in real-time reflex battles, climb the global leaderboard, and prove who has the fastest fingers in the arena.",
          "appleStore": "Download on the App Store",
          "googlePlay": "Get it on Google Play"
        }
      },
      "booking": {
        "title": "Book a Meeting",
        "text": "Schedule a free 15-minute consultation to discuss your project or clarify your needs.",
        "button": "Schedule a Date"
      },
      "blog": {
        "title": "Blog"
      },
      "contact": {
        "title": "Contact",
        "formTitle": "Contact Form",
        "fullname": "Full name",
        "email": "Email address",
        "message": "Your Message",
        "send": "Send Message",
        "introTitle": "Let's Build Something Great Together",
        "introText": "Whether you’re planning AI features or agents, need a backend that scales, or want technical leadership for your team, tell me what you’re working on. I’m available part-time, remote, with travel for kick-offs.",
        "whyTitle": "Why Reach Out?",
        "reason1": {
          "title": "Scalable Architecture",
          "text": "Expertise in designing robust systems using .NET, Azure, and Microservices."
        },
        "reason2": {
          "title": "Technical Leadership",
          "text": "Guiding teams, improving dev culture, and delivering high-impact products."
        },
        "reason3": {
          "title": "AI That Reaches Production",
          "text": "LLM features and agents with evaluation, security and cost controls, not just demos."
        }
      },
      "privacy": {
        "link": "Privacy Policy",
        "title": "Privacy Policy",
        "intro": "This Privacy Policy describes how your personal information is collected, used, and shared when you visit or contact me through this website.",
        "collection": "Information Collection",
        "collectionText": "I collect information you provide directly to me, such as when you send a message through the contact form or book a meeting. This may include your name, email address, and any other details you choose to provide.",
        "usage": "How I Use Your Information",
        "usageText": "I use the information I collect to communicate with you, respond to your inquiries, and schedule meetings. I do not sell or share your personal information with third parties for marketing purposes.",
        "analytics": "Analytics",
        "analyticsText": "This website may use basic analytics tools to understand visitor trends. These tools collect anonymous data such as browser type, referring site, and the date/time of each visitor request.",
        "contact": "Contact",
        "contactText": "For more information about my privacy practices, or if you have questions, please contact me using the details provided in the sidebar or the contact form."
      }
    },
    "it": {
      "docTitle": "Hussein Zayat — Consulente Backend & AI Engineering",
      "nav": {
        "about": "Chi sono",
        "resume": "Curriculum",
        "projects": "Progetti",
        "blog": "Blog",
        "contact": "Contatti"
      },
      "sidebar": {
        "role": "Consulente Backend & AI <br> & Technical Lead (.NET • Azure)",
        "email": "Email",
        "phone": "Telefono",
        "location": "Località",
        "locationValue": "Torino, Italia"
      },
      "about": {
        "title": "Chi sono",
        "p1": "Consulente senior di backend e AI engineering e technical lead. Progetto e sviluppo backend affidabili su <strong>.NET</strong> e <strong>Azure</strong>, le <strong>funzionalità e gli agenti AI</strong> che girano su di essi, e guido i team che li portano in produzione.",
        "p2": "Tra i progetti recenti: consulenza per <strong>CNH Industrial &amp; Iveco</strong> (Azure, microservizi, SQL/Cosmos DB) e <strong>HEABC</strong> in Canada (modernizzazione backend e integrazione <strong>DocuSign</strong>). Sviluppo anche prodotti AI dall’idea al rilascio, come <strong>Deskforce</strong>, un ufficio open source di agenti AI con release firmate e test automatici.",
        "p3": "<strong>Disponibile part-time</strong> per progetti, assessment e consulenza, in parallelo all’incarico attuale. Da remoto, con trasferte per kick-off e workshop."
      },
      "services": {
        "title": "Come posso aiutarti",
        "cloud": {
          "title": "Backend & Cloud Engineering",
          "text": "API .NET e microservizi scalabili su Azure, modernizzazione di sistemi legacy, migrazioni e CI/CD, all’interno del tuo team."
        },
        "web": {},
        "mobile": {},
        "lead": {
          "title": "Technical Leadership & Consulenza",
          "text": "Review di architettura e codice, tech lead part-time, mentoring e adozione sicura degli strumenti AI nei team di sviluppo."
        },
        "assessment": {
          "title": "AI Assessment & Workshop",
          "text": "Scopri dove l’AI porta valore nel tuo lavoro: un workshop con il tuo team, casi d’uso prioritizzati, un prototipo funzionante e una roadmap, in 3–5 giorni."
        },
        "ai": {
          "title": "Funzionalità e Agenti AI",
          "text": "AI pronta per la produzione nel tuo prodotto o nei tuoi processi: funzionalità LLM, assistenti sui tuoi documenti e workflow con agenti, con valutazione, sicurezza e costi sotto controllo."
        },
        "deskforce": {
          "title": "Deskforce per il tuo team",
          "text": "Il mio ufficio open source di agenti AI, costruito su ruoli, strumenti e modelli del tuo team: configurazione, integrazioni o una versione hosted."
        },
        "cta": {
          "text": "Non sai quale fa per te? Una call gratuita di 15 minuti è il modo più rapido per capirlo.",
          "button": "Prenota una call gratuita"
        }
      },
      "clients": {
        "title": "Clienti e Partner"
      },
      "resume": {
        "title": "Curriculum",
        "education": "Formazione",
        "experience": "Esperienza",
        "since2024": "Dal 2024"
      },
      "skills": {
        "title": "Competenze",
        "dotnet": ".NET (6–9), C#, ASP.NET Core",
        "azure": "Azure (Service Bus, Blob, Data Lake, Cosmos DB)",
        "arch": "Microservizi, REST API, Clean Architecture",
        "db": "Database (MS SQL, NoSQL)",
        "cicd": "CI/CD (Azure DevOps, Pipelines, Docker)",
        "langs": "Linguaggi & Framework: Python, Kotlin, Java, JavaScript, EF, ABP, Flutter, OData"
      },
      "projects": {
        "title": "Progetti",
        "status": {
          "live": "Live",
          "wip": "In Sviluppo",
          "beta": "Beta",
          "comingSoon": "Prossimamente",
          "online": "Online"
        },
        "deskforce": {
          "title": "Deskforce (Ufficio virtuale di agenti AI)",
          "description": "Deskforce è un ufficio virtuale di agenti AI. Assumi un team, assegna un obiettivo all'agente CEO e guardalo pianificare, delegare e realizzare il lavoro, con ogni dipendente visibile in tempo reale su una planimetria. Scegli un modello diverso per ogni dipendente (OpenAI, Claude, Gemini, Grok o modelli locali tramite Ollama). Approva piani e stime dei costi prima che venga realizzato qualsiasi cosa, annulla ogni attività con un clic grazie ai commit git per attività, imposta budget e limiti di spesa e gestisci tutto da Slack. Open source con licenza MIT. Release firmate per macOS, Windows e Linux, un’immagine Docker, test automatici e un sito di documentazione.",
          "download": "Scarica",
          "docs": "Documentazione",
          "code": "Codice sorgente",
          "caseStudy": "Case study"
        },
        "repovate": {
          "title": "Repovate.com (Analisi AI del repository e correzione automatica dei bug)",
          "description": "Repository AI Analysis & Automated Bug Fix è uno strumento basato su intelligenza artificiale che analizza il tuo codebase per individuare bug, problemi di sicurezza e criticità di performance — e genera automaticamente le relative correzioni. Si integra con il tuo flusso di lavoro Git per mantenere il codice pulito, sicuro e pronto per la produzione con il minimo sforzo."
        },
        "jetgenius": {
          "title": "JetGenius (AI-powered travel assistant)",
          "description": "JetGenius è un assistente di viaggio basato su intelligenza artificiale che ti aiuta a trovare i modi più intelligenti ed economici per volare. Va oltre la ricerca tradizionale dei voli, scoprendo rotte nascoste, date flessibili, biglietti spezzati e aeroporti alternativi per farti risparmiare. JetGenius trasforma una pianificazione di viaggio complessa in raccomandazioni chiare e concrete — così puoi prenotare voli migliori, più velocemente e spendendo meno."
        },
        "happydots": {
          "title": "HappyDots: Diario dell'Umore",
          "description": "HappyDots è un'applicazione mobile per iOS and Android progettata per tracciare il tuo umore quotidiano. Analizza i tuoi schemi per identificare cosa migliora o peggiora il tuo benessere, fornendo suggerimenti personalizzati per aiutarti a sentirti meglio.",
          "appleStore": "Scarica su App Store",
          "googlePlay": "Disponibile su Google Play"
        },
        "speedtap": {
          "title": "SpeedTap Arena",
          "description": "SpeedTap Arena è un gioco mobile competitivo realizzato con Flutter e Firebase Functions. Sfida i tuoi amici in battaglie di riflessi in tempo reale, scala la classifica globale e dimostra di avere le dita più veloci dell'arena.",
          "appleStore": "Scarica su App Store",
          "googlePlay": "Disponibile su Google Play"
        }
      },
      "booking": {
        "title": "Prenota una Call",
        "text": "Prenota una consulenza gratuita di 15 minuti per discutere del tuo progetto o chiarire le tue esigenze.",
        "button": "Prenota una data"
      },
      "blog": {
        "title": "Blog"
      },
      "contact": {
        "title": "Contatti",
        "formTitle": "Form di contatto",
        "fullname": "Nome e cognome",
        "email": "Indirizzo email",
        "message": "Il tuo messaggio",
        "send": "Invia messaggio",
        "introTitle": "Costruiamo Qualcosa di Grande Insieme",
        "introText": "Che tu stia pianificando funzionalità o agenti AI, abbia bisogno di un backend che scala o di technical leadership per il tuo team, raccontami a cosa stai lavorando. Sono disponibile part-time, da remoto, con trasferte per i kick-off.",
        "whyTitle": "Perché Contattarmi?",
        "reason1": {
          "title": "Architetture Scalabili",
          "text": "Esperienza nella progettazione di sistemi robusti utilizzando .NET, Azure e Microservizi."
        },
        "reason2": {
          "title": "Leadership Tecnica",
          "text": "Guida dei team, miglioramento della cultura dev e rilascio di prodotti ad alto impatto."
        },
        "reason3": {
          "title": "AI che arriva in produzione",
          "text": "Funzionalità LLM e agenti con valutazione, sicurezza e controllo dei costi, non solo demo."
        }
      },
      "privacy": {
        "link": "Privacy Policy",
        "title": "Privacy Policy",
        "intro": "Questa Privacy Policy descrive come le tue informazioni personali vengono raccolte, utilizzate e condivise quando visiti o mi contatti tramite questo sito web.",
        "collection": "Raccolta delle Informazioni",
        "collectionText": "Raccolgo le informazioni che fornisci direttamente a me, ad esempio quando invii un messaggio tramite il modulo di contatto o prenoti una riunione. Questo può includere il tuo nome, indirizzo email e qualsiasi altro dettaglio tu scelga di fornire.",
        "usage": "Come Utilizzo le Tue Informazioni",
        "usageText": "Utilizzo le informazioni raccolte per comunicare con te, rispondere alle tue richieste e pianificare incontri. Non vendo né condivido le tue informazioni personali con terze parti per scopi di marketing.",
        "analytics": "Analytics",
        "analyticsText": "Questo sito web può utilizzare strumenti di analisi di base per comprendere le tendenze dei visitatori. Questi strumenti raccolgono dati anonimi come il tipo di browser, il sito di riferimento e la data/ora di ogni richiesta del visitatore.",
        "contact": "Contatti",
        "contactText": "Per ulteriori informazioni sulle mie pratiche sulla privacy, o se hai domande, contattami utilizzando i dettagli forniti nella barra laterale o nel modulo di contatto."
      }
    }
  };

  let dict = embeddedTranslations; // default to embedded

  // Texts from the JSON file win; anything it lacks keeps its embedded translation
  function mergeDeep(base, extra) {
    const out = { ...base };
    for (const [key, value] of Object.entries(extra || {})) {
      out[key] = value && typeof value === 'object' && !Array.isArray(value) && typeof base[key] === 'object'
        ? mergeDeep(base[key], value)
        : value;
    }
    return out;
  }

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
          dict = mergeDeep(embeddedTranslations, await res.json());
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