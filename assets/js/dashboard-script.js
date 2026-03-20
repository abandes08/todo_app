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

        // Update UI
        const personalCount = stats[1] || 0;
        document.getElementById("personalCount").textContent =
        `You have ${personalCount} ${personalCount === 1 ? "Task" : "Tasks"}`;

        const workCount = stats[2] || 0;
        document.getElementById("workCount").textContent =
        `You have ${workCount} ${workCount === 1 ? "Task" : "Tasks"}`;

        const shoppingCount = stats[3] || 0;
        document.getElementById("shoppingCount").textContent =
        `You have ${shoppingCount} ${shoppingCount === 1 ? "Task" : "Tasks"}`;

        const healthCount = stats[4] || 0;
        document.getElementById("healthCount").textContent =
        `You have ${healthCount} ${healthCount === 1 ? "Task" : "Tasks"}`;

        const hobbyCount = stats[5] || 0;
        document.getElementById("hobbyCount").textContent =
        `You have ${hobbyCount} ${hobbyCount === 1 ? "Task" : "Tasks"}`;
    
    } catch(error) {
        console.error("Error:", error);
        console.error("Error loading dashboard stats:", error);
    }
}