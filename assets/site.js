(function () {
  // Deployments
  var list = window.SSUP_DEPLOYMENTS || [];
  var host = document.getElementById("sites");
  var fmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  var sessions = 0;
  list.forEach(function (d) {
    sessions += d.dates.length;
    var card = el("article", "site");
    var head = el("header");
    var h = el("h3");
    if (d.link) { var a = el("a", null, d.site); a.href = d.link; h.appendChild(a); } else { h.textContent = d.site; }
    head.appendChild(h);
    head.appendChild(el("p", "where", d.borough));
    card.appendChild(head);
    card.appendChild(el("p", "season", d.season + (d.status === "coming" ? " (coming soon)" : "")));
    var ol = el("ol", "dates");
    d.dates.forEach(function (iso) {
      var li = el("li");
      var t = el("time", null, fmt.format(new Date(iso + "T00:00:00Z")));
      t.dateTime = iso;
      li.appendChild(t);
      li.appendChild(el("span", null, iso.slice(0, 4)));
      ol.appendChild(li);
    });
    card.appendChild(ol);
    if (d.note) card.appendChild(el("p", "note", d.note));
    host.appendChild(card);
  });
  var words = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve"];
  function w(n) { return words[n] || String(n); }
  if (list.length) {
    document.getElementById("fact-sites").textContent = w(list.length) + " plazas in New York City";
    document.getElementById("fact-sessions").textContent = w(sessions) + ", one to two hours each";
  }

  // Looping clips: play only on screen, and not at all if the visitor prefers reduced motion
  var vids = document.querySelectorAll("video.loop");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  vids.forEach(function (v) {
    if (still) { v.removeAttribute("autoplay"); v.pause(); v.controls = true; }
  });
  if (!still && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: 0.15 });
    vids.forEach(function (v) { io.observe(v); });
  }
})();
