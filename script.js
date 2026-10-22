const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const search = document.getElementById("search");
const tagFilter = document.getElementById("tag-filter");

const COLORS = ["#2563eb", "#c2410c", "#7e22ce", "#be185d", "#0f766e", "#b45309", "#3730a3", "#15803d"];

let sites = [];
let activeTag = null;

function colorFor(text) {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function hostOf(url) {
  try {
    const u = new URL(url);
    return u.host + u.pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}

function makeThumb(site) {
  const wrap = document.createElement("div");
  wrap.className = "thumb";
  if (site.thumb) {
    const img = document.createElement("img");
    img.src = site.thumb;
    img.alt = "";
    img.loading = "lazy";
    wrap.appendChild(img);
  } else {
    wrap.style.background = colorFor(site.title);
    wrap.textContent = [...site.title.trim()][0] || "?";
  }
  return wrap;
}

function render() {
  const q = search.value.trim().toLowerCase();
  const list = sites.filter((s) => {
    if (activeTag && !(s.tags || []).includes(activeTag)) return false;
    if (!q) return true;
    const text = [s.title, s.desc, s.url, ...(s.tags || [])].join(" ").toLowerCase();
    return text.includes(q);
  });

  grid.innerHTML = "";
  empty.hidden = list.length > 0;
  count.textContent = `${list.length} / ${sites.length} 件`;

  for (const s of list) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = s.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h2");
    title.textContent = s.title;

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = s.desc || "";

    const url = document.createElement("p");
    url.className = "url";
    url.textContent = hostOf(s.url);

    const tags = document.createElement("div");
    tags.className = "tags";
    for (const t of s.tags || []) {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      tags.appendChild(span);
    }

    body.append(title, desc, url, tags);
    card.append(makeThumb(s), body);
    grid.appendChild(card);
  }
}

function renderTags() {
  const all = [...new Set(sites.flatMap((s) => s.tags || []))];
  tagFilter.innerHTML = "";
  for (const t of [null, ...all]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t ?? "すべて";
    b.setAttribute("aria-pressed", String(activeTag === t));
    b.addEventListener("click", () => {
      activeTag = t;
      renderTags();
      render();
    });
    tagFilter.appendChild(b);
  }
}

search.addEventListener("input", render);

fetch("sites.json", { cache: "no-cache" })
  .then((r) => r.json())
  .then((data) => {
    sites = data.filter((s) => s && s.title && s.url);
    renderTags();
    render();
  })
  .catch((err) => {
    console.error(err);
    count.textContent = "一覧を読み込めませんでした。";
  });
