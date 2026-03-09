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
                    <td>${index + 1}</td>
                    <td>${task.created_at || ''}</td>
                    <td>${task.task}</td>
                    <td><span class="badge bg-info">${task.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1">Edit</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                    </td>
                `;

                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

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

// Load tasks on page load
loadTasks();