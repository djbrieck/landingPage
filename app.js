const STORAGE_KEY = "linkhub_links_v1";
const SETTINGS_KEY = "linkhub_settings_v1";

// DOM
const linksList = document.getElementById("linksList");
const emptyEl = document.getElementById("empty");
const noResultsEl = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const addBtn = document.getElementById("addBtn");
const settingsBtn = document.getElementById("settingsBtn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const linkForm = document.getElementById("linkForm");
const titleInput = document.getElementById("titleInput");
const urlInput = document.getElementById("urlInput");
const cancelBtn = document.getElementById("cancelBtn");

const settingsModal = document.getElementById("settingsModal");
const searchEngineInput = document.getElementById("searchEngineInput");
const showCountsInput = document.getElementById("showCountsInput");
const darkModeInput = document.getElementById("darkModeInput");
const importJsonInput = document.getElementById("importJsonInput");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const importBookmarksInput = document.getElementById("importBookmarksInput");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const linkCountDisplay = document.getElementById("linkCount");

let links = [];
let settings = {
  searchEngine: "https://duckduckgo.com/?q=%s",
  showCounts: false,
  darkMode: false,
};
let editingId = null;
let selectedIndex = -1;
let currentDisplayList = [];

function load() {
  try {
    links = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    links = [];
  }
  try {
    settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || settings;
  } catch (e) {}
}

function isQuotaExceeded(e) {
  return (
    e &&
    (e.code === 22 ||
      e.code === 1014 ||
      e.name === "QuotaExceededError" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (e) {
    if (isQuotaExceeded(e))
      alert("Local storage quota exceeded – could not save links.");
    else console.error(e);
    return false;
  }
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    if (isQuotaExceeded(e))
      alert("Local storage quota exceeded – could not save settings.");
    else console.error(e);
    return false;
  }
  return true;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function sortLinks(arr) {
  return arr
    .slice()
    .sort((a, b) => b.clicks - a.clicks || a.createdAt - b.createdAt);
}

function render(list = links) {
  const sorted = sortLinks(list);
  currentDisplayList = sorted;
  linksList.innerHTML = "";

  emptyEl.style.display = "none";
  noResultsEl.style.display = "none";

  if (links.length === 0) {
    emptyEl.style.display = "block";
    selectedIndex = -1;
    return;
  } else {
    if (sorted.length === 0) {
      noResultsEl.style.display = "block";
      return;
    }
  }

  for (let idx = 0; idx < sorted.length; idx++) {
    const item = sorted[idx];
    const li = document.createElement("li");
    li.className = "link-item";
    if (idx === selectedIndex) li.classList.add("selected");
    li.style.cursor = "pointer";
    li.dataset.index = idx;

    const left = document.createElement("div");
    left.className = "link-left";
    const main = document.createElement("div");
    main.className = "link-main";
    const title = document.createElement("div");
    title.className = "link-title";
    title.title = item.title;
    title.textContent = item.title;
    const url = document.createElement("div");
    url.className = "link-url";
    url.textContent = item.url;
    title.title = item.url; // full url shown on hover
    main.appendChild(title); // omit url node
    left.appendChild(main);

    const right = document.createElement("div");
    right.className = "actions";
    let count;
    if (settings.showCounts) {
      count = document.createElement("span");
      count.className = "count";
      count.textContent = `Clicks: ${item.clicks || 0}`;
    }
    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-btn";
    menuBtn.innerHTML = "⋯";
    const menu = document.createElement("div");
    menu.className = "menu";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    menu.appendChild(editBtn);
    menu.appendChild(delBtn);
    if (count) right.appendChild(count);
    right.appendChild(menuBtn);
    right.appendChild(menu);

    menuBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      menu.classList.toggle("show");
    });

    editBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openEdit(item);
      menu.classList.remove("show");
    });
    delBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (confirm("Delete link?")) {
        deleteLink(item.id);
      }
      menu.classList.remove("show");
    });

    li.appendChild(left);
    li.appendChild(right);
    li.dataset.itemId = item.id;
    linksList.appendChild(li);
  }
}

function openAdd() {
  editingId = null;
  modalTitle.textContent = "Add Link";
  titleInput.value = "";
  urlInput.value = "";
  modal.classList.remove("hidden");
}
function openEdit(item) {
  editingId = item.id;
  modalTitle.textContent = "Edit Link";
  titleInput.value = item.title;
  urlInput.value = item.url;
  modal.classList.remove("hidden");
}
function closeModal() {
  modal.classList.add("hidden");
}

linkForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const t = titleInput.value.trim();
  let u = urlInput.value.trim();
  if (!u.match(/^https?:\/\//)) u = "https://" + u;
  if (editingId) {
    const idx = links.findIndex((x) => x.id === editingId);
    if (idx > -1) {
      links[idx].title = t;
      links[idx].url = u;
    }
  } else {
    links.push({
      id: uid(),
      title: t,
      url: u,
      clicks: 0,
      createdAt: Date.now(),
    });
  }
  if (!save()) alert("Could not save link; storage may be full.");
  closeModal();
  render();
});
cancelBtn.addEventListener("click", closeModal);

function deleteLink(id) {
  links = links.filter((x) => x.id !== id);
  if (!save()) alert("Could not save deletion; storage may be full.");
  render();
}

