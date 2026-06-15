/* =================================================================
   Magalhães & Soares Advocacia — Scripts da interface
   Vanilla JS, sem dependências. Carregado com "defer".
   ================================================================= */
(function () {
  "use strict";

  /* -------------------------------------------------------------
     CONFIGURAÇÃO RÁPIDA
     Ajuste estes valores com os dados reais do escritório.
     O telefone do WhatsApp deve estar no formato internacional,
     somente dígitos: 55 (Brasil) + DDD + número.
  ------------------------------------------------------------- */
  var CONFIG = {
    whatsappNumber: "5511900000000", // <-- ALTERAR: 55 + DDD + número (somente dígitos)
    whatsappMessage:
      "Olá! Gostaria de agendar uma consulta com o escritório Magalhães & Soares Advocacia.",
    contactEmail: "contato@magalhaesesoares.adv.br", // <-- ALTERAR
    // Opcional: endpoint de formulário (ex.: Formspree "https://formspree.io/f/xxxx").
    // Se ficar vazio, o formulário abre o e-mail do cliente como alternativa.
    formEndpoint: ""
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ============================================================
     1. Monta os links do WhatsApp em toda a página
  ============================================================ */
  function buildWhatsappLinks() {
    var base =
      "https://wa.me/" +
      CONFIG.whatsappNumber +
      "?text=" +
      encodeURIComponent(CONFIG.whatsappMessage);
    $$("[data-whatsapp]").forEach(function (el) {
      el.setAttribute("href", base);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ============================================================
     2. Cabeçalho: sombra ao rolar + menu mobile
  ============================================================ */
  function initHeader() {
    var header = $(".site-header");
    var toggle = $(".nav-toggle");
    var menu = $(".mobile-menu");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && menu) {
      var setMenu = function (open) {
        toggle.setAttribute("aria-expanded", String(open));
        menu.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
      };
      toggle.addEventListener("click", function () {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
      });
      // Fecha ao clicar em um link do menu
      $$("a", menu).forEach(function (a) {
        a.addEventListener("click", function () { setMenu(false); });
      });
      // Fecha com ESC
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setMenu(false);
      });
    }
  }

  /* ============================================================
     3. Scrollspy: destaca o item do menu da seção visível
  ============================================================ */
  function initScrollSpy() {
    var links = $$(".nav a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("is-active"); });
            var active = map[entry.target.id];
            if (active) active.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  /* ============================================================
     4. Animações de entrada (reveal)
  ============================================================ */
  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     5. FAQ acordeão (acessível)
  ============================================================ */
  function initFaq() {
    $$(".faq-item__q").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        if (open) {
          panel.style.maxHeight = null;
          panel.setAttribute("hidden", "");
        } else {
          panel.removeAttribute("hidden");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* ============================================================
     6. Validação e envio do formulário de contato
  ============================================================ */
  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;

    var statusBox = $(".form-status", form);

    var showError = function (field, msg) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.add("has-error");
      var box = $(".error-msg", wrap);
      if (box && msg) box.textContent = msg;
      field.setAttribute("aria-invalid", "true");
    };
    var clearError = function (field) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    };

    var validators = {
      nome: function (v) {
        if (!v.trim()) return "Por favor, informe seu nome.";
        if (v.trim().length < 3) return "Informe seu nome completo.";
        return "";
      },
      email: function (v) {
        if (!v.trim()) return "Por favor, informe seu e-mail.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Informe um e-mail válido.";
        return "";
      },
      telefone: function (v) {
        if (!v.trim()) return "Por favor, informe um telefone.";
        var digits = v.replace(/\D/g, "");
        if (digits.length < 10) return "Informe um telefone com DDD.";
        return "";
      },
      assunto: function (v) {
        if (!v) return "Selecione um assunto.";
        return "";
      },
      mensagem: function (v) {
        if (!v.trim()) return "Conte-nos brevemente como podemos ajudar.";
        if (v.trim().length < 10) return "Descreva um pouco mais sua necessidade.";
        return "";
      }
    };

    // Validação em tempo real (após o primeiro toque)
    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", function () {
        var err = validators[name](field.value);
        if (err) showError(field, err); else clearError(field);
      });
      field.addEventListener("input", function () {
        if (field.closest(".field").classList.contains("has-error")) {
          var err = validators[name](field.value);
          if (!err) clearError(field);
        }
      });
    });

    var setStatus = function (type, msg) {
      if (!statusBox) return;
      statusBox.className = "form-status is-visible form-status--" + type;
      var icon =
        type === "ok"
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12" y2="16.5"/></svg>';
      statusBox.innerHTML = icon + "<span>" + msg + "</span>";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot anti-spam
      if (form.elements.website && form.elements.website.value) return;

      var firstInvalid = null;
      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var err = validators[name](field.value);
        if (err) { showError(field, err); if (!firstInvalid) firstInvalid = field; }
        else clearError(field);
      });

      var fieldsValid = !firstInvalid;
      var consent = form.elements.consentimento;
      if (consent && !consent.checked && !firstInvalid) firstInvalid = consent;

      if (firstInvalid) {
        firstInvalid.focus();
        setStatus(
          "err",
          fieldsValid
            ? "É necessário concordar com a Política de Privacidade para enviar."
            : "Verifique os campos destacados e tente novamente."
        );
        return;
      }

      var data = {
        nome: form.elements.nome.value.trim(),
        email: form.elements.email.value.trim(),
        telefone: form.elements.telefone.value.trim(),
        assunto: form.elements.assunto.value,
        mensagem: form.elements.mensagem.value.trim()
      };

      var submitBtn = $("[type='submit']", form);
      var originalText = submitBtn ? submitBtn.textContent : "";

      // (a) Se houver endpoint configurado, envia por fetch (ex.: Formspree)
      if (CONFIG.formEndpoint) {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando…"; }
        fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            if (!res.ok) throw new Error("network");
            form.reset();
            setStatus("ok", "Mensagem enviada com sucesso. Retornaremos em breve.");
          })
          .catch(function () {
            setStatus("err", "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.");
          })
          .finally(function () {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
          });
        return;
      }

      // (b) Sem backend: abre o cliente de e-mail com os dados preenchidos.
      var subject = "Contato pelo site — " + data.assunto + " — " + data.nome;
      var body =
        "Nome: " + data.nome + "\n" +
        "E-mail: " + data.email + "\n" +
        "Telefone: " + data.telefone + "\n" +
        "Assunto: " + data.assunto + "\n\n" +
        "Mensagem:\n" + data.mensagem;
      window.location.href =
        "mailto:" + CONFIG.contactEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setStatus("ok", "Abrimos seu aplicativo de e-mail para concluir o envio. Se preferir, fale conosco pelo WhatsApp.");
      form.reset();
    });
  }

  /* ============================================================
     7. Banner de cookies (LGPD)
  ============================================================ */
  function initCookieBanner() {
    var banner = $("#cookie-banner");
    if (!banner) return;
    var KEY = "ms-cookie-consent";

    var stored;
    try { stored = localStorage.getItem(KEY); } catch (e) { stored = "dismissed"; }

    if (!stored) {
      window.setTimeout(function () { banner.classList.add("is-visible"); }, 900);
    }

    var close = function (value) {
      try { localStorage.setItem(KEY, value); } catch (e) {}
      banner.classList.remove("is-visible");
    };

    $$("[data-cookie]", banner).forEach(function (btn) {
      btn.addEventListener("click", function () { close(btn.getAttribute("data-cookie")); });
    });
  }

  /* ============================================================
     8. Ano corrente no rodapé
  ============================================================ */
  function initYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------------------------- Boot ---------------------------- */
  function init() {
    buildWhatsappLinks();
    initHeader();
    initScrollSpy();
    initReveal();
    initFaq();
    initContactForm();
    initCookieBanner();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
