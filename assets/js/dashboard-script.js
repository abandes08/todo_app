document.addEventListener("DOMContentLoaded", () => {
    //Load the function after HTML structure is loaded.
    loadDashboardStats();
    loadRecentActivity();
    formatTimeAgo();
    formatStatus();
});

async function loadDashboardStats() {
    try {
        const response = await fetch("/api/stats/dashboard_stats.php")
        const data = await response.json();
        // Debug: log the full JSON
        //console.log("API response JSON:", data);

        if (data.status !=="success") {
            console.error("Failed to load tasks statistics.");
            return;
        }

        const stats = data.data;

        // Update UI
        const personalCount = stats[1] || 0;
        document.getElementById("personalCount").textContent =
        `You have ${personalCount} ${personalCount === 1 ? "Task" : "Tasks"} to complete.`;

        const workCount = stats[2] || 0;
        document.getElementById("workCount").textContent =
        `You have ${workCount} ${workCount === 1 ? "Task" : "Tasks"} to complete.`;

        const shoppingCount = stats[3] || 0;
        document.getElementById("shoppingCount").textContent =
        `You have ${shoppingCount} ${shoppingCount === 1 ? "Task" : "Tasks"} to complete.`;

        const healthCount = stats[4] || 0;
        document.getElementById("healthCount").textContent =
        `You have ${healthCount} ${healthCount === 1 ? "Task" : "Tasks"} to complete.`;

        const hobbyCount = stats[5] || 0;
        document.getElementById("hobbyCount").textContent =
        `You have ${hobbyCount} ${hobbyCount === 1 ? "Task" : "Tasks"} to complete.`;
    
    } catch(error) {
        console.error("Error:", error);
        console.error("Error loading dashboard stats:", error);
    }
}

async function loadRecentActivity() {
    try {
        const response = await fetch("api/lookup/get_recent_activity.php")
        const data = await response.json();

        if (data.status !=="success") {
            console.error("Failed to load recent activity.")
            return;
        }

        const list = document.getElementById("recentActivityList");
        list.innerHTML = ""; //clear old items
        
        data.activities.forEach(item => {
            const li = document.createElement("li");
            const timeAgo = formatTimeAgo(item.time);
            const action = formatStatus(item.status);

            li.innerHTML = `
            <span class="activity-time">${timeAgo}:</span>
            ${action} "${item.task}"
            `;

            list.appendChild(li);
        });

    } catch (error) {
        console.error("Error loading recent activity:", error);
    }
}

// HELPER
function formatTimeAgo(datetime) {
    const now = new Date(); // current date & time
    const past = new Date(datetime); // some earlier date/time you pass in
    const diff = Math.floor((now-past) / 1000);

    if (diff < 60) return "Just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

function formatStatus(status) {
  switch (String(status)) {
    case "1":
      return "🕒 Added";
    case "2":
      return "🔄 In Progress";
    case "3":
      return "✅ Completed";
    case "4":
      return "⏸️ On-Hold";
    case "5":
      return "❌ Cancelled";
    default:
      return "📌 Unknown";
  }
}