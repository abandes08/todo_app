document.addEventListener("DOMContentLoaded", () => {
    //Load the function after HTML structure is loaded.
    loadDashboardStats();
});

async function loadDashboardStats() {
    try {
        const response = await fetch("/api/stats/dashboard_stats.php")
        const data = await response.json();
        // Debug: log the full JSON
        //console.log("API response JSON:", data);

        if (data.status !=="success") {
            console.error("Failed to load stats");
            return;
        }

        const stats = data.data;

        //Update UI
        document.getElementById("personalCount").textContent = (stats[1] || 0) + " Tasks";
        document.getElementById("workCount").textContent = (stats[2]|| 0) + " Tasks";
        document.getElementById("shoppingCount").textContent = (stats[3] || 0) + " Tasks";
        document.getElementById("healthCount").textContent = (stats[4] || 0) + " Tasks";
        document.getElementById("hobbyCount").textContent = (stats[5] || 0) + " Tasks";
    
    } catch(error) {
        console.error("Error:", error);
        console.error("Error loading dashboard stats:", error);
    }
}