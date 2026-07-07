/* ===========================
   MasterWeld - script.js
   =========================== */

/* ---- Loader ---- */
window.addEventListener('load', function () {
  var loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(function () { loader.style.display = 'none'; }, 400);
  }
});

/* ---- Footer Year ---- */
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Sticky Navbar ---- */
var navbar = document.getElementById('navbar');
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ---- Mobile Hamburger Menu ---- */
var hamburger  = document.getElementById('hamburger');
var navLinks   = document.getElementById('nav-links');

hamburger.addEventListener('click', function () {
  var isOpen = navLinks.classList.toggle('mobile-open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Close mobile nav when a link is clicked */
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('mobile-open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---- Smooth Scroll for in-page anchors ---- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var targetId = this.getAttribute('href').slice(1);
    var target   = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      var offset = navbar ? navbar.offsetHeight : 0;
      var top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

/* ---- Scroll Reveal (Intersection Observer) ---- */
var revealElements = document.querySelectorAll('.reveal');

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var el    = entry.target;
      var delay = el.getAttribute('data-delay') || '0';
      setTimeout(function () {
        el.classList.add('visible');
      }, parseInt(delay, 10));
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(function (el) { revealObserver.observe(el); });

/* ---- Gallery Lightbox ---- */
var lightbox       = document.getElementById('lightbox');
var lightboxImg    = document.getElementById('lightbox-img');
var lightboxCaption = document.getElementById('lightbox-caption');
var lightboxClose  = document.getElementById('lightbox-close');

function openLightbox(src, alt, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* Build gallery items with click handlers */
document.querySelectorAll('.gallery-item').forEach(function (item) {
  var img     = item.querySelector('img');
  var labelEl = item.querySelector('.gallery-label');

  /* Inject the inner label span */
  var span = document.createElement('span');
  span.className = 'gallery-label-text';
  span.textContent = labelEl.textContent || img.alt;
  labelEl.innerHTML = '';
  labelEl.appendChild(span);

  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', 'View ' + span.textContent);

  function trigger() { openLightbox(img.src, img.alt, span.textContent); }
  item.addEventListener('click', trigger);
  item.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});

/* ---- Back to Top ---- */
var backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', function () {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Contact Form Validation ---- */
var contactForm   = document.getElementById('contact-form');
var nameInput     = document.getElementById('name');
var emailInput    = document.getElementById('email');
var messageInput  = document.getElementById('message');
var nameError     = document.getElementById('name-error');
var emailError    = document.getElementById('email-error');
var messageError  = document.getElementById('message-error');
var formSuccess   = document.getElementById('form-success');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearErrors() {
  nameError.textContent    = '';
  emailError.textContent   = '';
  messageError.textContent = '';
  formSuccess.textContent  = '';
}

function showFieldError(el, msg) {
  el.textContent = msg;
}

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var name    = nameInput.value.trim();
    var email   = emailInput.value.trim();
    var message = messageInput.value.trim();
    var valid   = true;

    if (name.length < 2) {
      showFieldError(nameError, 'Name must be at least 2 characters.');
      valid = false;
    }

    if (!validateEmail(email)) {
      showFieldError(emailError, 'Please enter a valid email address.');
      valid = false;
    }

    if (message.length < 10) {
      showFieldError(messageError, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    /* Simulate form submission */
    var submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = false;

    setTimeout(function () {
      formSuccess.textContent = 'Message sent successfully! We will get back to you soon.';
      contactForm.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }, 1000);
  });

  /* Real-time validation feedback */
  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener('input', function () {
      var errorEl = document.getElementById(input.id + '-error');
      if (errorEl) errorEl.textContent = '';
    });
  });
}
