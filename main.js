/* =========================================================
   IPAK YO'LI TOUR — script.js
   Izoh: bu fayl bir nechta mustaqil "bo'lim"larga bo'lingan.
   Har bir bo'lim bitta vazifani bajaradi — shunday yozish
   kodni o'qish va keyinchalik o'zgartirishni osonlashtiradi.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setFooterYear();
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initCounters();
  initGallery();
  initPackageButtons();
  initContactForm();
  initNewsletterForm();
});

/* ---------------------------------------------------------
   1) Footer'dagi yilni avtomatik yozish
   --------------------------------------------------------- */
function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   2) Mobil menyu (hamburger tugma)
   --------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Havolaga bosilganda menyu yopilsin (mobil qurilmalarda)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   3) Sahifa pastga aylantirilganda header'ga soya qo'shish
   --------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------
   4) Elementlar ko'rinishga kirganda paydo bo'lish animatsiyasi
   IntersectionObserver — element ekranga kirdi-kirmadi shuni kuzatadi
   --------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // faqat bir marta ishlasin
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------
   5) "Biz haqimizda" bo'limidagi raqamlarni animatsiya bilan sanash
   --------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll(".stat-num");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = 1200; // millisekund
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ---------------------------------------------------------
   6) Galereya — rasmga bosganda kattalashtirib ko'rsatish (lightbox)
   --------------------------------------------------------- */
function initGallery() {
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  const captionEl = document.getElementById("lightboxCaption");
  const lightboxImage = document.getElementById("lightboxImage");
  if (!items.length || !lightbox) return;

  const openLightbox = (caption, imageUrl, alt) => {
    captionEl.textContent = caption;
    lightboxImage.src = imageUrl;
    lightboxImage.alt = alt || caption;
    lightbox.hidden = false;
    closeBtn.focus();
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      openLightbox(item.dataset.caption || "", item.dataset.image || image?.src || "", image?.alt || "");
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox(); // faqat orqa fonga bosilsa yopiladi
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* ---------------------------------------------------------
   7) Tur kartochkalaridagi "Band qilish" tugmasi:
   bosilganda Aloqa formasidagi "Tur" tanlovini avtomatik to'ldiradi
   --------------------------------------------------------- */
function initPackageButtons() {
  const buttons = document.querySelectorAll(".btn-book");
  const tripSelect = document.getElementById("trip");
  if (!buttons.length || !tripSelect) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tripSelect.value = btn.dataset.trip || "";
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      document.getElementById("name").focus({ preventScroll: true });
    });
  });
}

/* ---------------------------------------------------------
   8) Aloqa formasi — oddiy tekshiruv (validatsiya)
   Eslatma: bu yerda haqiqiy server yo'q, shuning uchun forma
   faqat "yuborildi" xabarini ko'rsatadi. Haqiqiy loyihada bu
   joyga backend yoki Telegram bot integratsiyasi qo'shiladi.
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successEl = document.getElementById("formSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = form.querySelector("#name");
    const phoneInput = form.querySelector("#phone");
    let isValid = true;

    isValid = validateField(nameInput, nameInput.value.trim().length >= 2, "Ismingizni to'liq kiriting") && isValid;
    isValid = validateField(phoneInput, isPhoneOrEmail(phoneInput.value.trim()), "Telefon yoki email noto'g'ri") && isValid;

    if (!isValid) {
      successEl.hidden = true;
      return;
    }

    successEl.hidden = false;
    form.reset();
  });
}

// Yordamchi funksiya: bitta maydonni tekshiradi va xato xabarini ko'rsatadi
function validateField(input, condition, message) {
  const row = input.closest(".form-row");
  const errorEl = row.querySelector(".form-error");
  if (!condition) {
    row.classList.add("has-error");
    errorEl.textContent = message;
    return false;
  }
  row.classList.remove("has-error");
  errorEl.textContent = "";
  return true;
}

// Yordamchi funksiya: matn email yoki telefon raqamiga o'xshaydimi
function isPhoneOrEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnly = value.replace(/\D/g, "");
  return emailPattern.test(value) || digitsOnly.length >= 7;
}

/* ---------------------------------------------------------
   9) Footer'dagi obuna (newsletter) formasi
   --------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;
  const successEl = document.getElementById("newsletterSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successEl.hidden = false;
    form.reset();
  });
}

