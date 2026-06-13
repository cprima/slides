"use strict";

window.RatioSlider = window.RatioSlider || {
  id: "ratio-slider",
  init: function (deck) {
    deck.on("ready", function () {
      document
        .querySelectorAll(".reveal .slides section[data-ratio-slider]")
        .forEach(function (slide, i) {
          var raw = slide.getAttribute("data-ratio-slider");
          var config = raw ? JSON.parse(raw) : {};
          var value = config.value !== undefined ? config.value : 70;
          var caption = config.caption || "";
          var uid = "rs" + i;
          slide.innerHTML = buildSlide(uid, value, caption);
        });
    });
  },
};

function buildSlide(uid, value, caption) {
  var a = value;
  var b = 100 - value;
  return [
    '<div id="' + uid + '-display" style="display:flex;align-items:center;justify-content:center;gap:0.15em;line-height:1;margin-bottom:0.3em;">',
      '<span id="' + uid + '-a" style="font-size:7em;font-weight:700;min-width:3ch;text-align:right;">' + a + '</span>',
      '<span id="' + uid + '-sep" style="font-size:4em;font-weight:300;padding:0 0.1em;">:</span>',
      '<span id="' + uid + '-b" style="font-size:7em;font-weight:700;min-width:3ch;text-align:left;">' + b + '</span>',
    '</div>',
    '<div style="display:flex;height:1.2em;width:70%;margin:0 auto 1.2em;border-radius:4px;overflow:hidden;">',
      '<div id="' + uid + '-bar-a" style="width:' + a + '%;background:#859900;transition:width 0.1s;"></div>',
      '<div id="' + uid + '-bar-b" style="width:' + b + '%;background:#268bd2;transition:width 0.1s;"></div>',
    '</div>',
    '<input type="range" min="0" max="100" step="5" value="' + a + '" style="width:60%;accent-color:#268bd2;"',
      ' oninput="RatioSlider.update(\'' + uid + '\',+this.value)">',
    '<p id="' + uid + '-caption" ',
      'style="margin-top:1em;opacity:0.6;font-size:0.8em;cursor:text;" ',
      'title="Double-click to edit" ',
      'ondblclick="RatioSlider.editCaption(\'' + uid + '\')">',
      (caption || '<em style="opacity:0.4;">double-click to add caption</em>'),
    '</p>',
  ].join("");
}

RatioSlider.update = function (uid, v) {
  var b = 100 - v;
  var aEl = document.getElementById(uid + "-a");
  var bEl = document.getElementById(uid + "-b");
  var sep = document.getElementById(uid + "-sep");
  if (v === 0) {
    aEl.textContent = "0%"; bEl.textContent = ""; sep.style.display = "none";
  } else if (v === 100) {
    aEl.textContent = ""; bEl.textContent = "100%"; sep.style.display = "none";
  } else {
    aEl.textContent = v; bEl.textContent = b; sep.style.display = "";
  }
  document.getElementById(uid + "-bar-a").style.width = v + "%";
  document.getElementById(uid + "-bar-b").style.width = b + "%";
};

RatioSlider.editCaption = function (uid) {
  var p = document.getElementById(uid + "-caption");
  var current = p.dataset.value || p.textContent.trim();
  p.innerHTML =
    '<input id="' + uid + '-caption-input" type="text" value="' + current.replace(/"/g, "&quot;") + '" ' +
    'style="width:80%;font-size:1em;text-align:center;background:transparent;border:none;border-bottom:2px solid currentColor;outline:none;opacity:1;" ' +
    'onblur="RatioSlider.commitCaption(\'' + uid + '\')" ' +
    'onkeydown="if(event.key===\'Enter\'||event.key===\'Escape\')this.blur()">';
  var input = document.getElementById(uid + "-caption-input");
  input.focus();
  input.select();
};

RatioSlider.commitCaption = function (uid) {
  var input = document.getElementById(uid + "-caption-input");
  var val = input ? input.value.trim() : "";
  var p = document.getElementById(uid + "-caption");
  p.dataset.value = val;
  p.innerHTML = val || '<em style="opacity:0.4;">double-click to add caption</em>';
};
