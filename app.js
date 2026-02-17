const wiki = document.getElementById("wiki");
const nav = document.getElementById("nav");
const searchInput = document.getElementById("search");
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

let pages = [];

async function init() {
  const res = await fetch("pages.json");
  pages = await res.json();

  buildSidebar();
  loadPage(location.hash.substring(1) || "home");
}

function buildSidebar(filter = "") {
  nav.innerHTML = "";

  pages
    .filter(p => p.toLowerCase().includes(filter.toLowerCase()))
    .forEach(page => {
      const link = document.createElement("a");
      link.href = `#${page}`;
      link.textContent = capitalize(page);
      nav.appendChild(link);
    });

  highlightActive();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadPage(page) {
  try {
    const res = await fetch(`pages/${page}.md`);
    if (!res.ok) throw new Error();

    const text = await res.text();
    wiki.innerHTML = marked.parse(text);

    interceptLinks();
    highlightActive();

    // Auto close sidebar on mobile after clicking
    if (window.innerWidth < 900) {
      sidebar.classList.add("collapsed");
    }

  } catch {
    wiki.innerHTML = "<h1>404</h1><p>Page not found.</p>";
  }
}

function interceptLinks() {
  document.querySelectorAll(".content a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href.startsWith("http")) {
      link.onclick = (e) => {
        e.preventDefault();
        location.hash = href;
      };
    }
  });
}

function highlightActive() {
  const current = location.hash.substring(1) || "home";
  document.querySelectorAll("#nav a").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("hashchange", () => {
  loadPage(location.hash.substring(1));
});

searchInput.addEventListener("input", (e) => {
  buildSidebar(e.target.value);
});

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

init();