function selectFirstLink() {
  if (currentDisplayList.length > 0) {
    selectedIndex = 0;
    render(currentDisplayList);
  }
}

function moveSelection(direction) {
  if (currentDisplayList.length === 0) return;
  selectedIndex = Math.max(
    0,
    Math.min(selectedIndex + direction, currentDisplayList.length - 1),
  );
  render(currentDisplayList);
}

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  selectedIndex = -1;
  render();
});
// delegated click handler for list items
linksList.addEventListener("click", (e) => {
  const li = e.target.closest(".link-item");
  if (!li || e.target.closest(".menu-btn") || e.target.closest(".menu")) return;
  e.preventDefault();
  e.stopPropagation();
  const itemId = li.dataset.itemId;
  const item = links.find((x) => x.id === itemId);
  if (!item) return;
  item.clicks = (item.clicks || 0) + 1;
  if (!save()) alert("Click count could not be saved; storage may be full.");
  window.location.href = item.url;
});
// close menu on document click
document.addEventListener("click", () => {
  document
    .querySelectorAll(".menu.show")
    .forEach((m) => m.classList.remove("show"));
});
// live filter while typing (no redirect)
searchInput.addEventListener("input", () => {
  selectedIndex = -1;
  performSearch(false);
});
// Some browsers or paste/autocomplete may not trigger input consistently; add extra hooks
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (selectedIndex < 0) selectFirstLink();
    else moveSelection(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    moveSelection(-1);
  } else if (e.key !== "Enter") {
    selectedIndex = -1;
    performSearch(false);
  }
});
searchInput.addEventListener("paste", () => {
  selectedIndex = -1;
  setTimeout(() => performSearch(false), 20);
});
// Enter runs search: if there are matches it will show them, otherwise it will redirect
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (selectedIndex >= 0 && currentDisplayList.length > selectedIndex) {
      const item = currentDisplayList[selectedIndex];
      item.clicks = (item.clicks || 0) + 1;
      if (!save())
        alert("Click count could not be saved; storage may be full.");
      window.location.href = item.url;
    } else {
      performSearch(true);
    }
  }
});

function performSearch(allowRedirect = false) {
  const q = searchInput.value.trim();
  if (!q) {
    render();
    return;
  }
  const filtered = links.filter(
    (l) =>
      (l.title || "").toLowerCase().includes(q.toLowerCase()) ||
      (l.url || "").toLowerCase().includes(q.toLowerCase()),
  );
  
  // Allways render matches for UI
  render(filtered);

  if (allowRedirect) {
    const engine = settings.searchEngine;
    const url = engine.replace("%s", encodeURIComponent(q));
    window.open(url, "_blank");
  }
}

addBtn.addEventListener("click", openAdd);
settingsBtn.addEventListener("click", () => {
  searchEngineInput.value = settings.searchEngine || "";
  showCountsInput.checked = !!settings.showCounts;
  darkModeInput.checked = !!settings.darkMode;
  updateLinkCount();
  settingsModal.classList.remove("hidden");
});
closeSettingsBtn.addEventListener("click", () =>
  settingsModal.classList.add("hidden"),
);
saveSettingsBtn.addEventListener("click", () => {
  settings.searchEngine = searchEngineInput.value || settings.searchEngine;
  settings.showCounts = showCountsInput.checked;
  settings.darkMode = darkModeInput.checked;
  applyTheme();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  settingsModal.classList.add("hidden");
});

exportJsonBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(links, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "links-export.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

importJsonInput.addEventListener("change", (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(reader.result);
      if (Array.isArray(arr)) {
        // merge
        for (const it of arr) {
          if (it.url) {
            if (!links.some((x) => x.url === it.url)) {
              links.push({
                id: uid(),
                title: it.title || it.url,
                url: it.url,
                clicks: it.clicks || 0,
                createdAt: it.createdAt || Date.now(),
              });
            }
          }
        }
        save();
        render();
        alert("Imported JSON successfully");
      } else alert("JSON must be an array of link objects");
    } catch (e) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(f);
});

importBookmarksInput.addEventListener("change", (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    const html = reader.result;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const anchors = Array.from(doc.querySelectorAll("a"));
    let added = 0;
    for (const a of anchors) {
      const href = a.getAttribute("href");
      const text = a.textContent.trim() || href;
      if (href && !links.some((x) => x.url === href)) {
        links.push({
          id: uid(),
          title: text,
          url: href,
          clicks: 0,
          createdAt: Date.now(),
        });
        added++;
      }
    }
    save();
    render();
    alert(`Imported ${added} bookmarks`);
  };
  reader.readAsText(f);
});

// initial demo data if empty
function seedIfEmpty() {}

// ensure page resets properly on back button
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    // back button - reload data but keep search filter
    load();
    performSearch(false);
  } else {
    // fresh load (new tab/window) - reset completely
    selectedIndex = -1;
    searchInput.value = "";
    render();
  }
});

load();
applyTheme();
seedIfEmpty();
render();

function applyTheme() {
  if (settings.darkMode) document.body.classList.add("dark");
  else document.body.classList.remove("dark");
}

function updateLinkCount() {
  if (linkCountDisplay) linkCountDisplay.textContent = links.length;
}
