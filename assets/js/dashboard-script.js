const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

const text = document.getElementById("text");    
const sidebarLogo = document.getElementById("sidebarLogo");

toggleBtn.addEventListener("click", () => {
  // Collapse sidebar + main content
  sidebar.classList.toggle("collapsed");
  mainContent.classList.toggle("collapsed");

  // Swap text and logo
  if (text.classList.contains("hidden")) {
    text.classList.remove("hidden");       // show text
    sidebarLogo.classList.add("hidden");   // hide logo
  } else {
    text.classList.add("hidden");          // hide text
    sidebarLogo.classList.remove("hidden"); // show logo
  }

  // Animate toggle button to a cross (X) when active
  toggleBtn.classList.toggle("active");
});