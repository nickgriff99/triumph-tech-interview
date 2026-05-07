(function () {
  "use strict";

  // Countdown to next Sunday 10:00 AM (local time)
  function nextSundayServiceLocalFrom(fromDate) {
    var SERVICE_HOUR = 10;
    var now = fromDate ? new Date(fromDate) : new Date();
    var target = new Date(now);
    target.setHours(SERVICE_HOUR, 0, 0, 0);
    var dayOfWeek = target.getDay();
    var daysToSunday = (7 - dayOfWeek) % 7;
    if (daysToSunday === 0 && target.getTime() <= now.getTime()) {
      daysToSunday = 7;
    }
    target.setDate(target.getDate() + daysToSunday);
    return target;
  }

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  var countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    var targetTs = nextSundayServiceLocalFrom().getTime();
    var restartTs = 0;
    var confettiColors = ["#f59e0b", "#22c55e", "#38bdf8", "#ef4444", "#ffffff"];

    function launchCountdownConfetti() {
      var host = countdownEl.parentElement || countdownEl;
      var hostStyle = window.getComputedStyle(host);
      if (hostStyle.position === "static") {
        host.style.position = "relative";
      }

      var burst = document.createElement("div");
      burst.setAttribute("aria-hidden", "true");
      burst.style.position = "absolute";
      burst.style.left = "50%";
      burst.style.top = "50%";
      burst.style.width = "0";
      burst.style.height = "0";
      burst.style.pointerEvents = "none";
      burst.style.zIndex = "5";
      host.appendChild(burst);

      var particleCount = 20;
      var createdAt = Date.now();
      var lifetimeMs = 1100;
      var particles = [];

      for (var i = 0; i < particleCount; i += 1) {
        var particle = document.createElement("span");
        particle.style.position = "absolute";
        particle.style.left = "0";
        particle.style.top = "0";
        particle.style.width = "6px";
        particle.style.height = "10px";
        particle.style.borderRadius = "1px";
        particle.style.backgroundColor =
          confettiColors[Math.floor(Math.random() * confettiColors.length)];
        particle.style.opacity = "1";
        particle.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        burst.appendChild(particle);

        var angle = (-100 + Math.random() * 20 + (i / particleCount) * 50) * (Math.PI / 180);
        var speed = 120 + Math.random() * 90;
        var spin = (Math.random() * 720 - 360) | 0;
        particles.push({
          el: particle,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          spin: spin,
        });
      }

      function frame() {
        var elapsed = Date.now() - createdAt;
        var t = elapsed / 1000;
        var gravity = 260;
        var progress = Math.min(1, elapsed / lifetimeMs);

        for (var j = 0; j < particles.length; j += 1) {
          var part = particles[j];
          var x = part.vx * t;
          var y = part.vy * t + 0.5 * gravity * t * t;
          var rot = part.spin * progress;
          part.el.style.transform =
            "translate3d(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px, 0) rotate(" + rot.toFixed(1) + "deg)";
          part.el.style.opacity = String(1 - progress);
        }

        if (elapsed < lifetimeMs) {
          requestAnimationFrame(frame);
        } else {
          burst.remove();
        }
      }

      requestAnimationFrame(frame);
    }

    function tick() {
      var nowTs = Date.now();

      // When the countdown reaches zero, keep it at zero for 1 hour.
      // After that hour, restart toward the following Sunday at 10:00 AM.
      if (nowTs >= targetTs) {
        if (!restartTs) {
          launchCountdownConfetti();
          restartTs = targetTs + 60 * 60 * 1000;
        }
        if (nowTs < restartTs) {
          countdownEl.textContent = "00:00:00";
          return;
        }
        targetTs = nextSundayServiceLocalFrom(new Date(restartTs)).getTime();
        restartTs = 0;
      }

      var diffMs = Math.max(0, targetTs - nowTs);
      var totalSeconds = Math.floor(diffMs / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;
      var hourDisplay = days * 24 + hours;
      countdownEl.textContent =
        pad(hourDisplay) + ":" + pad(minutes) + ":" + pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }

  // Hero background — eased pan toward cursor
  var heroSection = document.querySelector(".hero");
  var heroMedia = document.querySelector(".hero-media");
  var heroImg = heroMedia && heroMedia.querySelector("img");
  /** Vertical nudge (px); keep in sync with .hero-media img transform in styles.css. */
  var HERO_IMG_BASE_OFFSET_Y = 46;
  if (heroSection && heroMedia && heroImg) {
    var heroReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!heroReducedMotion) {
      var heroPan = {
        targetX: 0,
        targetY: 0,
        curX: 0,
        curY: 0,
        maxX: 0,
        maxY: 0,
        raf: 0,
        smooth: 0.055,
        rangeIntensityX: 0.1,
        rangeIntensityY: 0.06,
      };

      function heroPanBounds() {
        var rect = heroMedia.getBoundingClientRect();
        var iw = heroImg.offsetWidth;
        var ih = heroImg.offsetHeight;
        var slackX = Math.max(0, (iw - rect.width) * 0.5);
        var slackY = Math.max(0, (ih - rect.height) * 0.5);
        heroPan.maxX = slackX * heroPan.rangeIntensityX;
        heroPan.maxY = slackY * heroPan.rangeIntensityY;
      }

      function heroPanApplyTransform() {
        var yPx = (heroPan.curY + HERO_IMG_BASE_OFFSET_Y).toFixed(2);
        heroImg.style.transform =
          "translate3d(calc(-50% + " +
          heroPan.curX.toFixed(2) +
          "px), calc(-50% + " +
          yPx +
          "px), 0)";
      }

      function heroPanFrame() {
        var dx = heroPan.targetX - heroPan.curX;
        var dy = heroPan.targetY - heroPan.curY;
        heroPan.curX += dx * heroPan.smooth;
        heroPan.curY += dy * heroPan.smooth;
        heroPanApplyTransform();
        if (Math.abs(dx) > 0.025 || Math.abs(dy) > 0.025) {
          heroPan.raf = requestAnimationFrame(heroPanFrame);
        } else {
          heroPan.raf = 0;
          heroPan.curX = heroPan.targetX;
          heroPan.curY = heroPan.targetY;
          heroPanApplyTransform();
        }
      }

      function heroPanKick() {
        if (!heroPan.raf) {
          heroPan.raf = requestAnimationFrame(heroPanFrame);
        }
      }

      function heroPanMove(ev) {
        var rect = heroMedia.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) {
          return;
        }
        var nx = (ev.clientX - rect.left) / rect.width;
        var ny = (ev.clientY - rect.top) / rect.height;
        nx = Math.max(0, Math.min(1, nx));
        ny = Math.max(0, Math.min(1, ny));
        heroPan.targetX = -(nx - 0.5) * 2 * heroPan.maxX;
        heroPan.targetY = -(ny - 0.5) * 2 * heroPan.maxY;
        heroPanKick();
      }

      function heroPanLeave() {
        heroPan.targetX = 0;
        heroPan.targetY = 0;
        heroPanKick();
      }

      heroSection.addEventListener("pointermove", heroPanMove);
      heroSection.addEventListener("pointerleave", heroPanLeave);
      window.addEventListener("resize", function () {
        requestAnimationFrame(function () {
          heroPanBounds();
          heroPan.targetX = Math.max(
            -heroPan.maxX,
            Math.min(heroPan.maxX, heroPan.targetX)
          );
          heroPan.targetY = Math.max(
            -heroPan.maxY,
            Math.min(heroPan.maxY, heroPan.targetY)
          );
          heroPan.curX = Math.max(
            -heroPan.maxX,
            Math.min(heroPan.maxX, heroPan.curX)
          );
          heroPan.curY = Math.max(
            -heroPan.maxY,
            Math.min(heroPan.maxY, heroPan.curY)
          );
          heroPanKick();
        });
      });

      function heroPanInitBounds() {
        heroPanBounds();
        heroPan.curX = heroPan.targetX;
        heroPan.curY = heroPan.targetY;
        heroPanApplyTransform();
      }

      if (heroImg.complete) {
        heroPanInitBounds();
      } else {
        heroImg.addEventListener("load", heroPanInitBounds);
      }
    } else {
      heroImg.style.transform = "translate3d(-50%, -50%, 0)";
      heroImg.style.willChange = "auto";
    }
  }

  // Close the mobile/tablet navbar collapse after choosing a link
  var siteNavCollapse = document.getElementById("siteNav");
  var siteNavToggler = document.querySelector(
    '.site-nav .navbar-toggler[data-bs-target="#siteNav"]'
  );
  if (
    siteNavCollapse &&
    siteNavToggler &&
    typeof window.bootstrap !== "undefined" &&
    window.bootstrap.Collapse
  ) {
    siteNavCollapse.addEventListener("show.bs.collapse", function () {
      siteNavCollapse.classList.remove("site-nav__collapse--animating-out");
      siteNavCollapse.classList.add("site-nav__collapse--animating-in");
    });
    siteNavCollapse.addEventListener("shown.bs.collapse", function () {
      siteNavCollapse.classList.remove("site-nav__collapse--animating-in");
    });
    siteNavCollapse.addEventListener("hide.bs.collapse", function () {
      siteNavCollapse.classList.remove("site-nav__collapse--animating-in");
      siteNavCollapse.classList.add("site-nav__collapse--animating-out");
    });
    siteNavCollapse.addEventListener("hidden.bs.collapse", function () {
      siteNavCollapse.classList.remove("site-nav__collapse--animating-out");
    });

    siteNavCollapse.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest("a");
      if (!a || !siteNavCollapse.contains(a)) {
        return;
      }
      if (siteNavToggler.getAttribute("aria-expanded") !== "true") {
        return;
      }
      var inst = window.bootstrap.Collapse.getInstance(siteNavCollapse);
      if (inst) {
        inst.hide();
      }
    });
  }

  // Desktop “more” dropdown
  var navMoreToggle = document.getElementById("siteNavMore");
  var navMoreMenu =
    navMoreToggle &&
    navMoreToggle.parentElement &&
    navMoreToggle.parentElement.querySelector(".site-nav__dropdown");
  if (
    navMoreToggle &&
    navMoreMenu &&
    typeof window.bootstrap !== "undefined" &&
    window.bootstrap.Dropdown
  ) {
    var navMoreAllowHide = false;
    var navMoreMotionOk =
      !window.matchMedia ||
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    navMoreToggle.addEventListener("show.bs.dropdown", function () {
      navMoreMenu.classList.remove("site-nav__dropdown--closing");
    });

    if (navMoreMotionOk) {
      navMoreToggle.addEventListener("hide.bs.dropdown", function (ev) {
        if (navMoreAllowHide) {
          navMoreAllowHide = false;
          return;
        }
        ev.preventDefault();
        navMoreMenu.classList.add("site-nav__dropdown--closing");

        function onDismissEnd(e) {
          if (
            e.target !== navMoreMenu ||
            e.animationName !== "site-nav-dropdown-dismiss"
          ) {
            return;
          }
          navMoreMenu.removeEventListener("animationend", onDismissEnd);
          navMoreMenu.classList.remove("site-nav__dropdown--closing");
          navMoreAllowHide = true;
          var dd = window.bootstrap.Dropdown.getInstance(navMoreToggle);
          if (dd) {
            dd.hide();
          }
        }

        navMoreMenu.addEventListener("animationend", onDismissEnd);
      });
    }
  }

  // Scroll-driven fading
  var scrollReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!scrollReducedMotion) {
    var fadeTargets = document.querySelectorAll(".scroll-fade");
    if (fadeTargets.length && "IntersectionObserver" in window) {
      var fadeObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var el = entry.target;
            if (entry.isIntersecting) {
              el.classList.add("is-visible");
              if (el.dataset.scrollFadeOnce === "true") {
                fadeObserver.unobserve(el);
              }
            } else {
              if (el.dataset.scrollFadeOnce !== "true") {
                el.classList.remove("is-visible");
              }
            }
          });
        },
        {
          // Trigger slightly before the element edges hit the viewport, and
          // require ~12% visibility so tiny slivers near edges don't flicker.
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.12,
        }
      );

      fadeTargets.forEach(function (el) {
        fadeObserver.observe(el);
      });
    }

    var heroOverlayEl = document.querySelector(".hero-overlay");
    var heroSectionEl = document.querySelector(".hero");
    if (heroOverlayEl && heroSectionEl) {
      var heroFadeRaf = 0;
      var lastHeroProgress = -1;

      function updateHeroFade() {
        heroFadeRaf = 0;
        var heroHeight = heroSectionEl.offsetHeight || 1;
        var raw = (window.scrollY - heroHeight * 0.2) / (heroHeight * 0.6);
        var progress = Math.max(0, Math.min(1, raw));
        if (Math.abs(progress - lastHeroProgress) < 0.005) {
          return;
        }
        lastHeroProgress = progress;
        heroOverlayEl.style.setProperty("--hero-scroll", progress.toFixed(3));
      }

      function scheduleHeroFade() {
        if (!heroFadeRaf) {
          heroFadeRaf = requestAnimationFrame(updateHeroFade);
        }
      }

      window.addEventListener("scroll", scheduleHeroFade, { passive: true });
      window.addEventListener("resize", scheduleHeroFade);
      updateHeroFade();
    }
  }

  // Volunteer carousel
  if (typeof Swiper !== "undefined") {
    var reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var volunteerViewport = document.querySelector(
      ".volunteer-swiper-viewport"
    );

    function volunteerEdgeFades(swiper) {
      if (!volunteerViewport) {
        return;
      }
      volunteerViewport.classList.toggle(
        "volunteer-swiper-viewport--show-fade-left",
        !swiper.isBeginning
      );
      volunteerViewport.classList.toggle(
        "volunteer-swiper-viewport--show-fade-right",
        !swiper.isEnd
      );
    }

    new Swiper(".volunteer-swiper", {
      slidesPerView: "auto",
      spaceBetween: 12,
      slidesOffsetBefore: 12,
      slidesOffsetAfter: 12,
      grabCursor: true,
      watchOverflow: true,
      speed: reducedMotion ? 0 : 420,
      autoplay: reducedMotion
        ? false
        : {
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      resistanceRatio: 0.65,
      keyboard: { enabled: true },
      a11y: {
        enabled: true,
      },
      scrollbar: {
        el: ".volunteer-swiper-scrollbar",
        draggable: true,
        hide: false,
        dragSize: "auto",
      },
      breakpoints: {
        576: {
          spaceBetween: 14,
          slidesOffsetBefore: 16,
          slidesOffsetAfter: 16,
        },
        768: {
          spaceBetween: 16,
          slidesOffsetBefore: 18,
          slidesOffsetAfter: 18,
        },
        992: {
          spaceBetween: 18,
          slidesOffsetBefore: 20,
          slidesOffsetAfter: 20,
        },
      },
      on: {
        init: function (swiper) {
          volunteerEdgeFades(swiper);
        },
        resize: function (swiper) {
          volunteerEdgeFades(swiper);
        },
        slideChange: function (swiper) {
          volunteerEdgeFades(swiper);
        },
        transitionEnd: function (swiper) {
          volunteerEdgeFades(swiper);
        },
        setTranslate: function (swiper) {
          volunteerEdgeFades(swiper);
        },
      },
    });
  }
})();
