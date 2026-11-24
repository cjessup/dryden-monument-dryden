(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 879px)").matches) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "Menu";
        }
      });
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.querySelectorAll(".hero").forEach(function (hero) {
    var slides = hero.querySelectorAll(".hero-slide");
    if (slides.length < 2 || reduce) return;
    var i = 0;
    slides.forEach(function (slide, index) {
      var on = index === 0;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    window.setInterval(function () {
      slides[i].classList.remove("is-active");
      slides[i].setAttribute("aria-hidden", "true");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
      slides[i].setAttribute("aria-hidden", "false");
    }, 5500);
  });

  var box = document.getElementById("lightbox");
  if (box) {
    var dialog = box.querySelector(".lightbox-dialog");
    var img = box.querySelector(".lb-img");
    var closeBtn = box.querySelector(".lb-close");
    var prevBtn = box.querySelector(".lb-prev");
    var nextBtn = box.querySelector(".lb-next");
    var group = [];
    var index = 0;
    var lastFocus = null;

    function show(nextIndex) {
      index = (nextIndex + group.length) % group.length;
      var link = group[index];
      var nextSrc = link.getAttribute("href");
      var nextAlt = link.querySelector("img") ? link.querySelector("img").alt : "Photograph";
      function apply() {
        img.src = nextSrc;
        img.alt = nextAlt;
        img.classList.remove("is-fading");
      }
      if (reduce) {
        apply();
        return;
      }
      img.classList.add("is-fading");
      window.setTimeout(apply, 180);
    }

    function open(links, start) {
      group = Array.prototype.slice.call(links);
      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.style.overflow = "hidden";
      show(start);
      closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll(".gallery").forEach(function (gallery) {
      var links = gallery.querySelectorAll(".shot");
      links.forEach(function (link, linkIndex) {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          open(links, linkIndex);
        });
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () {
      show(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      show(index + 1);
    });
    box.addEventListener("click", function (event) {
      if (event.target === box) close();
    });
    document.addEventListener("keydown", function (event) {
      if (box.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
      if (event.key === "Tab" && dialog) {
        var focusable = [closeBtn, prevBtn, nextBtn];
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  document.querySelectorAll(".demo-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var note = form.querySelector(".form-result");
      if (note) {
        note.hidden = false;
        note.textContent = "This is a demo form. Your message was not sent.";
      }
    });
  });
})();
