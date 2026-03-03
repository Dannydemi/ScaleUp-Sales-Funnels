document.addEventListener("DOMContentLoaded", () => {
  // ===================== MENU TOGGLE =====================
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("active"));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) nav.classList.remove("active");
    });
  }

  // ===================== FADE-IN =====================
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));

  // ===================== AUTO YEAR =====================
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ===================== CASE STUDY COUNTERS =====================
  document.querySelectorAll(".case-study").forEach(caseStudy => {
    let started = false;
    const counters = caseStudy.querySelectorAll(".count");

    const formatNumber = num => {
      if (num >= 100) return "$" + num.toLocaleString();
      return num;
    };

    const startCounters = () => {
      counters.forEach(counter => {
        const target = +counter.getAttribute("data-target") || 0;
        let current = 0;
        const increment = target / 80;

        const update = () => {
          current += increment;
          if (current < target) {
            counter.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(update);
          } else {
            counter.textContent = formatNumber(target);
          }
        };

        update();
      });
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !started) {
            started = true;
            startCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(caseStudy);
  });

  // ===================== RESULT CARD COUNTERS =====================
  document.querySelectorAll(".result-card h3").forEach(el => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateResultCounter(el);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(el);
  });

  function animateResultCounter(el) {
    // FIX: If the result heading contains a .count span (new structure),
    // animate ONLY that span using data-target and do NOT overwrite the whole h3.
    const countEl = el.querySelector(".count");

    if (countEl) {
      const target = +countEl.getAttribute("data-target") || 0;
      let current = 0;

      const duration = 1500;
      const increment = Math.max(1, Math.floor(target / (duration / 16)));

      const update = () => {
        current += increment;

        if (current >= target) {
          countEl.textContent = target;
          return;
        }

        countEl.textContent = current;
        requestAnimationFrame(update);
      };

      update();
      return; // IMPORTANT: prevent fallback from overwriting the h3 text
    }

    // Fallback: original behavior for any result h3 without a .count span
    const targetText = el.innerText.trim();
    const isPercent = targetText.includes("%");
    const isMultiplier = targetText.includes("X");
    const targetValue = parseInt(targetText.replace(/\D/g, ""), 10) || 0;
    let current = 0;
    const duration = 1500;
    const increment = Math.max(1, Math.floor(targetValue / (duration / 16)));

    const update = () => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        el.innerText = isPercent
          ? `${current}%`
          : isMultiplier
          ? `${current}X`
          : current;
        return;
      }

      el.innerText = isPercent
        ? `${current}%`
        : isMultiplier
        ? `${current}X`
        : current;

      requestAnimationFrame(update);
    };

    update();
  }

  // ===================== GENERIC COUNT ELEMENTS =====================
  document.querySelectorAll(".count").forEach(counter => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const updateCount = () => {
            const target = +counter.getAttribute("data-target") || 0;
            const current = +counter.innerText.replace(/\D/g, '') || 0;
            const increment = target / 200;

            if (current < target) {
              counter.innerText = Math.ceil(current + increment);
              setTimeout(updateCount, 10);
            } else {
              if (counter.dataset.target.includes('000')) {
                counter.innerText = `$${target.toLocaleString()}`;
              } else if(counter.dataset.target === "98") {
                counter.innerText = `${target}%`;
              } else {
                counter.innerText = target;
              }
            }
          };

          updateCount();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counter);
  });
});

// Blog filter functionality
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const blogCards = document.querySelectorAll(".blog-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      blogCards.forEach(card => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";   // show
        } else {
          card.style.display = "none";    // hide
        }
      });
    });
  });
});

// ================= QUOTE FORM (ScaleUp Sales Funnels) =================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  const statusEl = document.getElementById("quoteStatus");
  const thankYou = document.getElementById("thankYouMessage");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwXPNhp1hEga32ycn__lJYe9mdXEZt0tQ2Sw1S4qwHJplMN3mzWLWW9womLkV-b_y5h/exec";

  // Ensure visible form never navigates away
  form.removeAttribute("action");
  form.removeAttribute("method");
  form.removeAttribute("target");

  // Hidden iframe (created if missing)
  let iframe = document.getElementById("quote_hidden_iframe");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "quote_hidden_iframe";
    iframe.name = "quote_hidden_iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }

  // Hidden form that actually posts to Apps Script
  let hiddenForm = document.getElementById("quote_hidden_form");
  if (!hiddenForm) {
    hiddenForm = document.createElement("form");
    hiddenForm.id = "quote_hidden_form";
    hiddenForm.style.display = "none";
    document.body.appendChild(hiddenForm);
  }

  hiddenForm.method = "POST";
  hiddenForm.action = SCRIPT_URL;
  hiddenForm.target = "quote_hidden_iframe";

  let submitted = false;

  // When iframe loads AFTER submit, treat as success
  iframe.addEventListener("load", () => {
    if (!submitted) return;

    if (statusEl) statusEl.textContent = "";
    form.style.display = "none";
    if (thankYou) thankYou.style.display = "block";

    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = false;

    submitted = false;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (statusEl) statusEl.textContent = "Submitting…";

    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    // Clear previous hidden inputs
    hiddenForm.innerHTML = "";

    // Collect visible form data
    const fd = new FormData(form);

    // Add metadata
    fd.append("source", window.location.href);
    fd.append("workflow_stage", "Lead received - needs qualification");
    fd.append("status", "New");

    // Copy form data into hidden inputs
    for (const [key, value] of fd.entries()) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      hiddenForm.appendChild(input);
    }

    submitted = true;

    // Submit silently (no CORS issues)
    hiddenForm.submit();

    // Fallback: if iframe never loads, re-enable button after 6s
    setTimeout(() => {
      if (!submitted) return;
      submitted = false;
      if (statusEl) statusEl.textContent = "Submitted. If you don’t see the thank-you message, please try again.";
      if (btn) btn.disabled = false;
    }, 6000);
  }, true);
});

