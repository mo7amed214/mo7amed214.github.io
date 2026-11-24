// Falling 0s and 1s behind the page. Dim on purpose: it is texture, not content.
(function () {
  var canvas = document.getElementById("rain");
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var SIZE = 16;          // px per glyph cell
  var FPS = 16;
  var w, h, cols, drops, timer;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = document.documentElement.clientWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = "14px 'IBM Plex Mono', ui-monospace, Consolas, monospace";
    ctx.textBaseline = "top";
    cols = Math.ceil(w / SIZE);
    drops = [];
    for (var i = 0; i < cols; i++) {
      // staggered starts so the screen fills gradually and unevenly
      drops.push(-Math.floor(Math.random() * (h / SIZE) * 1.5));
    }
    ctx.fillStyle = "#0b0b0c";
    ctx.fillRect(0, 0, w, h);
  }

  function frame() {
    // fade what is already drawn, leaving trails
    ctx.fillStyle = "rgba(11, 11, 12, 0.14)";
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < cols; i++) {
      var y = drops[i] * SIZE;
      if (y >= 0) {
        ctx.fillStyle = Math.random() < 0.05 ? "rgba(255, 74, 61, 0.95)" : "rgba(214, 211, 204, 0.6)";
        ctx.fillText(Math.random() < 0.5 ? "0" : "1", i * SIZE + 3, y);
      }
      if (y > h && Math.random() > 0.97) {
        drops[i] = -Math.floor(Math.random() * 20);
      }
      drops[i] += 1;
    }
  }

  function start() {
    if (!timer) timer = setInterval(frame, 1000 / FPS);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  resize();
  start();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });
})();
