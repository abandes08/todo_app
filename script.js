const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const statusInput = document.getElementById('statusInput');
const addTaskBtn = document.getElementById('addTaskBtn');

function loadTasks() {
    fetch("api/get_tasks.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('taskTableBody');
            tableBody.innerHTML = '';

            data.forEach((task, index) => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${task.created_at || ''}</td>
                    <td>${task.task}</td>
                    <td class="text-center"><span class="badge bg-info">${task.status}</span></td>
                    <td class="text-center">
                        <button onclick="editTask(${task.id})" class="btn btn-warning btn-sm" title="Edit">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button onclick="deleteTask(${task.id})" class="btn btn-danger btn-sm" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;

                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Add function for ToDo List App
function addTask() {
    const newTask = taskInput.value.trim();
    const newStatus = statusInput.value;

    if (newTask === '') {
        alert('Please enter a task');
        return;
    }

    fetch("api/add_task.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask, status: newStatus })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                taskInput.value = '';
                statusInput.value = 'Created'; // reset to default
                loadTasks();
            } else {
                alert('Error saving task');
            }
        })
        .catch(error => console.error('Error adding task:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    addTaskBtn.addEventListener('click', addTask);
});


// Edit functions for ToDo List App
function editTask(id) {
    const newTask = prompt("Edit task:");
    if (!newTask) return;

    const newStatus = prompt("Update status (Created, Ongoing, On-Hold, Completed, Cancelled, Overdue):");
    if (!newStatus) return;

    fetch("api/edit_task.php", {
        method: "POST", // matches your PHP script
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            task: newTask,
            status: newStatus
        })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                loadTasks();
            } else {
                alert("Error updating task: " + (result.message || "Unknown error"));
            }
        })
        .catch(error => console.error("Error updating task:", error));
}

//Destroy function for ToDo List App
function deleteTask(id) {
    fetch(`api/delete_task.php?id=${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                loadTasks();
            } else {
                alert('Error deleting task');
            }
        })
        .catch(error => console.error('Error deleting task:', error));
}

// Load tasks on page load
loadTasks();

