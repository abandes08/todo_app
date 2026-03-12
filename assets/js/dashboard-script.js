const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

const text = document.getElementById("text");
const sidebarLogo = document.getElementById("sidebarLogo"); 

/* ===== LOAD SAVED SIDEBAR STATE ===== */

const savedState = localStorage.getItem("sidebarState");

if (savedState === "open") {
    sidebar.classList.add("open");
    toggleBtn.classList.add("active");

    text.classList.remove("hidden");
    sidebarLogo.classList.add("hidden");
}

else if (savedState === "collapsed") {
    sidebar.classList.add("collapsed");
    toggleBtn.classList.add("active");

    text.classList.add("hidden");
    sidebarLogo.classList.remove("hidden");
} 

else {
    // default state: hidden
    sidebar.classList.remove("open", "collapsed");
    toggleBtn.classList.remove("active");

    text.classList.remove("hidden");
    sidebarLogo.classList.add("hidden");
}

/* ===== TOGGLE SIDEBAR ===== */
toggleBtn.addEventListener("click", () => {
  /* STATE 1: hidden → open */
  if (!sidebar.classList.contains("open") && !sidebar.classList.contains("collapsed")) {
    sidebar.classList.add("open");
    toggleBtn.classList.add("active");

    text.classList.remove("hidden");
    sidebarLogo.classList.add("hidden");

    localStorage.setItem("sidebarState", "open");
  }

  /* STATE 2: open → collapsed */
  else if (sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    sidebar.classList.add("collapsed");

    text.classList.add("hidden");
    sidebarLogo.classList.remove("hidden");

    localStorage.setItem("sidebarState", "collapsed");
  }

  /* STATE 3: collapsed → hidden */
  else if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    toggleBtn.classList.remove("active");

    text.classList.remove("hidden");
    sidebarLogo.classList.add("hidden");

    localStorage.setItem("sidebarState", "hidden");
  }
});