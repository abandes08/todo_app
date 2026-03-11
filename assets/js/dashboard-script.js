const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

const text = document.getElementById("text");
const sidebarLogo = document.getElementById("sidebarLogo");

/* ===== LOAD SAVED SIDEBAR STATE ===== */

if (localStorage.getItem("sidebarCollapsed") === "true") {
  sidebar.classList.add("collapsed");
  mainContent.classList.add("collapsed");

  text.classList.add("hidden");
  sidebarLogo.classList.remove("hidden");

  toggleBtn.classList.add("active");
}

/* ===== TOGGLE SIDEBAR ===== */

toggleBtn.addEventListener("click", () => {

  sidebar.classList.toggle("collapsed");
  mainContent.classList.toggle("collapsed");

  if (text.classList.contains("hidden")) {
    text.classList.remove("hidden");
    sidebarLogo.classList.add("hidden");
  } else {
    text.classList.add("hidden");
    sidebarLogo.classList.remove("hidden");
  }

  toggleBtn.classList.toggle("active");

  /* SAVE STATE */
  const isCollapsed = sidebar.classList.contains("collapsed");
  localStorage.setItem("sidebarCollapsed", isCollapsed);
});