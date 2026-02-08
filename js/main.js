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
