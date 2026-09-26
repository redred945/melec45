/* M'ELEC — comportements du site (aucune dépendance) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Header : ombre au scroll */
  var header = $('.header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Menu mobile */
  var burger = $('.burger');
  var nav = $('#nav');
  if (burger && nav) {
    var setNav = function (open) {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function () { setNav(false); });
  }

  /* Apparition au scroll */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Sélecteur de projet (hero) */
  var tabs = $$('.tab');
  if (tabs.length) {
    var panels = $$('.panel');
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        var on = p.id === tab.getAttribute('aria-controls');
        p.hidden = !on;
        p.classList.toggle('is-in', on);
      });
      if (tab.scrollIntoView) tab.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
      if (focus) tab.focus();
    };
    var sel = $('.selector'), x0 = null, y0 = 0;
    if (sel) {
      sel.addEventListener('touchstart', function (e) { if (e.target.closest('.tabs')) { x0 = null; return; } x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      sel.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        x0 = null;
        if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
        var cur = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
        select(tabs[(cur + (dx < 0 ? 1 : -1) + tabs.length) % tabs.length]);
      }, { passive: true });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  /* Galerie : filtres + lightbox */
  var filters = $$('.filter');
  var shots = $$('.shot');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var cat = f.getAttribute('data-filter');
      filters.forEach(function (x) { x.setAttribute('aria-pressed', String(x === f)); });
      shots.forEach(function (s) { s.hidden = !(cat === 'all' || s.getAttribute('data-cat') === cat); });
    });
  });
  var lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = $('img', lb), lbCap = $('p', lb);
    $$('.shot button').forEach(function (b) {
      b.addEventListener('click', function () {
        var img = $('img', b);
        lbImg.src = img.getAttribute('data-full') || img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = img.alt;
        lb.showModal();
      });
    });
    $('.lb-close', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* Formulaire de contact : Web3Forms si une clé est renseignée, sinon mailto */
  var form = $('#contact-form');
  if (form) {
    var status = $('.form-status', form);
    var show = function (cls, msg) { status.className = 'form-status ' + cls; status.textContent = msg; };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fd = new FormData(form);
      if (fd.get('botcheck')) return; // honeypot
      var key = form.getAttribute('data-access-key');
      var btn = $('button[type=submit]', form);
      if (key && key.indexOf('VOTRE_') !== 0) {
        fd.append('access_key', key);
        fd.append('subject', 'Demande depuis melec45.fr — ' + (fd.get('demande') || ''));
        fd.append('from_name', 'Site melec45.fr');
        btn.disabled = true;
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (j.success) { form.reset(); show('ok', 'Merci ! Votre message a bien été envoyé. Nous revenons vers vous dès que possible.'); }
            else { show('err', 'Une erreur est survenue. Appelez-nous au 02 38 22 50 66 ou réessayez plus tard.'); }
          })
          .catch(function () { show('err', 'Une erreur est survenue. Appelez-nous au 02 38 22 50 66 ou réessayez plus tard.'); })
          .then(function () { btn.disabled = false; });
      } else {
        var body = 'Nom : ' + fd.get('nom') + '\nPrénom : ' + fd.get('prenom') + '\nTéléphone : ' + fd.get('tel') +
          '\nEmail : ' + fd.get('email') + '\nDemande : ' + fd.get('demande') + '\n\n' + fd.get('message');
        window.location.href = 'mailto:melec45@orange.fr?subject=' + encodeURIComponent('Demande — ' + fd.get('demande')) + '&body=' + encodeURIComponent(body);
        show('ok', 'Votre application de messagerie va s\'ouvrir pour finaliser l\'envoi.');
      }
    });
  }


  /* Carrousels (mobile) : pastilles de pagination */
  $$('.swipe').forEach(function (el) {
    var items = Array.prototype.slice.call(el.children).filter(function (x) { return !x.hidden; });
    if (items.length < 2) return;
    var dots = document.createElement('div');
    dots.className = 'dots';
    dots.setAttribute('aria-hidden', 'true');
    items.forEach(function () { dots.appendChild(document.createElement('i')); });
    el.insertAdjacentElement('afterend', dots);
    var d = dots.children, cur = -1;
    var update = function () {
      var max = el.scrollWidth - el.clientWidth;
      var idx = max <= 0 ? 0 : (el.scrollLeft >= max - 4 ? items.length - 1 : Math.round(el.scrollLeft / (max / (items.length - 1))));
      idx = Math.max(0, Math.min(items.length - 1, idx));
      if (idx === cur) return;
      cur = idx;
      for (var i = 0; i < d.length; i++) d[i].classList.toggle('on', i === idx);
    };
    el.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* Année du pied de page */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
