(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isTouch = window.matchMedia("(hover: none)").matches;

    // Mobile nav toggle
    var navToggle = document.getElementById("navToggle");
    var siteNav = document.getElementById("siteNav");

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
            var isOpen = siteNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        siteNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                siteNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Footer year
    var yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Scroll progress bar
    var progressBar = document.getElementById("scrollProgress");
    if (progressBar) {
        var updateProgress = function () {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = pct + "%";
        };
        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
    }

    // Scroll reveal
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length) {
        revealEls.forEach(function (el) {
            var delay = el.getAttribute("data-delay");
            if (delay) el.style.setProperty("--d", delay);
        });

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealEls.forEach(function (el) { el.classList.add("is-visible"); });
        } else {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

            revealEls.forEach(function (el) { observer.observe(el); });
        }
    }

    // Cursor glow (desktop only)
    var cursorGlow = document.getElementById("cursorGlow");
    var heroEl = document.querySelector(".hero");
    if (cursorGlow && heroEl && !isTouch && !prefersReducedMotion) {
        heroEl.addEventListener("mousemove", function (e) {
            var rect = heroEl.getBoundingClientRect();
            cursorGlow.style.left = (e.clientX - rect.left) + "px";
            cursorGlow.style.top = (e.clientY - rect.top) + "px";
        });
    }

    // Tilt effect on cards
    if (!isTouch && !prefersReducedMotion) {
        document.querySelectorAll("[data-tilt]").forEach(function (card) {
            card.style.transformStyle = "preserve-3d";
            card.style.transition = card.style.transition + ", transform .25s ease";

            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                var rotateX = (y * -6).toFixed(2);
                var rotateY = (x * 8).toFixed(2);
                card.style.transform = "perspective(700px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-6px)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }

    // Contact form -> WhatsApp
    var form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var name = form.name.value.trim();
            var contactMethod = form.contactMethod.value.trim();
            var message = form.message.value.trim();

            var text = "Hola Nicolás, soy " + name +
                ". Mi email/teléfono es " + contactMethod +
                ". " + message;

            var url = "https://api.whatsapp.com/send?phone=5491133909033&text=" +
                encodeURIComponent(text);

            window.open(url, "_blank", "noopener");
        });
    }
})();
