/* =========================================================
   HEARTLINK AI — Main JavaScript
   File: js/main.js
   Version: 2.0
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     Header scroll state
     --------------------------------------------------------- */
  const header = $("#header");

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  const mobileButton = $("#mobileButton");
  const mobileMenu = $("#mobileMenu");

  const setMenuState = (open) => {
    if (!mobileButton || !mobileMenu) return;

    mobileButton.setAttribute("aria-expanded", String(open));
    mobileButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );

    mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener("click", () => {
      const isOpen =
        mobileButton.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    $$("a", mobileMenu).forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    document.addEventListener("click", (event) => {
      const isOpen =
        mobileButton.getAttribute("aria-expanded") === "true";

      if (
        isOpen &&
        !mobileMenu.contains(event.target) &&
        !mobileButton.contains(event.target)
      ) {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        setMenuState(false);
      }
    });
  }

  /* ---------------------------------------------------------
     Smooth internal navigation
     --------------------------------------------------------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      if (history.pushState) {
        history.pushState(null, "", href);
      }
    });
  });

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  const faqButtons = $$(".faq-question");

  const closeFaq = (button) => {
    const item = button.closest(".faq-item");
    const answer = item ? $(".faq-answer", item) : null;

    button.setAttribute("aria-expanded", "false");

    if (answer) {
      answer.hidden = true;
    }
  };

  const openFaq = (button) => {
    const item = button.closest(".faq-item");
    const answer = item ? $(".faq-answer", item) : null;

    button.setAttribute("aria-expanded", "true");

    if (answer) {
      answer.hidden = false;
    }
  };

  faqButtons.forEach((button, index) => {
    const item = button.closest(".faq-item");
    const answer = item ? $(".faq-answer", item) : null;

    if (answer) {
      const buttonId = button.id || `faq-question-${index + 1}`;
      const answerId = answer.id || `faq-answer-${index + 1}`;

      button.id = buttonId;
      answer.id = answerId;

      button.setAttribute("aria-controls", answerId);
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-labelledby", buttonId);
      answer.hidden = true;
    }

    button.addEventListener("click", () => {
      const expanded =
        button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach((otherButton) => {
        if (otherButton !== button) {
          closeFaq(otherButton);
        }
      });

      if (expanded) {
        closeFaq(button);
      } else {
        openFaq(button);
      }
    });
  });

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  const revealGroups = [
    {
      selector: ".section-title",
      className: "reveal-ready",
    },
    {
      selector: ".feature-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".step-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".statistics-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".language-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".preview-left",
      className: "reveal-left reveal-ready",
    },
    {
      selector: ".preview-right",
      className: "reveal-right reveal-ready",
    },
    {
      selector: ".secret-image",
      className: "reveal-left reveal-ready",
    },
    {
      selector: ".secret-content",
      className: "reveal-right reveal-ready",
    },
    {
      selector: ".faq-item",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".cta-box",
      className: "reveal-scale reveal-ready",
    },
  ];

  const revealElements = [];

  revealGroups.forEach((group) => {
    $$(group.selector).forEach((element, index) => {
      group.className
        .split(" ")
        .filter(Boolean)
        .forEach((className) => element.classList.add(className));

      if (group.stagger) {
        const staggerIndex = (index % 6) + 1;
        element.classList.add(`stagger-${staggerIndex}`);
      }

      revealElements.push(element);
    });
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* ---------------------------------------------------------
     Scroll-to-top button
     --------------------------------------------------------- */
  const scrollTopButton = $("#scrollTop");

  const updateScrollTop = () => {
    if (!scrollTopButton) return;

    scrollTopButton.hidden = window.scrollY < 650;
  };

  if (scrollTopButton) {
    updateScrollTop();

    window.addEventListener("scroll", updateScrollTop, {
      passive: true,
    });

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------------------------------------------------------
     Cookie / local-storage notice
     --------------------------------------------------------- */
  const cookieNotice = $("#cookieNotice");
  const acceptCookies = $("#acceptCookies");
  const storageKey = "heartlink_notice_acknowledged";

  const safeStorageGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const safeStorageSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      /* Storage may be disabled. The website still works. */
    }
  };



  /* ---------------------------------------------------------
     Multilingual interface
     --------------------------------------------------------- */
  const I18N = {"de":{"Skip to content":"Zum Inhalt springen","Features":"Funktionen","How it Works":"So funktioniert es","Languages":"Sprachen","FAQ":"FAQ","Telegram Bot":"Telegram-Bot","Home":"Startseite","Technical Support @HEARTLINK55":"Technischer Support @HEARTLINK55","AI POWERED • FREE • PRIVATE":"KI-BASIERT • KOSTENLOS • PRIVAT","Meet the person":"Lerne die Person kennen","who could change":"die dein Leben verändern könnte","your life.":"dein Leben.","HEARTLINK AI connects real people through intelligent recommendations, GPS search, multilingual communication and private matching inside Telegram.":"HEARTLINK AI verbindet echte Menschen durch intelligente Empfehlungen, GPS-Suche, mehrsprachige Kommunikation und privates Matching direkt in Telegram.","Start HEARTLINK AI in Telegram":"HEARTLINK AI in Telegram starten","See How It Works":"So funktioniert es","Official bot:":"Offizieller Bot:","Technical support:":"Technischer Support:","AI Matching":"KI-Matching","GPS Search":"GPS-Suche","Private":"Privat","Countries Supported":"Unterstützte Länder","Intelligent Matchmaking":"Intelligentes Matching","Telegram Availability":"Telegram-Verfügbarkeit","During Beta Testing":"Während der Beta-Testphase","WHY HEARTLINK AI":"WARUM HEARTLINK AI","A new generation of intelligent social networking":"Eine neue Generation intelligenter sozialer Vernetzung","AI, GPS discovery, multilingual communication and Telegram simplicity in one private experience.":"KI, GPS-Suche, mehrsprachige Kommunikation und die Einfachheit von Telegram in einer privaten Lösung.","AI Recommendations":"KI-Empfehlungen","Intelligent matching uses your preferences to recommend compatible people instead of random profiles.":"Intelligentes Matching nutzt deine Präferenzen, um passende Menschen statt zufälliger Profile vorzuschlagen.","Discover people nearby or expand your search around the world with an adjustable search radius.":"Entdecke Menschen in deiner Nähe oder erweitere die Suche weltweit mit einem einstellbaren Suchradius.","Automatic Translation":"Automatische Übersetzung","Communicate across countries and languages with fewer barriers.":"Kommuniziere über Länder- und Sprachgrenzen hinweg mit weniger Barrieren.","Private Communication":"Private Kommunikation","Your confidential preferences stay private. You decide when you want to start communicating.":"Deine vertraulichen Präferenzen bleiben privat. Du entscheidest, wann du kommunizieren möchtest.","Secret Desire Matching":"Secret-Desire-Matching","Private preferences are compared anonymously and surfaced only when a compatible match is found.":"Private Präferenzen werden anonym verglichen und nur bei einer passenden Übereinstimmung angezeigt.","Inside Telegram":"In Telegram","No separate dating application is required. HEARTLINK AI works directly inside Telegram.":"Keine separate Dating-App erforderlich. HEARTLINK AI funktioniert direkt in Telegram.","HOW IT WORKS":"SO FUNKTIONIERT ES","Four simple steps":"Vier einfache Schritte","Start meeting people within minutes without a complicated registration process.":"Lerne in wenigen Minuten Menschen kennen – ohne komplizierte Registrierung.","Open the Bot":"Bot öffnen","Launch HEARTLINK AI directly inside Telegram.":"Starte HEARTLINK AI direkt in Telegram.","Complete Your Profile":"Profil vervollständigen","Add your photo, basic information, language and search preferences.":"Füge Foto, Basisdaten, Sprache und Suchpräferenzen hinzu.","AI Searches For You":"KI sucht für dich","HEARTLINK AI searches for compatible people using your selected criteria and location settings.":"HEARTLINK AI sucht anhand deiner Kriterien und Standorteinstellungen nach passenden Menschen.","Start Communication":"Kommunikation starten","Review recommended profiles and start communicating directly through Telegram.":"Sieh dir empfohlene Profile an und beginne direkt über Telegram zu kommunizieren.","TELEGRAM EXPERIENCE":"TELEGRAM-ERLEBNIS","Everything happens inside Telegram":"Alles passiert in Telegram","No separate application, no extra password and no complicated interface.":"Keine separate App, kein zusätzliches Passwort und keine komplizierte Oberfläche.","Instant notifications":"Sofortige Benachrichtigungen","AI recommendations":"KI-Empfehlungen","Multilingual communication":"Mehrsprachige Kommunikation","GPS search":"GPS-Suche","Private Secret Desire matching":"Privates Secret-Desire-Matching","Open Telegram Bot":"Telegram-Bot öffnen","UNIQUE FEATURE":"EINZIGARTIGE FUNKTION","Users can privately describe personal interests, wishes and relationship expectations.":"Nutzer können persönliche Interessen, Wünsche und Beziehungserwartungen privat beschreiben.","This information is not displayed publicly. HEARTLINK AI compares compatible private preferences automatically.":"Diese Informationen werden nicht öffentlich angezeigt. HEARTLINK AI vergleicht passende private Präferenzen automatisch.","When compatible preferences are found, the platform can inform the matched users without publicly exposing their private entries.":"Bei passenden Präferenzen kann die Plattform die Nutzer informieren, ohne ihre privaten Angaben öffentlich zu machen.","WORLDWIDE":"WELTWEIT","Speak your language. Meet the whole world.":"Sprich deine Sprache. Triff die ganze Welt.","HEARTLINK AI is designed for international communication and connections across borders.":"HEARTLINK AI wurde für internationale Kommunikation und grenzüberschreitende Kontakte entwickelt.","Frequently Asked Questions":"Häufig gestellte Fragen","Is HEARTLINK AI free?":"Ist HEARTLINK AI kostenlos?","Yes. During the current beta period, the service is free to use.":"Ja. Während der aktuellen Beta-Phase ist der Service kostenlos.","Do I need to install another application?":"Muss ich eine weitere App installieren?","No. The service works directly inside Telegram.":"Nein. Der Service funktioniert direkt in Telegram.","Can I search worldwide?":"Kann ich weltweit suchen?","You can configure your search area and discover people beyond your immediate location.":"Du kannst deinen Suchbereich einstellen und Menschen auch außerhalb deiner direkten Umgebung entdecken.","Are private preferences shown to other users?":"Werden private Präferenzen anderen Nutzern angezeigt?","Secret Desire entries are intended to remain private and are used for compatible matching rather than public profile display.":"Secret-Desire-Angaben bleiben privat und dienen dem Matching, nicht der öffentlichen Profilanzeige.","READY TO START?":"BEREIT ZU STARTEN?","Your next meaningful connection could begin today.":"Deine nächste bedeutungsvolle Verbindung könnte heute beginnen.","Open HEARTLINK AI in Telegram and discover a new way to meet people.":"Öffne HEARTLINK AI in Telegram und entdecke eine neue Art, Menschen kennenzulernen.","Launch HEARTLINK AI":"HEARTLINK AI starten","AI-powered Telegram platform helping people create meaningful connections worldwide.":"KI-basierte Telegram-Plattform für bedeutungsvolle Kontakte weltweit.","Navigation":"Navigation","Information":"Information","Community":"Community","Privacy Policy":"Datenschutz","User Agreement":"Nutzungsvereinbarung","Help Center":"Hilfe-Center","Contact":"Kontakt","All rights reserved.":"Alle Rechte vorbehalten.","This website may use essential browser storage to remember interface preferences.":"Diese Website kann notwendigen Browserspeicher verwenden, um Oberflächeneinstellungen zu speichern.","Language":"Sprache"},"ru":{"Skip to content":"Перейти к содержимому","Features":"Возможности","How it Works":"Как это работает","Languages":"Языки","Telegram Bot":"Telegram-бот","Home":"Главная","Technical Support @HEARTLINK55":"Техническая поддержка @HEARTLINK55","AI POWERED • FREE • PRIVATE":"НА БАЗЕ ИИ • БЕСПЛАТНО • КОНФИДЕНЦИАЛЬНО","Meet the person":"Встретьте человека","who could change":"который может изменить","your life.":"вашу жизнь.","HEARTLINK AI connects real people through intelligent recommendations, GPS search, multilingual communication and private matching inside Telegram.":"HEARTLINK AI объединяет реальных людей с помощью интеллектуальных рекомендаций, GPS-поиска, многоязычного общения и конфиденциального подбора прямо в Telegram.","Start HEARTLINK AI in Telegram":"Запустить HEARTLINK AI в Telegram","See How It Works":"Как это работает","Official bot:":"Официальный бот:","Technical support:":"Техническая поддержка:","AI Matching":"ИИ-подбор","GPS Search":"GPS-поиск","Private":"Конфиденциально","Countries Supported":"Поддерживаемых стран","Intelligent Matchmaking":"Интеллектуальный подбор","Telegram Availability":"Доступность в Telegram","During Beta Testing":"Во время бета-тестирования","WHY HEARTLINK AI":"ПОЧЕМУ HEARTLINK AI","A new generation of intelligent social networking":"Новое поколение интеллектуальных знакомств","AI, GPS discovery, multilingual communication and Telegram simplicity in one private experience.":"ИИ, GPS-поиск, многоязычное общение и простота Telegram в едином конфиденциальном сервисе.","AI Recommendations":"Рекомендации ИИ","Intelligent matching uses your preferences to recommend compatible people instead of random profiles.":"Интеллектуальный подбор использует ваши предпочтения и рекомендует совместимых людей вместо случайных анкет.","Discover people nearby or expand your search around the world with an adjustable search radius.":"Находите людей рядом или расширяйте поиск по всему миру с настраиваемым радиусом.","Automatic Translation":"Автоматический перевод","Communicate across countries and languages with fewer barriers.":"Общайтесь между странами и языками с меньшим количеством барьеров.","Private Communication":"Конфиденциальное общение","Your confidential preferences stay private. You decide when you want to start communicating.":"Ваши конфиденциальные предпочтения остаются приватными. Вы сами решаете, когда начать общение.","Secret Desire Matching":"Подбор Secret Desire","Private preferences are compared anonymously and surfaced only when a compatible match is found.":"Личные предпочтения сравниваются анонимно и раскрываются только при совместимом совпадении.","Inside Telegram":"Внутри Telegram","No separate dating application is required. HEARTLINK AI works directly inside Telegram.":"Отдельное приложение для знакомств не требуется. HEARTLINK AI работает прямо в Telegram.","HOW IT WORKS":"КАК ЭТО РАБОТАЕТ","Four simple steps":"Четыре простых шага","Start meeting people within minutes without a complicated registration process.":"Начните знакомиться за несколько минут без сложной регистрации.","Open the Bot":"Откройте бота","Launch HEARTLINK AI directly inside Telegram.":"Запустите HEARTLINK AI прямо в Telegram.","Complete Your Profile":"Заполните профиль","Add your photo, basic information, language and search preferences.":"Добавьте фото, основную информацию, язык и параметры поиска.","AI Searches For You":"ИИ ищет за вас","HEARTLINK AI searches for compatible people using your selected criteria and location settings.":"HEARTLINK AI ищет совместимых людей по выбранным критериям и настройкам местоположения.","Start Communication":"Начните общение","Review recommended profiles and start communicating directly through Telegram.":"Просмотрите рекомендованные анкеты и начните общение прямо через Telegram.","TELEGRAM EXPERIENCE":"РАБОТА В TELEGRAM","Everything happens inside Telegram":"Всё происходит внутри Telegram","No separate application, no extra password and no complicated interface.":"Никакого отдельного приложения, дополнительного пароля или сложного интерфейса.","Instant notifications":"Мгновенные уведомления","AI recommendations":"Рекомендации ИИ","Multilingual communication":"Многоязычное общение","GPS search":"GPS-поиск","Private Secret Desire matching":"Конфиденциальный подбор Secret Desire","Open Telegram Bot":"Открыть Telegram-бот","UNIQUE FEATURE":"УНИКАЛЬНАЯ ФУНКЦИЯ","Users can privately describe personal interests, wishes and relationship expectations.":"Пользователи могут конфиденциально описывать личные интересы, желания и ожидания от отношений.","This information is not displayed publicly. HEARTLINK AI compares compatible private preferences automatically.":"Эта информация не отображается публично. HEARTLINK AI автоматически сравнивает совместимые личные предпочтения.","When compatible preferences are found, the platform can inform the matched users without publicly exposing their private entries.":"При обнаружении совместимых предпочтений платформа может уведомить пользователей, не раскрывая их личные записи публично.","WORLDWIDE":"ПО ВСЕМУ МИРУ","Speak your language. Meet the whole world.":"Говорите на своём языке. Знакомьтесь со всем миром.","HEARTLINK AI is designed for international communication and connections across borders.":"HEARTLINK AI создан для международного общения и знакомств без границ.","Frequently Asked Questions":"Часто задаваемые вопросы","Is HEARTLINK AI free?":"HEARTLINK AI бесплатный?","Yes. During the current beta period, the service is free to use.":"Да. В период текущего бета-тестирования сервис бесплатный.","Do I need to install another application?":"Нужно ли устанавливать другое приложение?","No. The service works directly inside Telegram.":"Нет. Сервис работает прямо в Telegram.","Can I search worldwide?":"Можно искать по всему миру?","You can configure your search area and discover people beyond your immediate location.":"Вы можете настроить область поиска и находить людей далеко за пределами вашего текущего местоположения.","Are private preferences shown to other users?":"Показываются ли личные предпочтения другим пользователям?","Secret Desire entries are intended to remain private and are used for compatible matching rather than public profile display.":"Записи Secret Desire остаются конфиденциальными и используются для совместимого подбора, а не для публичного отображения профиля.","READY TO START?":"ГОТОВЫ НАЧАТЬ?","Your next meaningful connection could begin today.":"Ваше следующее важное знакомство может начаться уже сегодня.","Open HEARTLINK AI in Telegram and discover a new way to meet people.":"Откройте HEARTLINK AI в Telegram и откройте новый способ знакомиться.","Launch HEARTLINK AI":"Запустить HEARTLINK AI","AI-powered Telegram platform helping people create meaningful connections worldwide.":"Telegram-платформа на базе ИИ, помогающая людям создавать значимые знакомства по всему миру.","Navigation":"Навигация","Information":"Информация","Community":"Сообщество","Privacy Policy":"Политика конфиденциальности","User Agreement":"Пользовательское соглашение","Help Center":"Центр помощи","Contact":"Контакты","All rights reserved.":"Все права защищены.","This website may use essential browser storage to remember interface preferences.":"Этот сайт может использовать необходимое хранилище браузера для запоминания настроек интерфейса.","Language":"Язык"},"uk":{"Features":"Можливості","How it Works":"Як це працює","Languages":"Мови","Home":"Головна","Telegram Bot":"Telegram-бот","Meet the person":"Зустріньте людину","who could change":"яка може змінити","your life.":"ваше життя.","Start HEARTLINK AI in Telegram":"Запустити HEARTLINK AI у Telegram","See How It Works":"Як це працює","AI Matching":"ШІ-підбір","GPS Search":"GPS-пошук","Private":"Конфіденційно","WHY HEARTLINK AI":"ЧОМУ HEARTLINK AI","A new generation of intelligent social networking":"Нове покоління інтелектуальних знайомств","AI Recommendations":"Рекомендації ШІ","Automatic Translation":"Автоматичний переклад","Private Communication":"Конфіденційне спілкування","Secret Desire Matching":"Підбір Secret Desire","Inside Telegram":"У Telegram","HOW IT WORKS":"ЯК ЦЕ ПРАЦЮЄ","Four simple steps":"Чотири прості кроки","Open the Bot":"Відкрийте бота","Complete Your Profile":"Заповніть профіль","AI Searches For You":"ШІ шукає для вас","Start Communication":"Почніть спілкування","Everything happens inside Telegram":"Усе відбувається всередині Telegram","Open Telegram Bot":"Відкрити Telegram-бот","UNIQUE FEATURE":"УНІКАЛЬНА ФУНКЦІЯ","WORLDWIDE":"ПО ВСЬОМУ СВІТУ","Speak your language. Meet the whole world.":"Говоріть своєю мовою. Знайомтеся з усім світом.","Frequently Asked Questions":"Поширені запитання","Is HEARTLINK AI free?":"HEARTLINK AI безкоштовний?","Yes. During the current beta period, the service is free to use.":"Так. Під час поточного бета-тестування сервіс безкоштовний.","Do I need to install another application?":"Чи потрібно встановлювати інший застосунок?","No. The service works directly inside Telegram.":"Ні. Сервіс працює безпосередньо в Telegram.","Can I search worldwide?":"Чи можна шукати по всьому світу?","READY TO START?":"ГОТОВІ ПОЧАТИ?","Launch HEARTLINK AI":"Запустити HEARTLINK AI","Navigation":"Навігація","Information":"Інформація","Community":"Спільнота","Privacy Policy":"Політика конфіденційності","User Agreement":"Угода користувача","Help Center":"Центр допомоги","Contact":"Контакти","Language":"Мова"},"fr":{"Features":"Fonctionnalités","How it Works":"Comment ça marche","Languages":"Langues","Home":"Accueil","Telegram Bot":"Bot Telegram","Meet the person":"Rencontrez la personne","who could change":"qui pourrait changer","your life.":"votre vie.","Start HEARTLINK AI in Telegram":"Démarrer HEARTLINK AI dans Telegram","See How It Works":"Voir comment ça marche","AI Matching":"Matching IA","GPS Search":"Recherche GPS","Private":"Privé","WHY HEARTLINK AI":"POURQUOI HEARTLINK AI","A new generation of intelligent social networking":"Une nouvelle génération de réseau social intelligent","AI Recommendations":"Recommandations IA","Automatic Translation":"Traduction automatique","Private Communication":"Communication privée","Secret Desire Matching":"Matching Secret Desire","Inside Telegram":"Dans Telegram","HOW IT WORKS":"COMMENT ÇA MARCHE","Four simple steps":"Quatre étapes simples","Open the Bot":"Ouvrez le bot","Complete Your Profile":"Complétez votre profil","AI Searches For You":"L’IA cherche pour vous","Start Communication":"Commencez à communiquer","Everything happens inside Telegram":"Tout se passe dans Telegram","Open Telegram Bot":"Ouvrir le bot Telegram","UNIQUE FEATURE":"FONCTION UNIQUE","WORLDWIDE":"DANS LE MONDE ENTIER","Speak your language. Meet the whole world.":"Parlez votre langue. Rencontrez le monde entier.","Frequently Asked Questions":"Questions fréquentes","Is HEARTLINK AI free?":"HEARTLINK AI est-il gratuit ?","Yes. During the current beta period, the service is free to use.":"Oui. Pendant la phase bêta actuelle, le service est gratuit.","Do I need to install another application?":"Dois-je installer une autre application ?","No. The service works directly inside Telegram.":"Non. Le service fonctionne directement dans Telegram.","Can I search worldwide?":"Puis-je chercher dans le monde entier ?","READY TO START?":"PRÊT À COMMENCER ?","Launch HEARTLINK AI":"Lancer HEARTLINK AI","Navigation":"Navigation","Information":"Informations","Community":"Communauté","Privacy Policy":"Politique de confidentialité","User Agreement":"Conditions d’utilisation","Help Center":"Centre d’aide","Contact":"Contact","Language":"Langue"},"es":{"Features":"Funciones","How it Works":"Cómo funciona","Languages":"Idiomas","Home":"Inicio","Telegram Bot":"Bot de Telegram","Meet the person":"Conoce a la persona","who could change":"que podría cambiar","your life.":"tu vida.","Start HEARTLINK AI in Telegram":"Iniciar HEARTLINK AI en Telegram","See How It Works":"Ver cómo funciona","AI Matching":"Compatibilidad con IA","GPS Search":"Búsqueda GPS","Private":"Privado","WHY HEARTLINK AI":"POR QUÉ HEARTLINK AI","A new generation of intelligent social networking":"Una nueva generación de redes sociales inteligentes","AI Recommendations":"Recomendaciones de IA","Automatic Translation":"Traducción automática","Private Communication":"Comunicación privada","Secret Desire Matching":"Compatibilidad Secret Desire","Inside Telegram":"Dentro de Telegram","HOW IT WORKS":"CÓMO FUNCIONA","Four simple steps":"Cuatro pasos sencillos","Open the Bot":"Abre el bot","Complete Your Profile":"Completa tu perfil","AI Searches For You":"La IA busca por ti","Start Communication":"Empieza a comunicarte","Everything happens inside Telegram":"Todo sucede dentro de Telegram","Open Telegram Bot":"Abrir bot de Telegram","UNIQUE FEATURE":"FUNCIÓN ÚNICA","WORLDWIDE":"EN TODO EL MUNDO","Speak your language. Meet the whole world.":"Habla tu idioma. Conoce el mundo entero.","Frequently Asked Questions":"Preguntas frecuentes","Is HEARTLINK AI free?":"¿HEARTLINK AI es gratis?","Yes. During the current beta period, the service is free to use.":"Sí. Durante la fase beta actual, el servicio es gratuito.","Do I need to install another application?":"¿Necesito instalar otra aplicación?","No. The service works directly inside Telegram.":"No. El servicio funciona directamente en Telegram.","Can I search worldwide?":"¿Puedo buscar en todo el mundo?","READY TO START?":"¿LISTO PARA EMPEZAR?","Launch HEARTLINK AI":"Iniciar HEARTLINK AI","Navigation":"Navegación","Information":"Información","Community":"Comunidad","Privacy Policy":"Política de privacidad","User Agreement":"Acuerdo de usuario","Help Center":"Centro de ayuda","Contact":"Contacto","Language":"Idioma"},"ar":{"Features":"المزايا","How it Works":"كيف يعمل","Languages":"اللغات","Home":"الرئيسية","Telegram Bot":"بوت تيليغرام","Meet the person":"تعرّف على الشخص","who could change":"الذي قد يغيّر","your life.":"حياتك.","Start HEARTLINK AI in Telegram":"ابدأ HEARTLINK AI في تيليغرام","See How It Works":"شاهد كيف يعمل","AI Matching":"مطابقة بالذكاء الاصطناعي","GPS Search":"بحث GPS","Private":"خاص","WHY HEARTLINK AI":"لماذا HEARTLINK AI","A new generation of intelligent social networking":"جيل جديد من التواصل الاجتماعي الذكي","AI Recommendations":"توصيات الذكاء الاصطناعي","Automatic Translation":"ترجمة تلقائية","Private Communication":"تواصل خاص","Secret Desire Matching":"مطابقة Secret Desire","Inside Telegram":"داخل تيليغرام","HOW IT WORKS":"كيف يعمل","Four simple steps":"أربع خطوات بسيطة","Open the Bot":"افتح البوت","Complete Your Profile":"أكمل ملفك الشخصي","AI Searches For You":"الذكاء الاصطناعي يبحث لك","Start Communication":"ابدأ التواصل","Everything happens inside Telegram":"كل شيء يحدث داخل تيليغرام","Open Telegram Bot":"فتح بوت تيليغرام","UNIQUE FEATURE":"ميزة فريدة","WORLDWIDE":"حول العالم","Speak your language. Meet the whole world.":"تحدث بلغتك. تعرّف على العالم.","Frequently Asked Questions":"الأسئلة الشائعة","Is HEARTLINK AI free?":"هل HEARTLINK AI مجاني؟","Yes. During the current beta period, the service is free to use.":"نعم. خلال فترة الاختبار التجريبي الحالية، الخدمة مجانية.","Do I need to install another application?":"هل أحتاج إلى تثبيت تطبيق آخر؟","No. The service works directly inside Telegram.":"لا. تعمل الخدمة مباشرة داخل تيليغرام.","Can I search worldwide?":"هل يمكنني البحث حول العالم؟","READY TO START?":"هل أنت مستعد؟","Launch HEARTLINK AI":"تشغيل HEARTLINK AI","Navigation":"التنقل","Information":"معلومات","Community":"المجتمع","Privacy Policy":"سياسة الخصوصية","User Agreement":"اتفاقية المستخدم","Help Center":"مركز المساعدة","Contact":"اتصال","Language":"اللغة"},"zh":{"Features":"功能","How it Works":"工作原理","Languages":"语言","Home":"首页","Telegram Bot":"Telegram 机器人","Meet the person":"遇见那个","who could change":"可能改变","your life.":"你生活的人。","Start HEARTLINK AI in Telegram":"在 Telegram 中启动 HEARTLINK AI","See How It Works":"查看工作原理","AI Matching":"AI 匹配","GPS Search":"GPS 搜索","Private":"私密","WHY HEARTLINK AI":"为什么选择 HEARTLINK AI","A new generation of intelligent social networking":"新一代智能社交网络","AI Recommendations":"AI 推荐","Automatic Translation":"自动翻译","Private Communication":"私密交流","Secret Desire Matching":"Secret Desire 匹配","Inside Telegram":"在 Telegram 内","HOW IT WORKS":"工作原理","Four simple steps":"四个简单步骤","Open the Bot":"打开机器人","Complete Your Profile":"完善个人资料","AI Searches For You":"AI 为你搜索","Start Communication":"开始交流","Everything happens inside Telegram":"一切都在 Telegram 内完成","Open Telegram Bot":"打开 Telegram 机器人","UNIQUE FEATURE":"独特功能","WORLDWIDE":"全球","Speak your language. Meet the whole world.":"说你的语言，认识全世界。","Frequently Asked Questions":"常见问题","Is HEARTLINK AI free?":"HEARTLINK AI 免费吗？","Yes. During the current beta period, the service is free to use.":"是的。目前测试期间可免费使用。","Do I need to install another application?":"需要安装其他应用吗？","No. The service works directly inside Telegram.":"不需要。服务直接在 Telegram 中运行。","Can I search worldwide?":"可以在全球搜索吗？","READY TO START?":"准备开始了吗？","Launch HEARTLINK AI":"启动 HEARTLINK AI","Navigation":"导航","Information":"信息","Community":"社区","Privacy Policy":"隐私政策","User Agreement":"用户协议","Help Center":"帮助中心","Contact":"联系","Language":"语言"}};

  const originalText = new WeakMap();
  const translatableTextNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT","STYLE","NOSCRIPT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    originalText.set(node, node.nodeValue);
    translatableTextNodes.push(node);
  }

  const normalizeText = (value) => value.replace(/\s+/g, " ").trim();

  const applyLanguage = (lang) => {
    const dict = I18N[lang] || {};
    translatableTextNodes.forEach((node) => {
      const sourceRaw = originalText.get(node) || node.nodeValue;
      const source = normalizeText(sourceRaw);
      if (lang === "en") {
        node.nodeValue = sourceRaw;
        return;
      }
      const translated = dict[source];
      if (!translated) {
        node.nodeValue = sourceRaw;
        return;
      }
      const lead = sourceRaw.match(/^\s*/)?.[0] || "";
      const tail = sourceRaw.match(/\s*$/)?.[0] || "";
      node.nodeValue = lead + translated + tail;
    });

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    safeStorageSet("heartlink_language", lang);

    const desktopSelect = $("#languageSelect");
    const mobileSelect = $("#mobileLanguageSelect");
    if (desktopSelect) desktopSelect.value = lang;
    if (mobileSelect) mobileSelect.value = lang;

    $$("[data-language]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.language === lang);
      button.setAttribute("aria-pressed", String(button.dataset.language === lang));
    });
  };

  const savedLanguage = safeStorageGet("heartlink_language");
  const browserLanguage = (navigator.language || "en").toLowerCase().split("-")[0];
  const initialLanguage = savedLanguage || (["en","de","fr","es","uk","ru","ar","zh"].includes(browserLanguage) ? browserLanguage : "en");

  ["#languageSelect", "#mobileLanguageSelect"].forEach((selector) => {
    const select = $(selector);
    if (select) select.addEventListener("change", (event) => applyLanguage(event.target.value));
  });
  $$("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });
  applyLanguage(initialLanguage);

  if (cookieNotice) {
    const acknowledged = safeStorageGet(storageKey) === "1";

    if (!acknowledged) {
      window.setTimeout(() => {
        cookieNotice.hidden = false;
      }, prefersReducedMotion ? 0 : 700);
    }
  }

  if (acceptCookies && cookieNotice) {
    acceptCookies.addEventListener("click", () => {
      safeStorageSet(storageKey, "1");
      cookieNotice.hidden = true;
    });
  }

  /* ---------------------------------------------------------
     External links safety
     --------------------------------------------------------- */
  $$('a[target="_blank"]').forEach((link) => {
    const rel = new Set(
      (link.getAttribute("rel") || "")
        .split(/\s+/)
        .filter(Boolean)
    );

    rel.add("noopener");
    rel.add("noreferrer");

    link.setAttribute("rel", Array.from(rel).join(" "));
  });

  /* ---------------------------------------------------------
     Current year
     Keeps copyright current if a year element is later added.
     --------------------------------------------------------- */
  $$("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------
     Image error protection
     Avoid broken-image icons for optional decorative assets.
     --------------------------------------------------------- */
  $$("img").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.classList.add("image-load-error");
      },
      { once: true }
    );
  });

  /* ---------------------------------------------------------
     Keyboard usability for mobile menu
     --------------------------------------------------------- */
  if (mobileButton && mobileMenu) {
    mobileMenu.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;

      const focusable = $$(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        mobileMenu
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        mobileButton.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        setMenuState(false);
      }
    });
  }

  /* ---------------------------------------------------------
     Initial page state
     --------------------------------------------------------- */
  document.documentElement.classList.add("js-ready");
})();
