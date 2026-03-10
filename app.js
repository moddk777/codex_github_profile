const STORAGE_KEY = "portfolio_lang";
const SUPPORTED_LANGS = ["ko", "en"];

function getByPath(target, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, target);
}

function readValue(lang, path) {
  const fromLang = getByPath(CONTENT[lang], path);
  if (fromLang !== undefined && fromLang !== null && fromLang !== "") {
    return fromLang;
  }
  return getByPath(CONTENT.ko, path);
}

function readArray(lang, key) {
  const localized = CONTENT[lang] && Array.isArray(CONTENT[lang][key]) ? CONTENT[lang][key] : [];
  const fallback = Array.isArray(CONTENT.ko[key]) ? CONTENT.ko[key] : [];
  const maxLength = Math.max(localized.length, fallback.length);
  const merged = [];

  for (let i = 0; i < maxLength; i += 1) {
    const localItem = localized[i] || {};
    const fallbackItem = fallback[i] || {};
    merged.push({ ...fallbackItem, ...localItem });
  }
  return merged;
}

function readObject(lang, key) {
  const localized = CONTENT[lang] && CONTENT[lang][key] ? CONTENT[lang][key] : {};
  const fallback = CONTENT.ko[key] || {};
  return { ...fallback, ...localized };
}

function applyStaticTexts(lang) {
  const nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const value = readValue(lang, key);
    if (value !== undefined && value !== null) {
      node.textContent = String(value);
    }
  });
}

function renderExperience(lang) {
  const root = document.getElementById("experience-list");
  if (!root) return;

  const entries = readArray(lang, "experience");
  root.innerHTML = "";

  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "experience-item";

    const head = document.createElement("div");
    head.className = "experience-head";

    const role = document.createElement("h3");
    role.textContent = entry.role || "";

    const org = document.createElement("p");
    org.className = "experience-org";
    org.textContent = entry.org || "";

    const period = document.createElement("p");
    period.className = "experience-period";
    period.textContent = entry.period || "";

    const summary = document.createElement("p");
    summary.className = "experience-summary";
    summary.textContent = entry.summary || "";

    head.append(role, period);
    card.append(head, org, summary);
    root.append(card);
  });
}

function renderProjects(lang) {
  const root = document.getElementById("projects-list");
  if (!root) return;

  const projects = readArray(lang, "projects");
  const periodLabel = readValue(lang, "ui.projectPeriod");
  const techLabel = readValue(lang, "ui.projectTech");
  const linkLabel = readValue(lang, "ui.projectLink");
  root.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = project.title || "";

    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary || "";

    const meta = document.createElement("div");
    meta.className = "project-meta";
    meta.innerHTML = `<span>${periodLabel}: ${project.period || "-"}</span>`;

    const techRow = document.createElement("div");
    techRow.className = "project-tech-row";

    const techTitle = document.createElement("span");
    techTitle.className = "tech-title";
    techTitle.textContent = `${techLabel}:`;

    const techList = document.createElement("ul");
    techList.className = "tech-list";
    (project.tech || []).forEach((tech) => {
      const badge = document.createElement("li");
      badge.textContent = tech;
      techList.append(badge);
    });

    const link = document.createElement("a");
    link.className = "project-link";
    link.href = project.link || "#";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = linkLabel;

    techRow.append(techTitle, techList);
    card.append(title, summary, meta, techRow, link);
    root.append(card);
  });
}

function updateContactLinks(lang) {
  const contact = readObject(lang, "contact");
  const email = typeof contact.email === "string" ? contact.email : "";
  const github = typeof contact.github === "string" ? contact.github : "";
  const linkedin = typeof contact.linkedin === "string" ? contact.linkedin : "";
  const emailNode = document.getElementById("contact-email");
  const githubNode = document.getElementById("contact-github");
  const linkedinNode = document.getElementById("contact-linkedin");

  if (emailNode) {
    emailNode.href = email ? `mailto:${email}` : "#";
    emailNode.textContent = email || "-";
  }
  if (githubNode) {
    githubNode.href = github || "#";
    githubNode.textContent = github ? github.replace(/^https?:\/\//, "") : "-";
  }
  if (linkedinNode) {
    linkedinNode.href = linkedin || "#";
    linkedinNode.textContent = linkedin ? linkedin.replace(/^https?:\/\//, "") : "-";
  }

  document.querySelectorAll("[data-contact-item]").forEach((item) => {
    const key = item.getAttribute("data-contact-item");
    const value = key === "email" ? email : key === "github" ? github : linkedin;
    item.hidden = !value;
  });
}

function setActiveToggle(lang) {
  document.querySelectorAll(".lang-btn").forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function persistLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_) {
    // Ignore storage access issues in privacy mode.
  }
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }
  } catch (_) {
    // Ignore storage access issues in privacy mode.
  }
  return "ko";
}

function applyLanguage(requestedLang) {
  const lang = SUPPORTED_LANGS.includes(requestedLang) ? requestedLang : "ko";
  document.documentElement.lang = lang;
  applyStaticTexts(lang);
  renderExperience(lang);
  renderProjects(lang);
  updateContactLinks(lang);
  setActiveToggle(lang);
  persistLanguage(lang);
}

function bindLanguageToggle() {
  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.lang);
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  bindLanguageToggle();
  applyLanguage(getInitialLanguage());
  document.body.classList.add("is-ready");
});
