"use strict";

window.cpmFooter = window.cpmFooter || {
  id: "cpmFooter",
  init: function (deck) {
    initFooter(deck);
  },
};

const initFooter = function (deck) {
  deck.on("ready", function () {
    const config = deck.getConfig().cpmFooter || {};
    const text = config.text || (window._site && window._site.copyright) || "Copyright © 2026 Christian Prior-Mamulyan · License CC BY 4.0";

    const footer = document.createElement("footer");
    footer.id = "cpmFooter";
    footer.innerHTML = text;

    document.querySelector(".reveal").appendChild(footer);

    function updateVisibility() {
      const slide = deck.getCurrentSlide();
      const state = slide ? slide.getAttribute("data-state") : "";
      footer.style.display = state === "no-title-footer" ? "none" : "";
    }

    updateVisibility();
    deck.on("slidechanged", updateVisibility);
    deck.on("statechange", updateVisibility);
  });
};
