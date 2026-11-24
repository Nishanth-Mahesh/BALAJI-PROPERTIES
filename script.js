/* Balaji Properties — vanilla JS. Business settings live here. */
const CONFIG = {
  whatsapp: "918105819378",
  businessName: "Balaji Properties Pvt Ltd"
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- Image fallbacks (local file -> online source -> gradient) ---------- */
function onImgFail(img) {
  const fb = img.dataset.fallback;
  if (fb && !img.dataset.tried) {
    img.dataset.tried = "1";
    img.removeAttribute("srcset");
    img.src = fb;
  } else {
    img.classList.add("broken");
    const fig = img.closest("figure");
    if (fig) fig.classList.add("fail");
  }
}
document.addEventListener("error", e => { if (e.target.tagName === "IMG") onImgFail(e.target); }, true);
$$("img").forEach(img => { if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) onImgFail(img); });

/* ---------- Mobile menu ---------- */
const burger = $("#burger"), menu = $("#menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("lock", open);
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
window.addEventListener("resize", () => { if (innerWidth >= 900) setMenu(false); });

/* ---------- Property finder (enquiry-based, no invented listings) ---------- */
const TYPES = [
  { key: "20×30", group: "plot", title: "20×30 Site", sub: "600 sq.ft", text: "Compact residential site for a first home or an investment." },
  { key: "30×40", group: "plot", title: "30×40 Site", sub: "1,200 sq.ft", text: "A popular residential dimension across Mysuru layouts." },
  { key: "40×60", group: "plot", title: "40×60 Site", sub: "2,400 sq.ft", text: "Generous space for a larger family home." },
  { key: "50×80", group: "plot", title: "50×80 Site", sub: "4,000 sq.ft", text: "Large residential site for a spacious custom build." },
  { key: "60×90", group: "plot", title: "60×90 Site", sub: "5,400 sq.ft", text: "Our largest residential dimension, for premium homes." },
  { key: "Premium Flat", group: "flat", title: "Premium Flat", sub: "Flats & apartments", text: "Premium flats, with guided visits and document support." },
  { key: "Commercial Land", group: "commercial", title: "Commercial Land", sub: "Commercial parcels", text: "Commercial land and parcels for business use." }
];
const fLoc = $("#fLoc"), fDim = $("#fDim"), results = $("#results"), statusEl = $("#fStatus");
let group = "";

function enquiryText(t, loc) {
  const where = loc ? `in ${loc}, Mysore` : "in Mysore";
  return `Hello ${CONFIG.businessName}, I am looking for a ${t.title} ${where}. Please share the available options and arrange a site visit.`;
}
function render() {
  const loc = fLoc.value, dim = fDim.value;
  const list = TYPES.filter(t => dim ? t.key === dim : group ? t.group === group : true);
  const where = loc || "All Mysuru areas";
  statusEl.textContent = list.length
    ? `Showing ${list.length} property ${list.length === 1 ? "type" : "types"} · ${where}`
    : "No matching property type. Try resetting the filters.";
  results.innerHTML = list.map(t => `
    <article class="rc">
      <h4>${t.title}</h4>
      <div class="sub">${t.sub}${loc ? " · " + loc : ""}</div>
      <p>${t.text}</p>
      <a class="btn wa-btn" href="${waLink(enquiryText(t, loc))}" target="_blank" rel="noopener">
        <svg class="ic" aria-hidden="true"><use href="#i-wa"/></svg>Enquire on WhatsApp</a>
    </article>`).join("");
}
$("#filterForm").addEventListener("submit", e => { e.preventDefault(); if (fDim.value) group = ""; render(); });
$("#filterForm").addEventListener("reset", () => { group = ""; setTimeout(render); });
$("#fAll").addEventListener("click", () => {
  group = ""; fLoc.value = ""; fDim.value = ""; render();
  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
$$(".cat").forEach(c => c.addEventListener("click", () => { group = c.dataset.group; fDim.value = ""; render(); }));
fDim.addEventListener("change", () => { if (fDim.value) group = ""; });
render();

/* ---------- Forms -> WhatsApp ---------- */
function phoneOK(v) {
  const d = v.replace(/[^\d+]/g, "").replace(/^\+?91(?=\d{10}$)/, "").replace(/^0(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(d);
}
function handle(form, build) {
  const err = $(".err", form);
  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let bad = [];
    $$("input,select,textarea", form).forEach(f => {
      f.classList.remove("invalid");
      const empty = f.required && !String(f.value).trim();
      const badPhone = f.name === "phone" && f.value.trim() && !phoneOK(f.value);
      if (empty || badPhone) { f.classList.add("invalid"); bad.push(f); }
    });
    if (bad.length) {
      const f = bad[0];
      err.textContent = f.name === "phone" && f.value.trim()
        ? "Enter a valid 10-digit Indian mobile number."
        : "Please complete the highlighted fields.";
      f.focus();
      return;
    }
    err.textContent = "";
    window.open(waLink(build(data)), "_blank", "noopener");
  });
  form.addEventListener("input", e => e.target.classList.remove("invalid"));
}
handle($("#sellForm"), d => [
  `Hello ${CONFIG.businessName}, I would like to list my property for sale.`, "",
  `Owner Name: ${d.name}`,
  `Phone: ${d.phone}`,
  `Property Type: ${d.type}`,
  `Site / Survey / Door No.: ${d.number}`,
  `Locality: ${d.locality}`,
  `Exact Location: ${d.location}`,
  `Expected Price: ${d.price}`,
  `Additional Details: ${d.details && d.details.trim() ? d.details.trim() : "-"}`
].join("\n"));

const vDate = $("#vDate");
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
vDate.min = today;
handle($("#visitForm"), d => {
  const [y, m, day] = d.date.split("-");
  const nice = new Date(+y, +m - 1, +day).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return [
    `Hello ${CONFIG.businessName}, I would like to book a site visit.`, "",
    `Name: ${d.name}`,
    `Phone: ${d.phone}`,
    `Property Type: ${d.type}`,
    `Preferred Visit Date: ${nice}`,
    "", "Please confirm the time."
  ].join("\n");
});
vDate.addEventListener("change", () => { if (vDate.value && vDate.value < today) { vDate.value = ""; $(".err", $("#visitForm")).textContent = "Choose today or a future date."; } });

/* ---------- Gallery lightbox ---------- */
const lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbX = $("#lbX");
let lastBtn = null;
function openLb(btn) {
  const img = $("img", btn);
  lastBtn = btn;
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = btn.parentElement.querySelector("figcaption").textContent;
  lb.hidden = false;
  document.body.classList.add("lock");
  lbX.focus();
}
function closeLb() {
  lb.hidden = true;
  lbImg.src = "";
  document.body.classList.remove("lock");
  if (lastBtn) lastBtn.focus();
}
$$(".gbtn").forEach(b => b.addEventListener("click", () => openLb(b)));
lbX.addEventListener("click", closeLb);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!lb.hidden) closeLb(); else if (menu.classList.contains("open")) setMenu(false);
});

$("#yr").textContent = new Date().getFullYear();
